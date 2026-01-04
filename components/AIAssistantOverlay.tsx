
import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI, Modality, LiveServerMessage, Blob } from '@google/genai';
import PigeonMascot from './PigeonMascot';
import { MessageSquare, Terminal, AlertCircle } from 'lucide-react';

// Encoding and decoding helpers as per guidelines
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
    int16[i] = data[i] * 32768;
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

  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const nextStartTimeRef = useRef(0);
  const sourcesRef = useRef(new Set<AudioBufferSourceNode>());
  const sessionRef = useRef<any>(null);

  const handleLiveInteraction = async () => {
    if (isListening) {
      setIsListening(false);
      if (sessionRef.current) {
        // Cleaning up
        streamRef.current?.getTracks().forEach(track => track.stop());
      }
      return;
    }

    setError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error("Microphone access is not supported by this browser.");
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;

      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
      setIsListening(true);

      const inCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 16000 });
      const outCtx = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
      audioContextRef.current = outCtx;

      const sessionPromise = ai.live.connect({
        model: 'gemini-2.5-flash-native-audio-preview-09-2025',
        callbacks: {
          onopen: () => {
            const source = inCtx.createMediaStreamSource(stream);
            const scriptProcessor = inCtx.createScriptProcessor(4096, 1, 1);
            scriptProcessor.onaudioprocess = (e) => {
              const inputData = e.inputBuffer.getChannelData(0);
              const pcmBlob = createBlob(inputData);
              sessionPromise.then((session) => {
                session.sendRealtimeInput({ media: pcmBlob });
              });
            };
            source.connect(scriptProcessor);
            scriptProcessor.connect(inCtx.destination);
          },
          onmessage: async (message: LiveServerMessage) => {
            const base64EncodedAudioString = message.serverContent?.modelTurn?.parts[0]?.inlineData?.data;
            if (base64EncodedAudioString) {
              setIsSpeaking(true);
              nextStartTimeRef.current = Math.max(nextStartTimeRef.current, outCtx.currentTime);
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
            }

            const interrupted = message.serverContent?.interrupted;
            if (interrupted) {
              for (const source of sourcesRef.current.values()) {
                source.stop();
              }
              sourcesRef.current.clear();
              nextStartTimeRef.current = 0;
              setIsSpeaking(false);
            }
          },
          onerror: (e) => {
            console.error("Live API Error:", e);
            setError("AI Connection Error");
            setIsListening(false);
          },
          onclose: () => {
            setIsListening(false);
          },
        },
        config: {
          responseModalities: [Modality.AUDIO],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
          },
          systemInstruction: `You are Pigeon AI, the world's most advanced SCM assistant, built for Aditya Gawner. 
          Your tone is similar to Jarvis from Iron Man: sophisticated, efficient, and proactive.
          
          CURRENT CONTEXT:
          - User: Aditya Gawner
          - System: Pigeon Ops Online
          - Recent Notifications:
            1. Critical stock alert for Wiring (below 15%).
            2. Upcoming shipment Batch 44A from Singapore in 2 days.
            3. Weather alert: Storm detected on North Atlantic route.
          
          TASK:
          When Aditya talks to you, greet him warmly (e.g., "Welcome to Pigeon AI, Aditya Gawner"). 
          Be ready to summarize these notifications and assist with logistics, negotiations, or data analysis. 
          Keep responses concise as they are delivered via voice.`,
        },
      });
      
      sessionRef.current = sessionPromise;

    } catch (err: any) {
      console.error("Failed to start voice:", err);
      let errorMsg = "Microphone unavailable";
      if (err.name === 'NotFoundError' || err.message?.includes('found')) {
        errorMsg = "No microphone found. Please check your hardware.";
      } else if (err.name === 'NotAllowedError') {
        errorMsg = "Microphone access denied.";
      }
      setError(errorMsg);
      setIsListening(false);
    }
  };

  // Initial welcome notification
  useEffect(() => {
    const welcome = "Welcome to Pigeon AI, Aditya Gawner. System online. I've detected 2 upcoming shipments and 1 weather alert.";
    setNotification(welcome);
    const timer = setTimeout(() => setNotification(null), 8000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-4 pointer-events-none">
      {error && (
        <div className="glass border-rose-500/50 px-4 py-2 rounded-lg text-rose-400 text-xs font-bold flex items-center gap-2 pointer-events-auto animate-in fade-in slide-in-from-right">
          <AlertCircle size={14} />
          {error}
        </div>
      )}
      
      {notification && (
        <div className="glass neon-border px-4 py-2 rounded-lg text-cyan-400 text-sm font-orbitron max-w-xs animate-bounce pointer-events-auto">
          {notification}
        </div>
      )}
      
      <div className="flex items-center gap-4">
        {isListening && (
          <div className="glass px-3 py-1 rounded-full text-[10px] text-cyan-500 font-bold uppercase tracking-widest animate-pulse pointer-events-auto">
            {isSpeaking ? 'Pigeon Speaking...' : 'Listening...'}
          </div>
        )}
        
        <button
          onClick={handleLiveInteraction}
          className={`w-16 h-16 rounded-full glass border-2 transition-all duration-300 pointer-events-auto flex items-center justify-center hover:scale-110 ${isListening ? 'border-cyan-500 shadow-[0_0_20px_rgba(34,211,238,0.6)]' : 'border-slate-700'}`}
          title={isListening ? "Stop AI Assistant" : "Talk to Pigeon AI"}
        >
          <PigeonMascot className="w-12 h-12" isSpeaking={isSpeaking} />
        </button>
      </div>

      <div className="flex gap-2 pointer-events-auto">
        <button className="p-3 rounded-full glass text-slate-400 hover:text-cyan-400 transition-colors">
          <Terminal size={18} />
        </button>
        <button className="p-3 rounded-full glass text-slate-400 hover:text-cyan-400 transition-colors">
          <MessageSquare size={18} />
        </button>
      </div>
    </div>
  );
};

export default AIAssistantOverlay;