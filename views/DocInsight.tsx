
import React, { useState } from 'react';
/* Added Bot to the imports from lucide-react */
import { FileSearch, Upload, FileText, PieChart as PieIcon, CheckCircle, Mail, MessageCircle, AlertCircle, Bot } from 'lucide-react';

const DocInsight: React.FC = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [files, setFiles] = useState<{ name: string; type: string; status: string }[]>([
    { name: 'Invoice_Q1_2024.pdf', type: 'Invoice', status: 'Processed' },
    { name: 'Supplier_Contract.docx', type: 'Contract', status: 'Analyzed' },
    { name: 'Expense_Log_May.xlsx', type: 'Spreadsheet', status: 'Processed' }
  ]);

  const simulateAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => setIsAnalyzing(false), 3000);
  };

  return (
    <div className="p-8 h-full flex flex-col gap-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-orbitron font-bold text-white tracking-tight">RAG SYSTEM & DOC INSIGHT</h1>
          <p className="text-slate-500 text-sm uppercase tracking-widest font-bold">Document Brain • Expense Control</p>
        </div>
        <div className="flex gap-4">
           <div className="glass p-1 rounded-xl flex">
              <button className="px-4 py-2 bg-cyan-500 text-slate-900 rounded-lg text-xs font-bold uppercase tracking-wider">Analysis Mode</button>
              <button className="px-4 py-2 text-slate-500 text-xs font-bold uppercase tracking-wider">Automation</button>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1">
        {/* File Queue */}
        <div className="glass rounded-3xl p-6 flex flex-col">
          <div className="flex items-center justify-between mb-6">
             <h3 className="font-orbitron text-sm">SECURE ARCHIVE</h3>
             <label className="cursor-pointer group">
                <input type="file" className="hidden" onChange={simulateAnalysis} />
                <div className="p-2 glass rounded-lg group-hover:bg-cyan-500/20 transition-all">
                  <Upload size={18} className="text-cyan-400" />
                </div>
             </label>
          </div>
          
          <div className="space-y-4 flex-1 overflow-y-auto pr-2">
             {files.map((file, idx) => (
               <div key={idx} className="p-4 glass rounded-2xl border-white/5 hover:border-cyan-500/20 transition-all cursor-pointer">
                  <div className="flex items-center gap-3">
                     <div className="p-2 bg-slate-800 rounded-lg">
                        <FileText size={20} className="text-slate-400" />
                     </div>
                     <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold truncate">{file.name}</p>
                        <p className="text-[10px] text-slate-500">{file.type}</p>
                     </div>
                     <CheckCircle size={14} className="text-emerald-500" />
                  </div>
               </div>
             ))}
             {isAnalyzing && (
               <div className="p-4 glass rounded-2xl border-cyan-500/30 animate-pulse bg-cyan-500/5">
                  <p className="text-xs font-bold text-cyan-400 text-center uppercase tracking-widest">Pigeon AI Analyzing...</p>
                  <div className="w-full h-1 bg-slate-800 rounded-full mt-2 overflow-hidden">
                     <div className="h-full bg-cyan-500 animate-[loading_2s_infinite]" />
                  </div>
               </div>
             )}
          </div>
        </div>

        {/* Intelligence Board */}
        <div className="lg:col-span-2 glass rounded-3xl p-8 space-y-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-5">
            <FileSearch size={150} />
          </div>
          
          <div>
            <h3 className="text-xl font-orbitron mb-4 flex items-center gap-3">
               <PieIcon size={24} className="text-purple-400" />
               EXPENSE CLASSIFICATION
            </h3>
            <div className="grid grid-cols-3 gap-4">
               {[
                 { label: 'Logistics', val: '$18,400', color: 'bg-cyan-500' },
                 { label: 'Materials', val: '$42,900', color: 'bg-purple-500' },
                 { label: 'Personnel', val: '$12,200', color: 'bg-emerald-500' }
               ].map(i => (
                 <div key={i.label} className="p-4 glass rounded-2xl text-center border-white/5">
                    <p className="text-[10px] text-slate-500 uppercase font-black mb-1">{i.label}</p>
                    <p className="text-xl font-bold font-orbitron">{i.val}</p>
                    <div className={`w-12 h-1 ${i.color} rounded-full mx-auto mt-2`} />
                 </div>
               ))}
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
             <div className="flex items-center gap-2 mb-4">
                <AlertCircle size={18} className="text-yellow-400" />
                <h4 className="text-sm font-bold uppercase tracking-wider">AI Reconciliation Alerts</h4>
             </div>
             <div className="space-y-3">
                <div className="flex gap-4 items-start text-xs p-3 glass rounded-xl border-yellow-500/20">
                   <div className="p-1 bg-yellow-500/10 rounded">⚠️</div>
                   <p className="text-slate-300">Invoice <span className="text-white font-bold">#SUP-402</span> mismatch detected. Amount listed is 2.5% higher than quoted contract rate. Recorrection initiated.</p>
                </div>
                <div className="flex gap-4 items-start text-xs p-3 glass rounded-xl border-emerald-500/20">
                   <div className="p-1 bg-emerald-500/10 rounded">✨</div>
                   <p className="text-slate-300">Direct integration complete: <span className="text-white font-bold">WhatsApp notification</span> sent to Procurement Manager regarding expense approval.</p>
                </div>
             </div>
          </div>

          <div className="pt-4">
            <h3 className="text-sm font-orbitron text-slate-400 mb-4 uppercase">Direct Actions</h3>
            <div className="flex gap-4">
               <button className="flex-1 py-4 glass rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-cyan-500/10 border-white/5 transition-all">
                  <Mail size={24} className="text-cyan-400" />
                  <span className="text-[10px] font-bold uppercase">Blast Email Reports</span>
               </button>
               <button className="flex-1 py-4 glass rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-emerald-500/10 border-white/5 transition-all">
                  <MessageCircle size={24} className="text-emerald-400" />
                  <span className="text-[10px] font-bold uppercase">Notify WhatsApp</span>
               </button>
            </div>
          </div>
        </div>

        {/* AI Chat Layer */}
        <div className="glass rounded-3xl p-6 flex flex-col overflow-hidden relative border-purple-500/10">
           <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-purple-500/20 flex items-center justify-center">
                 <Bot size={18} className="text-purple-400" />
              </div>
              <h3 className="font-orbitron text-sm">DOC CHAT</h3>
           </div>
           
           <div className="flex-1 overflow-y-auto space-y-4 mb-4 text-xs">
              <div className="p-3 bg-white/5 rounded-xl border border-white/10 text-slate-400">
                "Ask me anything about your document archives or expense history."
              </div>
              <div className="p-3 bg-purple-500 text-slate-900 rounded-xl ml-4 font-medium">
                "What was the total steel spend last quarter?"
              </div>
              <div className="p-3 glass rounded-xl mr-4 border-white/5 text-slate-300">
                "Last quarter, total steel expenditure was $142,500 across 4 major shipments. This is 8% lower than the previous quarter due to bulk negotiation."
              </div>
           </div>

           <div className="relative mt-auto">
              <input 
                type="text" 
                placeholder="Query company data..."
                className="w-full bg-slate-900/80 border border-white/10 rounded-xl py-3 px-4 text-xs focus:outline-none focus:border-purple-500/50"
              />
           </div>
        </div>
      </div>
    </div>
  );
};

export default DocInsight;
