
import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, User, Bot, Sparkles, TrendingUp } from 'lucide-react';
import { getGeminiChat } from '../services/geminiService';

const DealMaker: React.FC = () => {
  const [messages, setMessages] = useState<{ role: 'user' | 'model'; text: string }[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatRef = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatRef.current = getGeminiChat();
    setMessages([{ 
      role: 'model', 
      text: "Hello Aditya. I'm ready to assist with your supplier negotiations. We currently have a pending offer from Global Steel Co. Should we counter-offer or seek a better deal?" 
    }]);
  }, []);

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || !chatRef.current) return;
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);
    try {
      const result = await chatRef.current.sendMessage({ message: userMsg });
      setMessages(prev => [...prev, { role: 'model', text: result.text || 'Error processing request.' }]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <div className="h-full flex flex-col md:flex-row gap-6 p-8">
      <div className="w-full md:w-80 space-y-6">
        <div className="glass p-6 rounded-3xl border-emerald-500/20">
          <div className="flex items-center gap-3 mb-6 text-emerald-500">
             <TrendingUp size={20} />
             <h3 className="font-orbitron font-bold">DEAL INSIGHTS</h3>
          </div>
          <div className="space-y-4">
             <div className="p-4 glass rounded-xl">
                <p className="text-[10px] text-slate-500 uppercase mb-1">Target Savings</p>
                <p className="text-2xl font-orbitron">$42,000</p>
             </div>
          </div>
        </div>
      </div>

      <div className="flex-1 glass rounded-3xl flex flex-col overflow-hidden relative border-cyan-500/10 transition-colors duration-400">
        <div className="p-6 border-b border-slate-200 dark:border-white/5 flex justify-between items-center">
           <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl glass border-cyan-500/40 flex items-center justify-center">
                 <Bot className="text-cyan-500" size={24} />
              </div>
              <div>
                 <h2 className="font-orbitron text-lg leading-tight">PIGEON NEGOTIATOR</h2>
                 <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-1">
                   <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                   Active
                 </p>
              </div>
           </div>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((m, idx) => (
            <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
               <div className={`max-w-[80%] p-4 rounded-2xl flex gap-3 ${m.role === 'user' ? 'bg-cyan-500 text-white dark:text-slate-900 font-medium' : 'glass'}`}>
                  {m.role === 'model' && <Bot size={18} className="mt-1 flex-shrink-0 text-cyan-500" />}
                  <p className="text-sm leading-relaxed">{m.text}</p>
                  {m.role === 'user' && <User size={18} className="mt-1 flex-shrink-0" />}
               </div>
            </div>
          ))}
        </div>

        <div className="p-6 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md">
           <div className="relative glass rounded-2xl border-slate-200 dark:border-white/10 flex items-center px-4 py-2 hover:border-cyan-500/30 transition-all">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Suggest a strategy..."
                className="bg-transparent border-none focus:outline-none flex-1 py-3 text-sm"
              />
              <button onClick={handleSend} className="p-3 bg-cyan-500 text-white dark:text-slate-950 rounded-xl hover:bg-cyan-400 transition-all">
                 <Send size={18} />
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};

export default DealMaker;
