
import React, { useState } from 'react';
import { CheckCircle, ShieldCheck, Truck, Package, QrCode, ClipboardList, ArrowRight, ShieldAlert, BarChart3, Database, Fingerprint, MapPin, Search } from 'lucide-react';

const Confirmation: React.FC = () => {
  const [isVerified, setIsVerified] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [searchId, setSearchId] = useState('');

  const shipments = [
    { 
      id: 'PGN-8842-AX', 
      vessel: 'Blue Sky Orion', 
      status: 'In Transit', 
      eta: '48h', 
      origin: 'Singapore', 
      destination: 'Rotterdam Hub',
      materials: [
        { name: 'Copper Wiring', qty: '2.4 Tons', criticality: 'Critical' },
        { name: 'Structural Steel', qty: '15.0 Tons', criticality: 'Stable' }
      ], 
      ver: 'High' 
    },
    { 
      id: 'PGN-9021-RT', 
      vessel: 'Arctic Horizon', 
      status: 'Docking', 
      eta: '12d', 
      origin: 'Busan', 
      destination: 'LA Port Vector',
      materials: [
        { name: 'A-Grade Silicon Chips', qty: '500 Units', criticality: 'Critical' },
        { name: 'Composite Shells', qty: '4.2 Tons', criticality: 'Low' }
      ], 
      ver: 'Med' 
    }
  ];

  return (
    <div className="p-8 space-y-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-5xl font-orbitron font-black tracking-tighter text-white">FINAL <span className="text-cyan-400">AUTHORIZATION</span></h1>
          <p className="text-slate-500 text-xs uppercase font-bold tracking-[0.5em] mt-2 flex items-center gap-2">
            <ShieldCheck size={14} className="text-cyan-500" />
            Secure Execution Node • Quantum Encrypted Link
          </p>
        </div>
        <div className="flex gap-4">
           <div className="glass px-6 py-3 rounded-2xl flex items-center gap-4 border-emerald-500/20 bg-emerald-500/5">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <div>
                 <p className="text-[9px] text-slate-500 font-black uppercase">Active Auth Node</p>
                 <p className="text-sm font-orbitron font-bold text-emerald-400">PGN-ALPHA-7</p>
              </div>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Deal Making Workflow */}
        <div className="lg:col-span-2 space-y-8">
           <div className="glass rounded-[3rem] p-10 border-white/5 relative overflow-hidden bg-slate-950/20 shadow-2xl">
              <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
                 <ClipboardList size={250} />
              </div>
              
              <div className="flex justify-between items-center mb-10">
                 <h2 className="text-2xl font-orbitron font-black tracking-tight flex items-center gap-4">
                    <CheckCircle className="text-cyan-500" size={28} />
                    DEAL EXECUTION FLOW
                 </h2>
                 <div className="flex gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                    <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-pulse" />
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-800" />
                 </div>
              </div>
              
              <div className="flex justify-between relative mb-16 px-10">
                 {[1, 2, 3].map((step) => (
                   <div key={step} className="flex flex-col items-center z-10">
                      <div className={`w-16 h-16 rounded-[1.5rem] flex items-center justify-center font-orbitron font-black text-xl transition-all duration-700 ${currentStep >= step ? 'bg-cyan-500 text-slate-950 shadow-[0_0_40px_rgba(34,211,238,0.4)]' : 'glass border-white/10 text-slate-700'}`}>
                         {step}
                      </div>
                      <p className={`text-[10px] font-black uppercase mt-4 tracking-[0.2em] transition-colors duration-500 ${currentStep >= step ? 'text-cyan-400' : 'text-slate-600'}`}>
                         {step === 1 ? 'Verify Params' : step === 2 ? 'Commander Auth' : 'Chain Dispatch'}
                      </p>
                   </div>
                 ))}
                 <div className="absolute top-8 left-20 right-20 h-0.5 bg-slate-900 -z-0" />
                 <div className="absolute top-8 left-20 h-0.5 bg-cyan-500 transition-all duration-700 -z-0" style={{ width: `${(currentStep - 1) * 50}%` }} />
              </div>

              <div className="glass rounded-[2rem] p-10 border-white/5 bg-slate-950/40 space-y-8">
                 <div className="flex flex-col md:flex-row justify-between items-start md:items-center pb-8 border-b border-white/5 gap-4">
                    <div>
                       <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-2">Primary Asset Class</p>
                       <p className="text-3xl font-orbitron font-black text-white">STEEL BATCH <span className="text-cyan-400">Q3-99</span></p>
                    </div>
                    <div className="text-right">
                       <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest mb-2">Agreed Valuation</p>
                       <p className="text-3xl font-orbitron font-black text-emerald-500">$542,000.00</p>
                    </div>
                 </div>
                 
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="p-6 glass rounded-[1.5rem] border-white/5 bg-white/5">
                       <p className="text-[10px] text-slate-500 uppercase font-black mb-3">Validated Vendor</p>
                       <p className="text-sm font-black text-slate-200">GLOBAL STEEL HOLDINGS</p>
                       <p className="text-[9px] text-slate-600 mt-1 uppercase">ID: GSH-ALPHA-92</p>
                    </div>
                    <div className="p-6 glass rounded-[1.5rem] border-white/5 bg-white/5">
                       <p className="text-[10px] text-slate-500 uppercase font-black mb-3">Logistics Lead Time</p>
                       <p className="text-sm font-black text-slate-200">14 DAYS (ESTIMATED)</p>
                       <p className="text-[9px] text-emerald-500 mt-1 uppercase italic">Optimal Path Selected</p>
                    </div>
                    <div className="p-6 glass rounded-[1.5rem] border-white/5 bg-white/5">
                       <p className="text-[10px] text-slate-500 uppercase font-black mb-3">Risk Assessment</p>
                       <p className="text-sm font-black text-emerald-500">LOW (2.4%)</p>
                       <p className="text-[9px] text-slate-600 mt-1 uppercase">Insurance Active</p>
                    </div>
                 </div>

                 <button 
                   onClick={() => setCurrentStep(prev => prev < 3 ? prev + 1 : 1)}
                   className="w-full py-6 bg-gradient-to-r from-cyan-600 to-cyan-400 text-slate-950 font-black text-sm rounded-[1.5rem] uppercase tracking-[0.4em] shadow-2xl hover:scale-[1.01] active:scale-95 transition-all flex items-center justify-center gap-4 group"
                 >
                    {currentStep === 1 ? 'FINALIZE DEAL STRUCTURE' : currentStep === 2 ? 'EXECUTE BIOMETRIC LOCK' : 'DEAL ARCHIVED & SHIPPED'}
                    <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                 </button>
              </div>
           </div>

           {/* Shipment Intel */}
           <div className="glass rounded-[3rem] p-10 border-white/5 bg-slate-950/20 shadow-xl">
              <div className="flex justify-between items-center mb-8">
                 <h2 className="text-2xl font-orbitron font-black tracking-tight flex items-center gap-4">
                    <Truck className="text-purple-500" size={28} />
                    LIVE LOGISTICS FEED
                 </h2>
                 <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-600" size={16} />
                    <input 
                      type="text" 
                      placeholder="TRACK SHIPMENT..."
                      className="bg-slate-900 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-[10px] font-orbitron text-cyan-400 outline-none focus:border-cyan-500/30"
                      value={searchId}
                      onChange={(e) => setSearchId(e.target.value)}
                    />
                 </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 {shipments.map(s => (
                    <div key={s.id} className="p-8 glass rounded-[2rem] border-white/5 bg-slate-900/40 group hover:border-cyan-500/20 transition-all shadow-lg">
                       <div className="flex justify-between items-start mb-6">
                          <div>
                             <p className="text-[10px] text-cyan-500 font-black font-orbitron tracking-widest">{s.id}</p>
                             <h4 className="text-lg font-black text-white uppercase mt-1">{s.vessel}</h4>
                             <p className="text-[10px] text-slate-500 uppercase font-bold">{s.origin} <ArrowRight size={10} className="inline mx-1" /> {s.destination}</p>
                          </div>
                          <div className="w-12 h-12 rounded-2xl glass flex items-center justify-center group-hover:bg-cyan-500/10 transition-colors border-white/5">
                             <QrCode size={20} className="text-slate-500 group-hover:text-cyan-400" />
                          </div>
                       </div>
                       
                       <div className="space-y-6">
                          <div>
                             <p className="text-[10px] text-slate-600 font-black uppercase mb-3 tracking-widest">Required Payloads</p>
                             <div className="space-y-2">
                                {s.materials.map(m => (
                                   <div key={m.name} className="flex justify-between items-center p-3 glass rounded-xl border-white/5 bg-white/5">
                                      <span className="text-[10px] font-bold text-slate-200">{m.name}</span>
                                      <div className="flex items-center gap-3">
                                         <span className="text-[10px] font-black text-slate-400">{m.qty}</span>
                                         <span className={`text-[8px] font-black uppercase px-2 py-0.5 rounded ${m.criticality === 'Critical' ? 'bg-rose-500/10 text-rose-500' : 'bg-emerald-500/10 text-emerald-500'}`}>{m.criticality}</span>
                                      </div>
                                   </div>
                                ))}
                             </div>
                          </div>
                          
                          <div className="pt-6 flex justify-between items-center border-t border-white/5">
                             <div className="flex flex-col">
                                <p className="text-[9px] text-slate-600 font-black uppercase">Vessel ETA</p>
                                <p className="text-sm font-orbitron font-black text-cyan-400">{s.eta}</p>
                             </div>
                             <div className="text-right">
                                <p className="text-[9px] text-slate-600 font-black uppercase">Current Node</p>
                                <p className="text-sm font-black text-slate-300 uppercase italic">In Transit</p>
                             </div>
                          </div>
                       </div>
                    </div>
                 ))}
              </div>
           </div>
        </div>

        {/* Security & Verification Sidebar */}
        <div className="space-y-8">
           {/* Biometric Scanner */}
           <div className="glass rounded-[3rem] p-10 border-emerald-500/20 bg-emerald-500/5 text-center flex flex-col items-center shadow-2xl">
              <div className={`w-32 h-32 rounded-[2rem] border-4 flex items-center justify-center mb-8 transition-all duration-700 relative group cursor-pointer ${isVerified ? 'border-emerald-500 bg-emerald-500/20 shadow-[0_0_60px_rgba(16,185,129,0.4)]' : 'border-slate-800'}`}>
                 {isVerified ? (
                    <ShieldCheck size={64} className="text-emerald-500 animate-in zoom-in" />
                 ) : (
                    <>
                       <Fingerprint size={64} className="text-slate-700 group-hover:text-emerald-500/50 transition-colors" />
                       <div className="absolute inset-x-4 h-0.5 bg-emerald-500/30 animate-pulse shadow-[0_0_10px_#10b981]" />
                    </>
                 )}
              </div>
              <h3 className="text-2xl font-orbitron font-black tracking-tight mb-4">NEURAL AUTH</h3>
              <p className="text-xs text-slate-500 leading-relaxed mb-10 px-6 font-medium">Verify biometric signature to release contract funds. Encryption secured via Pigeon Quantum Mesh.</p>
              
              <button 
                onMouseDown={() => setIsVerified(true)}
                onMouseUp={() => setIsVerified(false)}
                onMouseLeave={() => setIsVerified(false)}
                className="w-full py-7 glass rounded-[2rem] border-white/10 active:scale-95 transition-all group overflow-hidden relative border-emerald-500/20"
              >
                 <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-cyan-500/20 opacity-0 group-active:opacity-100 transition-opacity duration-300" />
                 <span className="font-orbitron font-black text-[11px] tracking-[0.5em] relative z-10 text-emerald-400">HOLD FOR SCAN</span>
              </button>
           </div>

           {/* Logistics Pulse */}
           <div className="glass rounded-[3rem] p-10 border-white/5 relative bg-slate-950/20 shadow-2xl">
              <div className="flex justify-between items-center mb-10">
                 <h3 className="text-sm font-orbitron font-bold flex items-center gap-3 tracking-widest uppercase">
                    <Package className="text-cyan-500" size={20} />
                    Live Asset Pulse
                 </h3>
                 <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              
              <div className="space-y-8 relative">
                 <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-slate-900" />
                 
                 {[
                   { t: '14:22 Zulu', m: 'Authorization Signal Received', geo: '51.5074 N, 0.1278 W', active: true },
                   { t: '11:05 Zulu', m: 'Fuel Optimization Calculated', geo: '40.7128 N, 74.0060 W', active: false },
                   { t: '08:45 Zulu', m: 'Vessel PGN-8842 Cleared Port', geo: '1.3521 N, 103.8198 E', active: false }
                 ].map((log, i) => (
                    <div key={i} className={`flex gap-6 relative group transition-all duration-500 ${log.active ? 'scale-105' : 'opacity-40'}`}>
                       <div className={`w-4 h-4 rounded-full z-10 mt-1 transition-all ${log.active ? 'bg-cyan-500 shadow-[0_0_15px_rgba(34,211,238,0.8)]' : 'bg-slate-800'}`} />
                       <div className="flex-1">
                          <p className={`text-[10px] font-black uppercase tracking-widest ${log.active ? 'text-cyan-400' : 'text-slate-600'}`}>{log.t}</p>
                          <p className={`text-xs font-bold mt-1 ${log.active ? 'text-slate-200' : 'text-slate-500'}`}>{log.m}</p>
                          <div className="flex items-center gap-2 mt-2">
                             <MapPin size={10} className="text-slate-600" />
                             <p className="text-[9px] text-slate-700 font-bold uppercase tracking-tighter italic">{log.geo}</p>
                          </div>
                       </div>
                    </div>
                 ))}
              </div>
              
              <div className="mt-10 p-5 glass rounded-[1.5rem] border-rose-500/20 bg-rose-500/5 flex items-center gap-5">
                 <ShieldAlert className="text-rose-500 animate-bounce" size={28} />
                 <div>
                    <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest">Anomaly Warning</p>
                    <p className="text-[10px] text-slate-500 font-medium">Drift detected in Sector 44-B. Re-routing recommended.</p>
                 </div>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Confirmation;
