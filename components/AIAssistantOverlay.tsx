
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Modality, LiveServerMessage, Blob } from '@google/genai';
import PigeonMascot from './PigeonMascot';
import { MessageSquare, Terminal, AlertCircle, MicOff, Wifi, RefreshCw, Key } from 'lucide-react';

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

// Decode raw PCM audio data from the model as per guidelines
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

// Create an audio PCM blob for the Gemini Live API
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
  const [error, setError] = useState<string | null>(null);
  const [transcription, setTranscription] = useState<{user: string, ai: string}>({user: '', ai: ''});

  const inCtxRef = useRef<AudioContext | null>(null);
  const outCtxRef = useRef<AudioContext | null>(null);
  const scriptProcessorRef = useRef<ScriptProcessorNode | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef(new Set<AudioBufferSourceNode>());
  const sessionRef = useRef<any>(null);

  // Release resources and stop audio processing
  const cleanup = async () => {
    setIsListening(false);
    setIsSpeaking(false);
    
    // Clear any playing audio sources
    sourcesRef.current.forEach(source => { try { source.stop(); } catch (e) {} });
    sourcesRef.current.clear();

    if (sessionRef.current) {
      try {
        const session = await sessionRef.current;
        if (session && typeof session.close === 'function') {
          session.close();
        }
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
      const hasKey = await (window as any).aistudio.hasSelectedApiKey();
      if (!hasKey) {
         await (window as any).aistudio.openSelectKey();
         // Guideline: Assume success after triggering picker and proceed
      }

      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Neural link requires audio interface.");
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const inCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      
      await inCtx.resume();
      await outCtx.resume();
      
      inCtxRef.current = inCtx;
      outCtxRef.current = outCtx;

      // Always create a new GoogleGenAI instance right before the call to ensure fresh API key
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
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmBlob = createBlob(inputData);
              // CRITICAL: Solely rely on sessionPromise and avoid extra condition checks in onaudioprocess
              sessionPromise.then((session) => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };

            source.connect(scriptProcessor);
            scriptProcessor.connect(inCtx.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            if (message.serverContent?.inputTranscription) {
              setTranscription(prev => ({ ...prev, user: message.serverContent?.inputTranscription?.text || prev.user }));
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
                  if (sourcesRef.current.size === 0) setIsSpeaking(false);
                });

                source.start(nextStartTimeRef.current);
                nextStartTimeRef.current = nextStartTimeRef.current + audioBuffer.duration;
                sourcesRef.current.add(source);
              } catch (decodeErr) {
                console.error("Audio Decoding Failed", decodeErr);
              }
            }

            if (message.serverContent?.interrupted) {
              sourcesRef.current.forEach(source => { try { source.stop(); } catch (e) {} });
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
              setIsSpeaking(false);
            }
          },
          onerror: (e: any) => {
            console.error("Live API Error:", e);
            // "Network error" is common when WebSockets are blocked or API key is restricted.
            setError("Link Interrupted. Verify API Key / Project Billing.");
            cleanup();
          },
          onclose: (e) => {
            console.debug("Link closed", e);
            cleanup();
          },
        },
        config: {
          responseModalities: [Modality.AUDIO],
          inputAudioTranscription: {},
          outputAudioTranscription: {},
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
          },
          systemInstruction: `Identity: Pigeon AI. 
Commander: Aditya Gawner. 
SCM Protocol: Active. 
Goal: High-speed supply chain insights. Be concise, futuristic, and helpful.`,
        },
      });
      
      sessionRef.current = sessionPromise;

    } catch (err: any) {
      console.error("Initiation Error:", err);
      // If error suggests entity not found (usually API Key issue), reset picker
      if (err.message?.includes('entity was not found')) {
        setError("Model Access Restricted. Try re-selecting your paid API Key.");
        await (window as any).aistudio.openSelectKey();
      } else {
        setError("Network Anomaly. Please verify link stability.");
      }
      cleanup();
    }
  };

  const handleResetKey = async () => {
    await (window as any).aistudio.openSelectKey();
    setError(null);
  };

  useEffect(() => {
    return () => {
      cleanup();
    };
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4 pointer-events-none">
      {(isListening || transcription.ai || transcription.user) && !error && (
        <div className="flex flex-col gap-2 max-w-sm pointer-events-auto animate-in fade-in slide-in-from-bottom-4">
          {transcription.user && (
            <div className="glass p-4 rounded-2xl border-white/10 bg-slate-900/80 backdrop-blur-xl text-xs text-slate-300">
              <p className="font-bold text-cyan-400 mb-1 flex items-center gap-2">
                <MessageSquare size={12} /> COMMANDER
              </p>
              {transcription.user}
            </div>
          )}
          {transcription.ai && (
            <div className="glass p-4 rounded-2xl border-cyan-500/20 bg-cyan-500/5 backdrop-blur-xl text-xs text-slate-100">
              <p className="font-bold text-cyan-400 mb-1 flex items-center gap-2">
                <Terminal size={12} /> PIGEON AI
              </p>
              {transcription.ai}
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="glass p-5 rounded-2xl border-rose-500/30 bg-rose-500/10 backdrop-blur-xl text-xs text-rose-400 pointer-events-auto flex flex-col gap-3 animate-in fade-in slide-in-from-bottom-2 shadow-xl">
          <div className="flex items-center gap-3">
             <AlertCircle size={18} />
             <p className="font-bold">{error}</p>
          </div>
          <div className="flex gap-2">
             <button onClick={handleResetKey} className="flex-1 py-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 rounded-lg font-bold flex items-center justify-center gap-2 transition-all">
                <Key size={14} /> RE-SELECT KEY
             </button>
             <button onClick={() => setError(null)} className="p-2 hover:bg-white/10 rounded-lg">
                <RefreshCw size={14} />
             </button>
          </div>
        </div>
      )}

      <div className="flex items-center gap-4 pointer-events-auto">
        {isListening && (
          <div className="glass px-4 py-2 rounded-full border-cyan-500/30 bg-cyan-500/10 backdrop-blur-xl flex items-center gap-3">
             <div className="flex gap-1">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className={`w-1 h-3 bg-cyan-500 rounded-full animate-pulse`} style={{ animationDelay: `${i * 0.15}s` }} />
                ))}
             </div>
             <span className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">Link Active</span>
          </div>
        )}
        
        <button
          onClick={handleLiveInteraction}
          className={`w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500 border group ${isListening ? 'bg-rose-500 border-rose-400 shadow-[0_0_30px_rgba(244,63,94,0.4)]' : 'glass border-cyan-500/30 bg-slate-950/80 hover:bg-cyan-500 hover:border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.2)]'}`}
        >
          {isListening ? (
            <MicOff className="text-white" size={24} />
          ) : (
            <div className="relative">
              <PigeonMascot className="w-12 h-12" isSpeaking={isSpeaking} />
              <div className="absolute -top-1 -right-1">
                 <Wifi size={12} className="text-cyan-400 animate-pulse" />
              </div>
            </div>
          )}
        </button>
      </div>
    </div>
  );
};

export default AIAssistantOverlay;
