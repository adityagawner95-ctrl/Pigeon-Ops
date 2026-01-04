
import React, { useState, useEffect } from 'react';
import { Globe, ShieldAlert, Wind, Navigation, AlertTriangle, ArrowRightCircle } from 'lucide-react';
import PigeonMascot from '../components/PigeonMascot';

const GlobalRoutes: React.FC = () => {
  const [isStormActive, setIsStormActive] = useState(false);
  const [currentView, setCurrentView] = useState('North Atlantic');

  useEffect(() => {
    // Simulate a storm alert finding
    const timer = setTimeout(() => setIsStormActive(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="h-full w-full relative overflow-hidden p-8 flex flex-col md:flex-row gap-8">
      {/* 3D Holographic Globe Container (Visual Representation with CSS) */}
      <div className="flex-1 relative flex items-center justify-center min-h-[500px]">
        {/* Hologram Foundation */}
        <div className="absolute w-[400px] h-[400px] rounded-full bg-cyan-500/5 blur-[100px]" />
        
        {/* The "Globe" Visual Element */}
        <div className="relative w-[350px] h-[350px] rounded-full border border-cyan-500/20 flex items-center justify-center animate-[spin_60s_linear_infinite]">
           {/* Grid Lines */}
           <div className="absolute inset-0 border border-cyan-500/10 rounded-full scale-110" />
           <div className="absolute inset-0 border border-cyan-500/10 rounded-full scale-125" />
           <div className="absolute inset-0 border-r border-cyan-500/10 h-full w-[2px] left-1/2" />
           <div className="absolute inset-0 border-b border-cyan-500/10 w-full h-[2px] top-1/2" />
           
           {/* Floating Pigeon Mascot Reversing Around the Globe */}
           <div className="absolute w-20 h-20 -top-10 animate-[spin_10s_linear_infinite_reverse]">
              <PigeonMascot className="scale-75 drop-shadow-[0_0_10px_#22d3ee]" />
           </div>

           {/* Continent Outlines (Symbolic) */}
           <div className="absolute inset-0 p-12 opacity-40">
              <svg viewBox="0 0 100 100" className="w-full h-full text-cyan-400">
                <path d="M20,40 Q30,30 40,35 T60,30 T80,45 T70,70 T40,80 T15,60 Z" fill="none" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" />
                <path d="M10,20 Q20,10 30,15 T50,10" fill="none" stroke="currentColor" strokeWidth="0.5" />
              </svg>
           </div>
        </div>

        {/* Path Visuals */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          {/* Main Route */}
          <svg className="w-[300px] h-[300px] overflow-visible">
            <path 
              d="M 50 150 Q 150 50 250 150" 
              fill="none" 
              stroke={isStormActive ? "#ef4444" : "#22d3ee"} 
              strokeWidth="3" 
              className={`transition-colors duration-500 ${!isStormActive ? 'animate-pulse' : ''}`}
              strokeDasharray="10 5"
            />
            {isStormActive && (
              <path 
                d="M 50 150 Q 150 250 250 150" 
                fill="none" 
                stroke="#10b981" 
                strokeWidth="3" 
                className="animate-pulse"
                strokeDasharray="10 5"
              />
            )}
            
            {/* Storm Marker */}
            {isStormActive && (
               <g transform="translate(140, 40)">
                 <circle r="20" fill="#ef4444" fillOpacity="0.2" className="animate-ping" />
                 <Wind className="text-rose-500 -translate-x-3 -translate-y-3" size={24} />
               </g>
            )}
          </svg>
        </div>

        {/* UI Overlays */}
        <div className="absolute bottom-10 left-10 glass p-4 rounded-2xl border-cyan-500/30">
          <p className="text-[10px] text-slate-500 uppercase font-black mb-1">Current Sector</p>
          <p className="text-xl font-orbitron text-white">{currentView}</p>
          <div className="flex gap-2 mt-4">
             <div className="w-2 h-2 rounded-full bg-emerald-500" />
             <div className="w-2 h-2 rounded-full bg-emerald-500" />
             <div className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Control Panel */}
      <div className="w-full md:w-96 space-y-6">
        <div className="glass p-6 rounded-3xl border-rose-500/20 relative overflow-hidden">
          {isStormActive && <div className="absolute top-0 left-0 w-full h-1 bg-rose-500 animate-pulse" />}
          <div className="flex items-center gap-3 mb-6">
             <div className={`p-3 rounded-2xl ${isStormActive ? 'bg-rose-500/20 text-rose-500' : 'bg-cyan-500/20 text-cyan-500'}`}>
                {isStormActive ? <ShieldAlert size={24} /> : <Globe size={24} />}
             </div>
             <div>
                <h3 className="font-orbitron text-lg">ROUTE ANALYSIS</h3>
                <p className="text-[10px] text-slate-500 uppercase">Real-time Satellite Feed</p>
             </div>
          </div>

          <div className="space-y-4">
            <div className={`p-4 rounded-xl border transition-all ${isStormActive ? 'bg-rose-500/5 border-rose-500/20' : 'bg-white/5 border-white/10'}`}>
               <p className="text-xs text-slate-400 mb-2">Primary Path Status:</p>
               <div className="flex justify-between items-center">
                  <span className={`text-sm font-bold ${isStormActive ? 'text-rose-500' : 'text-emerald-500'}`}>
                    {isStormActive ? 'HIGH RISK DETECTED' : 'OPTIMAL'}
                  </span>
                  <AlertTriangle size={16} className={isStormActive ? 'text-rose-500' : 'text-slate-700'} />
               </div>
               {isStormActive && (
                 <p className="text-[10px] text-rose-300 mt-2 italic">
                   Category 4 Tropical Storm crossing the North Atlantic corridor. Estimated delay: 72-96 hours.
                 </p>
               )}
            </div>

            {isStormActive && (
               <div className="p-4 rounded-xl border border-emerald-500/30 bg-emerald-500/5 animate-in slide-in-from-right duration-500">
                  <div className="flex items-center gap-2 mb-2 text-emerald-400">
                     <Navigation size={14} />
                     <p className="text-xs font-bold uppercase">Pigeon Suggestion</p>
                  </div>
                  <p className="text-sm font-bold mb-1">Route Omega-7</p>
                  <p className="text-[10px] text-slate-400">Redirect via Azores Hub. Adds 400 nautical miles but avoids all storm cells.</p>
                  <button className="w-full mt-4 py-2 bg-emerald-500 text-slate-900 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-400 transition-colors flex items-center justify-center gap-2">
                    Accept Route Changes
                    <ArrowRightCircle size={14} />
                  </button>
               </div>
            )}
          </div>
        </div>

        <div className="glass p-6 rounded-3xl space-y-4">
           <h4 className="text-xs font-orbitron text-slate-400">ACTIVE TRACKING</h4>
           <div className="space-y-3">
              {[
                { name: 'S.S. PIGEON-1', pos: '40.7128° N, 74.0060° W', status: 'Transit' },
                { name: 'AIR-HAWK 4', pos: '34.0522° N, 118.2437° W', status: 'Docking' },
                { name: 'FREIGHTER-Z', pos: '35.6762° N, 139.6503° E', status: 'Loading' }
              ].map(v => (
                <div key={v.name} className="flex justify-between items-center py-2 border-b border-white/5 last:border-0">
                   <div>
                      <p className="text-xs font-bold">{v.name}</p>
                      <p className="text-[10px] text-slate-500">{v.pos}</p>
                   </div>
                   <div className="px-2 py-1 bg-white/5 rounded text-[10px] text-cyan-400 font-bold uppercase">
                     {v.status}
                   </div>
                </div>
              ))}
           </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalRoutes;
