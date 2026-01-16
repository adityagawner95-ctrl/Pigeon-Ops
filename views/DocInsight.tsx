
import React, { useState, useRef, useEffect } from 'react';
import { FileSearch, Upload, FileText, CheckCircle, AlertCircle, Bird, Send, Search, Loader2, Sparkles } from 'lucide-react';
import { getGeminiChat } from '../services/geminiService';

const DocInsight: React.FC = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState<{role: 'user' | 'model', text: string}[]>([]);
  const [input, setInput] = useState('');
  
  // Use a ref to maintain a single chat session throughout the component lifecycle
  const chatInstanceRef = useRef<any>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Initialize the chat session once
    chatInstanceRef.current = getGeminiChat();
    setMessages([{ 
      role: 'model', 
      text: 'Neural Document Engine active. I have indexed the Q1 Invoices and Supplier Contracts. How can I cross-reference this data for you today?' 
    }]);
  }, []);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || !chatInstanceRef.current || isTyping) return;
    
    const userMsg = input;
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    try {
      const response = await chatInstanceRef.current.sendMessage({ 
        message: `CONTEXT: Reconciling Logistics Invoices and Contracts. Current files indexed: Invoice_Q1_2024.pdf, Supplier_Contract.docx. USER QUERY: ${userMsg}` 
      });
      
      setMessages(prev => [...prev, { role: 'model', text: response.text || 'Analysis anomaly detected.' }]);
    } catch (err) {
      console.error("Doc Insight Error:", err);
      setMessages(prev => [...prev, { role: 'model', text: 'Critical Error: Retrieval link failed. Please try again.' }]);
    } finally {
      setIsTyping(false);
    }
  };

  const files = [
    { name: 'Invoice_Q1_2024.pdf', type: 'Invoice', status: 'Processed', date: '2024-03-12' },
    { name: 'Supplier_Contract.docx', type: 'Contract', status: 'Analyzed', date: '2023-11-05' },
    { name: 'Expense_Log_May.xlsx', type: 'Spreadsheet', status: 'Processed', date: '2024-05-30' }
  ];

  const simulateAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
      setMessages(prev => [...prev, { role: 'model', text: 'New document successfully vectorized and added to the RAG pipeline.' }]);
    }, 2500);
  };

  return (
    <div className="p-8 h-full flex flex-col gap-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-4xl font-orbitron font-black tracking-tighter text-white">DOC <span className="text-cyan-400">INSIGHT</span></h1>
          <p className="text-slate-500 text-[10px] uppercase tracking-[0.4em] font-bold mt-1 flex items-center gap-2">
            <Sparkles size={12} className="text-cyan-500" />
            Advanced RAG Pipeline • Multi-format Vectorization
          </p>
        </div>
        <div className="flex gap-4">
          <div className="glass px-6 py-2 rounded-2xl text-[10px] font-black text-emerald-400 border-emerald-500/20 bg-emerald-500/5 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            3 SOURCES ACTIVE
          </div>
          <button className="px-6 py-2 glass rounded-2xl text-[10px] font-black uppercase tracking-widest text-cyan-400 border-cyan-500/20 hover:bg-cyan-500/10 transition-all">Reset Index</button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1 min-h-0">
        {/* File Browser */}
        <div className="glass rounded-[2.5rem] p-8 flex flex-col border-white/5 bg-slate-950/20 shadow-2xl">
          <div className="flex items-center justify-between mb-8">
             <h3 className="font-orbitron text-[11px] font-bold text-slate-400 tracking-widest">SECURE VAULT</h3>
             <label className="cursor-pointer group">
                <input type="file" className="hidden" onChange={simulateAnalysis} />
                <div className="p-3 glass rounded-xl group-hover:bg-cyan-500/20 transition-all border-cyan-500/20"><Upload size={18} className="text-cyan-400" /></div>
             </label>
          </div>
          <div className="space-y-4 flex-1 overflow-y-auto pr-2 scrollbar-hide">
             {files.map((file, idx) => (
               <div key={idx} className="p-5 glass rounded-[1.5rem] border-white/5 hover:border-cyan-500/30 transition-all cursor-pointer group bg-slate-900/40 hover:bg-slate-900/60">
                  <div className="flex items-center gap-4">
                     <div className="w-10 h-10 rounded-xl bg-slate-800 flex items-center justify-center text-slate-500 group-hover:text-cyan-400 group-hover:bg-cyan-500/10 transition-all">
                        <FileText size={20} />
                     </div>
                     <div className="flex-1 min-w-0">
                        <p className="text-xs font-black truncate text-slate-200 uppercase tracking-tight">{file.name}</p>
                        <p className="text-[9px] text-slate-600 font-bold uppercase">{file.type} • {file.date}</p>
                     </div>
                     <CheckCircle size={14} className="text-emerald-500 flex-shrink-0" />
                  </div>
               </div>
             ))}
             {isAnalyzing && (
               <div className="p-6 glass rounded-[1.5rem] border-cyan-500/30 bg-cyan-500/5 flex flex-col items-center gap-3 animate-pulse">
                  <Loader2 className="animate-spin text-cyan-500" size={24} />
                  <p className="text-[10px] font-black text-cyan-400 uppercase tracking-widest">Generating Embeddings...</p>
               </div>
             )}
          </div>
        </div>

        {/* Neural Chat Engine */}
        <div className="lg:col-span-2 glass rounded-[3rem] flex flex-col min-h-0 bg-slate-950/40 border-white/5 relative shadow-2xl">
          <div className="p-6 border-b border-white/5 flex items-center justify-between backdrop-blur-xl">
             <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 border border-cyan-500/20">
                   <Bird size={20} />
                </div>
                <div>
                   <h3 className="font-orbitron font-bold text-sm tracking-widest text-white uppercase">Neural Insight Engine</h3>
                   <div className="flex items-center gap-2 mt-0.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <p className="text-[9px] text-slate-500 font-bold uppercase tracking-tighter">Latency: 12ms • Context: Active</p>
                   </div>
                </div>
             </div>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto p-10 space-y-8 scroll-smooth">
             {messages.map((m, idx) => (
               <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2 duration-300`}>
                  <div className={`max-w-[85%] p-6 rounded-[1.5rem] text-xs leading-relaxed transition-all ${m.role === 'user' ? 'bg-cyan-500 text-slate-950 font-black shadow-lg shadow-cyan-500/20' : 'glass border-white/10 text-slate-200'}`}>
                    {m.text}
                  </div>
               </div>
             ))}
             {isTyping && (
               <div className="flex justify-start">
                  <div className="glass p-5 rounded-[1.5rem] flex gap-2">
                     <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce" />
                     <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.2s]" />
                     <div className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-bounce [animation-delay:0.4s]" />
                  </div>
               </div>
             )}
          </div>

          <div className="p-8 bg-slate-950/40 backdrop-blur-3xl border-t border-white/5">
             <div className="relative glass rounded-2xl border-white/10 flex items-center px-6 py-2 bg-slate-900/40 hover:border-cyan-500/30 transition-all">
                <Search className="text-slate-600 mr-4" size={20} />
                <input 
                  type="text" 
                  value={input}
                  disabled={isTyping}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Ask about discrepancies, terms, or historical logs..." 
                  className="bg-transparent border-none focus:outline-none flex-1 py-4 text-sm font-medium placeholder:text-slate-700 disabled:opacity-50" 
                />
                <button 
                  onClick={handleSend}
                  disabled={isTyping || !input.trim()}
                  className="p-3 bg-cyan-500 text-slate-950 rounded-xl ml-4 hover:bg-cyan-400 transition-all shadow-lg hover:shadow-cyan-500/30 disabled:opacity-50"
                >
                  <Send size={18} />
                </button>
             </div>
          </div>
        </div>

        {/* Audit Log */}
        <div className="glass rounded-[2.5rem] p-8 flex flex-col border-white/5 bg-slate-950/20 shadow-2xl">
           <div className="flex items-center gap-3 mb-8">
              <AlertCircle size={20} className="text-amber-500 animate-pulse" />
              <h3 className="font-orbitron text-[11px] font-bold text-slate-400 tracking-widest uppercase">Audit Anomalies</h3>
           </div>
           <div className="space-y-6">
              <div className="p-6 glass rounded-[1.5rem] border-amber-500/20 bg-amber-500/5 hover:bg-amber-500/10 transition-colors cursor-help">
                 <p className="text-[10px] font-black text-amber-500 uppercase mb-2">Cost Variance: #SUP-402</p>
                 <p className="text-xs text-slate-400 leading-relaxed">Contract specifies <span className="text-white font-bold">$12k base</span>, but invoice claims <span className="text-white font-bold">$12.4k</span>. Difference detected in "Emergency Logistic Loading".</p>
              </div>
              <div className="p-6 glass rounded-[1.5rem] border-emerald-500/10 bg-emerald-500/5">
                 <p className="text-[10px] font-black text-emerald-500 uppercase mb-2">Compliance: PASSED</p>
                 <p className="text-xs text-slate-400 leading-relaxed">GDPR and Logistics Integrity check completed for Q1 Data Stream.</p>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default DocInsight;
