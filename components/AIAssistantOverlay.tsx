
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Modality, LiveServerMessage, Blob } from '@google/genai';
import PigeonMascot from './PigeonMascot';
import { MessageSquare, Terminal, AlertCircle, Volume2, MicOff, Wifi } from 'lucide-react';

// Manual Base64 helpers as per guidelines
function encode(bytes: Uint8Array) {
  let binary = '';
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
}

function decode(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

function createBlob(data: Float32Array): Blob {
  const l = data.length;
  const int16 = new Int16Array(l);
  for (let i = 0; i < l; i++) {
    int16[i] = Math.max(-32768, Math.min(32767, data[i] * 32768));
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: 'audio/pcm;rate=16000',
  };
}

const AIAssistantOverlay: React.FC = () => {
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [notification, setNotification] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [transcription, setTranscription] = useState<{user: string, ai: string}>({user: '', ai: ''});

  const inCtxRef = useRef<AudioContext | null>(null);
  const outCtxRef = useRef<AudioContext | null>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef(new Set<AudioBufferSourceNode>());
  const sessionRef = useRef<Promise<any> | null>(null);
  const isActiveRef = useRef(false);

  const cleanup = async () => {
    isActiveRef.current = false;
    setIsListening(false);
    setIsSpeaking(false);
    
    // Clear playback
    sourcesRef.current.forEach(source => { try { source.stop(); } catch (e) {} });
    sourcesRef.current.clear();

    if (sessionRef.current) {
      try {
        const session = await sessionRef.current;
        session.close();
      } catch (e) {}
      sessionRef.current = null;
    }

    if (scriptProcessorRef.current) {
      scriptProcessorRef.current.disconnect();
      scriptProcessorRef.current = null;
    }

    if (inCtxRef.current) {
      try { await inCtxRef.current.close(); } catch (e) {}
      inCtxRef.current = null;
    }
    
    if (outCtxRef.current) {
      try { await outCtxRef.current.close(); } catch (e) {}
      outCtxRef.current = null;
    }

    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    
    nextStartTimeRef.current = 0;
  };

  const handleLiveInteraction = async () => {
    if (isListening) {
      await cleanup();
      return;
    }

    setError(null);
    setTranscription({user: '', ai: ''});
    
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Microphone access is not supported by this browser.");
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      isActiveRef.current = true;

      // Initialize Audio Contexts
      const inCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      
      // CRITICAL: Resume contexts on user gesture
      await inCtx.resume();
      await outCtx.resume();
      
      inCtxRef.current = inCtx;
      outCtxRef.current = outCtx;

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      setIsListening(true);

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-12-2025',
        callbacks: {
          onopen: () => {
            const source = inCtx.createMediaStreamSource(stream);
            const scriptProcessor = inCtx.createScriptProcessor(4096, 1, 1);
            scriptProcessorRef.current = scriptProcessor;

            scriptProcessor.onaudioprocess = (e) => {
              if (!isActiveRef.current) return;
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmBlob = createBlob(inputData);
              sessionPromise.then((session) => {
                if (isActiveRef.current) {
                  try { session.sendRealtimeInput({ media: pcmBlob }); } catch (err) {}
                }
              });
            };

            source.connect(scriptProcessor);
            scriptProcessor.connect(inCtx.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            if (!isActiveRef.current) return;

            // Transcriptions
            if (message.serverContent?.inputTranscription) {
              setTranscription(prev => ({ ...prev, user: message.serverContent?.inputTranscription?.text || '' }));
            }
            if (message.serverContent?.outputTranscription) {
              setTranscription(prev => ({ ...prev, ai: (prev.ai + (message.serverContent?.outputTranscription?.text || '')) }));
            }

            const base64EncodedAudioString = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (base64EncodedAudioString) {
              setIsSpeaking(true);
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outCtx.currentTime);
              
              try {
                const audioBuffer = await decodeAudioData(
                  decode(base64EncodedAudioString),
                  outCtx,
                  24000,
                  1,
                );
                const source = outCtx.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(outCtx.destination);
                
                source.addEventListener('ended', () => {
                  sourcesRef.current.delete(source);
                  if (sourcesRef.current.size === 0) {
                    setIsSpeaking(false);
                    // Clear user text but keep AI text briefly for reading
                    setTranscription(prev => ({...prev, user: ''}));
                  }
                });

                source.start(nextStartTimeRef.current);
                nextStartTimeRef.current = nextStartTimeRef.current + audioBuffer.duration;
                sourcesRef.current.add(source); // FIXED: Added .current
              } catch (decodeErr) {
                console.error("Audio Decoding Failed", decodeErr);
              }
            }

            const interrupted = message.serverContent?.interrupted;
            if (interrupted) {
              sourcesRef.current.forEach(source => { try { source.stop(); } catch (e) {} });
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
              setIsSpeaking(false);
              setTranscription({user: 'Interrupted', ai: ''});
            }
          },
          onerror: (e) => {
            console.error("Live API Error State:", e);
            setError("Network Link Severed. Reconnecting...");
            setTimeout(() => cleanup(), 2000);
          },
          onclose: () => cleanup(),
        },
        config: {
          responseModalities: [Modality.AUDIO],
          inputAudioTranscription: {},
          outputAudioTranscription: {},
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Puck' } },
          },
          systemInstruction: `IDENTITY: You are Pigeon AI, the mascot and advanced brain of Pigeon Ops SCM. Commander is Aditya Gawner. 

CORE PERSONALITY:
- Professional, efficient, futuristic, Jarvis-style assistant.
- Highly proactive about supply chain risks.

CURRENT GROUNDING DATA (STRICTLY ADHERE TO THIS):
- Commander: Aditya Gawner.
- MATERIAL STATUS: 
  * Wiring: CRITICAL (12%). Reroute required.
  * Steel: Stable (85%). Market dip projected Friday (-4%).
  * Chips: Stable (68%).
  * Composite: Low (42%).
- SHIPMENTS:
  * Batch 44A (Singapore): ETA 48 Hours.
  * Rotterdam: 12 Days.
- WEATHER ALERT: Severe storm in the North Sea impacting North Atlantic transit routes.

INTERACTION STYLE:
- Greet Aditya as "Commander" or "Aditya".
- Keep voice answers short (under 2 sentences).
- If asked "What is the status?", mention the Wiring level being at 12% and the North Sea storm alert.
- If asked about negotiations, suggest waiting for the Friday dip in Steel prices.`,
        },
      });
      
      sessionRef.current = sessionPromise;

    } catch (err: any) {
      console.error("Initialization Error:", err);
      setError(err.message || "Connection refused");
      cleanup();
    }
  };

  useEffect(() => {
    setNotification("Pigeon AI: All systems green. Standing by for Commander Aditya.");
    const timer = setTimeout(() => setNotification(null), 5000);
    return () => {
      clearTimeout(timer);
      cleanup();
    };
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4 pointer-events-none">
      {/* Transcription HUD */}
      {isListening && (
        <div className="flex flex-col gap-2 max-w-sm pointer-events-auto animate-in fade-in slide-in-from-right-4">
          <div className="flex items-center gap-2 justify-end mb-1">
             <div className="flex gap-0.5">
               {[1,2,3].map(i => (
                 <div key={i} className="w-1 h-2 bg-emerald-500 rounded-full animate-pulse" />
               ))}
             </div>
             <span className="text-[9px] font-black text-emerald-500 uppercase tracking-tighter">Secure Link</span>
             <Wifi size={10} className="text-emerald-500" />
          </div>
          
          {transcription.user && (
            <div className="glass px-4 py-2 rounded-2xl text-[11px] font-medium text-slate-400 self-end border-white/5 bg-slate-900/40 backdrop-blur-md">
              <span className="text-cyan-500 mr-2 uppercase text-[9px] font-black italic">User:</span>
              {transcription.user}
            </div>
          )}
          {transcription.ai && (
            <div className="glass px-4 py-3 rounded-2xl text-xs font-orbitron text-cyan-400 border-cyan-500/20 bg-cyan-950/30 backdrop-blur-md shadow-[0_0_20px_rgba(34,211,238,0.05)]">
              <div className="flex items-center gap-2 mb-1">
                <Volume2 size={12} className="animate-pulse text-cyan-500" />
                <span className="uppercase text-[9px] font-black tracking-widest text-cyan-500/80">Pigeon Intelligence</span>
              </div>
              {transcription.ai}
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="glass border-rose-500/50 px-4 py-2 rounded-lg text-rose-400 text-[10px] font-bold flex items-center gap-2 pointer-events-auto animate-in fade-in slide-in-from-right">
          <AlertCircle size={14} />
          {error}
        </div>
      )}
      
      {notification && (
        <div className="glass neon-border px-4 py-2 rounded-lg text-cyan-400 text-[11px] font-orbitron max-w-xs animate-bounce pointer-events-auto uppercase tracking-tighter">
          {notification}
        </div>
      )}
      
      <div className="flex items-center gap-4">
        {isListening && (
          <div className="flex flex-col items-end gap-1">
            <div className="glass px-3 py-1 rounded-full text-[9px] text-cyan-500 font-black uppercase tracking-widest animate-pulse pointer-events-auto border-cyan-500/20">
              {isSpeaking ? 'Transmitting...' : 'Awaiting Input...'}
            </div>
          </div>
        )}
        
        <button
          onClick={handleLiveInteraction}
          className={`w-16 h-16 rounded-full glass border-2 transition-all duration-500 pointer-events-auto flex items-center justify-center hover:scale-110 relative group ${isListening ? 'border-cyan-500 shadow-[0_0_30px_rgba(34,211,238,0.4)] bg-cyan-500/10' : 'border-slate-800 hover:border-slate-600'}`}
          title={isListening ? "Disengage AI" : "Initiate Pigeon AI Link"}
        >
          <PigeonMascot className="w-12 h-12" isSpeaking={isSpeaking} />
          <div className="absolute inset-0 rounded-full bg-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity" />
          {isListening && (
            <div className="absolute -top-1 -right-1 bg-rose-500 text-white p-1 rounded-full border-2 border-[#020617] animate-in zoom-in">
              <MicOff size={10} />
            </div>
          )}
        </button>
      </div>

      <div className="flex gap-2 pointer-events-auto">
        <button className="p-3 rounded-full glass text-slate-500 hover:text-cyan-400 transition-all shadow-xl hover:scale-110 border-white/5">
          <Terminal size={18} />
        </button>
        <button className="p-3 rounded-full glass text-slate-500 hover:text-cyan-400 transition-all shadow-xl hover:scale-110 border-white/5">
          <MessageSquare size={18} />
        </button>
      </div>
    </div>
  );
};

export default AIAssistantOverlay;
