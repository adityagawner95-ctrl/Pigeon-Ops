
import React, { useState } from 'react';
import { FileSearch, Upload, FileText, PieChart as PieIcon, CheckCircle, Mail, MessageCircle, AlertCircle, Bot } from 'lucide-react';

const DocInsight: React.FC = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const files = [
    { name: 'Invoice_Q1_2024.pdf', type: 'Invoice', status: 'Processed' },
    { name: 'Supplier_Contract.docx', type: 'Contract', status: 'Analyzed' },
    { name: 'Expense_Log_May.xlsx', type: 'Spreadsheet', status: 'Processed' }
  ];

  const simulateAnalysis = () => {
    setIsAnalyzing(true);
    setTimeout(() => setIsAnalyzing(false), 3000);
  };

  return (
    <div className="p-8 h-full flex flex-col gap-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-orbitron font-bold tracking-tight transition-colors">RAG SYSTEM & DOC INSIGHT</h1>
          <p className="text-slate-500 text-sm uppercase tracking-widest font-bold">Document Brain • Expense Control</p>
        </div>
        <button className="px-6 py-2 glass rounded-xl text-xs font-bold uppercase tracking-wider text-cyan-600 dark:text-cyan-400">Analysis Mode</button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 flex-1">
        <div className="glass rounded-3xl p-6 flex flex-col border-slate-200 dark:border-white/5">
          <div className="flex items-center justify-between mb-6">
             <h3 className="font-orbitron text-sm">ARCHIVE</h3>
             <label className="cursor-pointer group">
                <input type="file" className="hidden" onChange={simulateAnalysis} />
                <div className="p-2 glass rounded-lg group-hover:bg-cyan-500/20 transition-all"><Upload size={18} className="text-cyan-500" /></div>
             </label>
          </div>
          <div className="space-y-4 flex-1 overflow-y-auto">
             {files.map((file, idx) => (
               <div key={idx} className="p-4 glass rounded-2xl border-slate-200 dark:border-white/5 hover:border-cyan-500/20 transition-all cursor-pointer">
                  <div className="flex items-center gap-3">
                     <FileText size={20} className="text-slate-400" />
                     <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold truncate">{file.name}</p>
                        <p className="text-[10px] text-slate-500">{file.type}</p>
                     </div>
                     <CheckCircle size={14} className="text-emerald-500" />
                  </div>
               </div>
             ))}
          </div>
        </div>

        <div className="lg:col-span-2 glass rounded-3xl p-8 space-y-8 relative overflow-hidden transition-colors duration-400 border-slate-200 dark:border-white/5">
          <div className="grid grid-cols-3 gap-4">
             {[
               { label: 'Logistics', val: '$18,400', color: 'bg-cyan-500' },
               { label: 'Materials', val: '$42,900', color: 'bg-purple-500' },
               { label: 'Personnel', val: '$12,200', color: 'bg-emerald-500' }
             ].map(i => (
               <div key={i.label} className="p-4 glass rounded-2xl text-center border-slate-200 dark:border-white/5">
                  <p className="text-[10px] text-slate-500 uppercase font-black mb-1">{i.label}</p>
                  <p className="text-xl font-bold font-orbitron">{i.val}</p>
                  <div className={`w-12 h-1 ${i.color} rounded-full mx-auto mt-2`} />
               </div>
             ))}
          </div>
          <div className="p-6 rounded-2xl bg-white/5 dark:bg-white/5 border border-slate-200 dark:border-white/10">
             <div className="flex items-center gap-2 mb-4 text-yellow-600 dark:text-yellow-400">
                <AlertCircle size={18} />
                <h4 className="text-sm font-bold uppercase tracking-wider">AI Reconciliation Alerts</h4>
             </div>
             <p className="text-xs text-slate-600 dark:text-slate-400">Invoice <span className="font-bold">#SUP-402</span> mismatch detected.</p>
          </div>
        </div>

        <div className="glass rounded-3xl p-6 flex flex-col relative border-purple-500/10">
           <div className="flex items-center gap-2 mb-6">
              <Bot size={18} className="text-purple-500" />
              <h3 className="font-orbitron text-sm">DOC CHAT</h3>
           </div>
           <div className="relative mt-auto">
              <input type="text" placeholder="Query data..." className="w-full glass bg-white/50 dark:bg-slate-900/80 border border-slate-200 dark:border-white/10 rounded-xl py-3 px-4 text-xs focus:outline-none" />
           </div>
        </div>
      </div>
    </div>
  );
};

export default DocInsight;
