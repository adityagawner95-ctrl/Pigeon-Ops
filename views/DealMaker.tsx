
import React, { useState, useRef, useEffect } from 'react';
import { Send, Mic, FileText, User, Bot, Sparkles, TrendingUp, DollarSign } from 'lucide-react';
import { getGeminiChat } from '../services/geminiService';

const DealMaker: React.FC = () => {
  const [messages, setMessages] = useState<{ role: 'user' | 'model'; text: string }[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const chatRef = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatRef.current = getGeminiChat();
    // Initial welcome
    setMessages([{ 
      role: 'model', 
      text: "Hello Aditya. I'm ready to assist with your supplier negotiations. We currently have a pending offer from Global Steel Co. Should we counter-offer or seek a better deal?" 
    }]);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
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
      {/* Negotiation Analytics Side-panel */}
      <div className="w-full md:w-80 space-y-6">
        <div className="glass p-6 rounded-3xl border-emerald-500/20">
          <div className="flex items-center gap-3 mb-6 text-emerald-400">
             <TrendingUp size={20} />
             <h3 className="font-orbitron font-bold">DEAL INSIGHTS</h3>
          </div>
          <div className="space-y-4">
             <div className="p-4 glass rounded-xl">
                <p className="text-[10px] text-slate-500 uppercase mb-1">Target Savings</p>
                <p className="text-2xl font-orbitron text-white">$42,000</p>
                <div className="w-full h-1 bg-slate-800 rounded-full mt-2 overflow-hidden">
                   <div className="w-[65%] h-full bg-emerald-500" />
                </div>
             </div>
             <div className="p-4 glass rounded-xl border-emerald-500/10">
                <p className="text-[10px] text-slate-500 uppercase mb-1">Supplier Leverage</p>
                <p className="text-lg font-bold text-white">MODERATE</p>
                <p className="text-[10px] text-slate-400 mt-1">Global market supply is currently rising, giving us a 15% better position.</p>
             </div>
          </div>
        </div>

        <div className="glass p-6 rounded-3xl">
           <h4 className="text-xs font-orbitron text-slate-400 mb-4">PENDING DEALS</h4>
           <div className="space-y-3">
              {[
                { company: 'Global Steel Co', status: 'Negotiating', value: '$120k' },
                { company: 'MicroCircuit Inc', status: 'Awaiting', value: '$45k' },
                { company: 'LogiLink LTD', status: 'Completed', value: '$12k' }
              ].map(d => (
                <div key={d.company} className="p-3 bg-white/5 rounded-xl border border-white/5 flex justify-between items-center hover:bg-white/10 transition-colors cursor-pointer">
                   <div>
                      <p className="text-xs font-bold">{d.company}</p>
                      <p className="text-[10px] text-slate-500">{d.value}</p>
                   </div>
                   <div className={`px-2 py-1 rounded text-[8px] font-black uppercase ${d.status === 'Completed' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-cyan-500/20 text-cyan-400'}`}>
                      {d.status}
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="flex-1 glass rounded-3xl flex flex-col overflow-hidden relative border-cyan-500/10">
        <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-transparent pointer-events-none" />
        
        {/* Chat Header */}
        <div className="p-6 border-b border-white/5 flex justify-between items-center">
           <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-xl glass border-cyan-500/40 flex items-center justify-center">
                 <Bot className="text-cyan-400" size={24} />
              </div>
              <div>
                 <h2 className="font-orbitron text-lg leading-tight">PIGEON NEGOTIATOR</h2>
                 <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest flex items-center gap-1">
                   <div className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                   Neural Network Active
                 </p>
              </div>
           </div>
           <button className="flex items-center gap-2 px-4 py-2 glass rounded-xl text-xs font-bold hover:bg-white/10 transition-all">
              <Sparkles size={14} className="text-cyan-400" />
              Strategy Lab
           </button>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6 scroll-smooth">
          {messages.map((m, idx) => (
            <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
               <div className={`max-w-[80%] p-4 rounded-2xl flex gap-3 ${m.role === 'user' ? 'bg-cyan-500 text-slate-900 font-medium' : 'glass border-white/5'}`}>
                  {m.role === 'model' && <Bot size={18} className="mt-1 flex-shrink-0 text-cyan-400" />}
                  <p className="text-sm leading-relaxed">{m.text}</p>
                  {m.role === 'user' && <User size={18} className="mt-1 flex-shrink-0" />}
               </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
               <div className="glass p-4 rounded-2xl flex gap-2">
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce" />
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                  <div className="w-2 h-2 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.4s]" />
               </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-6 bg-slate-900/50 backdrop-blur-md">
           <div className="relative glass rounded-2xl border-white/10 flex items-center px-4 py-2 hover:border-cyan-500/30 transition-all">
              <input 
                type="text" 
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                placeholder="Suggest a negotiation strategy for MicroCircuit..."
                className="bg-transparent border-none focus:outline-none flex-1 py-3 text-sm"
              />
              <div className="flex items-center gap-2">
                 <button className="p-2 text-slate-500 hover:text-cyan-400 transition-colors">
                    <Mic size={20} />
                 </button>
                 <button onClick={handleSend} className="p-3 bg-cyan-500 text-slate-900 rounded-xl hover:bg-cyan-400 transition-all">
                    <Send size={18} />
                 </button>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default DealMaker;
