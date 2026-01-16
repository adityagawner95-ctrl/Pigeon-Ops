
import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bird, Sparkles, TrendingUp, Handshake, Target, ShieldCheck } from 'lucide-react';
import { getGeminiChat } from '../services/geminiService';

const DealMaker: React.FC = () => {
  const [messages, setMessages] = useState<{ role: 'user' | 'model'; text: string }[]>([]);
  const [negMessages, setNegMessages] = useState<{ role: 'user' | 'model'; text: string }[]>([]);
  const [input, setInput] = useState('');
  const [negInput, setNegInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  
  const chatRef = useRef<any>(null);
  const negRef = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const negScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatRef.current = getGeminiChat();
    negRef.current = getGeminiChat(); // Reusing the same service for now
    
    setMessages([{ 
      role: 'model', 
      text: "Commander Aditya, Pigeon Assistant standing by. I have analyzed current market volatility. How can I assist with your supply operations today?" 
    }]);

    setNegMessages([{
      role: 'model',
      text: "Pigeon Negotiator linked. I'm currently running game theory simulations on the Global Steel contract. Provide your target price range."
    }]);
  }, []);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    if (negScrollRef.current) negScrollRef.current.scrollTop = negScrollRef.current.scrollHeight;
  }, [messages, negMessages]);

  const handleSend = async () => {
    if (!input.trim() || !chatRef.current) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);
    try {
      const result = await chatRef.current.sendMessage({ message: userMsg });
      setMessages(prev => [...prev, { role: 'model', text: result.text || 'Protocol error.' }]);
    } catch (err) { console.error(err); } finally { setIsTyping(false); }
  };

  const handleNegSend = async () => {
    if (!negInput.trim() || !negRef.current) return;
    const userMsg = negInput;
    setNegInput('');
    setNegMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    try {
      const result = await negRef.current.sendMessage({ message: `NEGOTIATION CONTEXT: Vendor price is $500/unit. User says: ${userMsg}` });
      setNegMessages(prev => [...prev, { role: 'model', text: result.text || 'Comm link failed.' }]);
    } catch (err) { console.error(err); }
  };

  return (
    <div className="h-full flex flex-col md:flex-row gap-6 p-8">
      {/* Left Column: Negotiation Side Window */}
      <div className="w-full md:w-96 flex flex-col gap-6">
        <div className="glass p-6 rounded-3xl border-rose-500/20 flex-1 flex flex-col relative overflow-hidden">
          <div className="flex items-center gap-3 mb-6 text-rose-500">
             <Handshake size={20} className="animate-pulse" />
             <h3 className="font-orbitron font-bold text-sm tracking-widest">PIGEON NEGOTIATOR</h3>
          </div>
          
          <div ref={negScrollRef} className="flex-1 overflow-y-auto space-y-4 mb-4 scrollbar-hide">
            {negMessages.map((m, idx) => (
              <div key={idx} className={`p-3 rounded-xl text-[11px] ${m.role === 'user' ? 'bg-slate-800 text-slate-300 ml-4' : 'bg-rose-500/10 text-rose-300 mr-4 border border-rose-500/10'}`}>
                {m.text}
              </div>
            ))}
          </div>

          <div className="relative">
            <input 
              type="text" 
              value={negInput}
              onChange={(e) => setNegInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleNegSend()}
              placeholder="Target price..."
              className="w-full bg-slate-900 border border-white/5 rounded-xl py-2 px-3 text-[11px] font-orbitron focus:border-rose-500/50 outline-none"
            />
          </div>

          <div className="mt-6 space-y-4">
             <div className="p-4 glass rounded-xl bg-slate-900/50">
                <p className="text-[10px] text-slate-500 uppercase font-black mb-1">Leverage Score</p>
                <div className="w-full h-1 bg-slate-800 rounded-full overflow-hidden">
                   <div className="w-[72%] h-full bg-rose-500 shadow-[0_0_10px_rgba(244,63,94,0.5)]" />
                </div>
                <p className="text-[9px] text-rose-500 mt-1 font-bold">72% DOMINANCE</p>
             </div>
          </div>
        </div>
      </div>

      {/* Main Column: Pigeon Assistant */}
      <div className="flex-1 glass rounded-3xl flex flex-col overflow-hidden relative border-cyan-500/10 bg-slate-950/20">
        <div className="p-6 border-b border-white/5 flex justify-between items-center backdrop-blur-md">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl glass border-cyan-500/30 flex items-center justify-center bg-cyan-500/10">
                 <Bird className="text-cyan-500" size={28} />
              </div>
              <div>
                 <h2 className="font-orbitron text-xl font-black tracking-tight text-cyan-400">PIGEON ASSISTANT</h2>
                 <p className="text-[10px] text-emerald-500 font-bold uppercase tracking-widest flex items-center gap-2">
                   <ShieldCheck size={12} />
                   System Priority: High
                 </p>
              </div>
           </div>
           <div className="flex gap-2">
              <div className="glass px-3 py-1 rounded-full text-[10px] text-cyan-500 font-bold border-cyan-500/20">v3.4.12</div>
           </div>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-8">
          {messages.map((m, idx) => (
            <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
               <div className={`max-w-[75%] p-5 rounded-3xl flex gap-4 ${m.role === 'user' ? 'bg-cyan-500 text-slate-950 font-bold shadow-lg shadow-cyan-500/10' : 'glass border-white/5'}`}>
                  {m.role === 'model' && <Bird size={20} className="mt-1 flex-shrink-0 text-cyan-500" />}
                  <p className="text-sm leading-relaxed">{m.text}</p>
                  {m.role === 'user' && <User size={20} className="mt-1 flex-shrink-0" />}
               </div>
            </div>
          ))}
          {isTyping && (
             <div className="flex justify-start">
                <div className="glass p-4 rounded-3xl flex gap-2">
                   <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" />
                   <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce [animation-delay:0.2s]" />
                   <div className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce [animation-delay:0.4s]" />
                </div>
             </div>
          )}
        </div>

        <div className="p-8 bg-slate-950/40 backdrop-blur-xl border-t border-white/5">
           <div className="relative glass rounded-2xl border-white/10 flex items-center px-4 py-2 hover:border-cyan-500/30 transition-all group">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Ask Pigeon Assistant..."
                className="bg-transparent border-none focus:outline-none flex-1 py-4 text-sm font-medium placeholder:text-slate-700"
              />
              <button onClick={handleSend} className="p-4 bg-cyan-500 text-slate-950 rounded-xl hover:bg-cyan-400 transition-all shadow-lg hover:shadow-cyan-500/20">
                 <Send size={20} />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default DealMaker;
