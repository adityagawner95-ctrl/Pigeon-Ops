
import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { Box, TrendingUp, Clock, Activity, Zap } from 'lucide-react';

const rawMaterialData = [
  { name: 'Steel', level: 85, fill: '#06b6d4', moderateFill: '#fbbf24' },
  { name: 'Composite', level: 42, fill: '#8b5cf6', moderateFill: '#a78bfa' },
  { name: 'Wiring', level: 12, fill: '#ef4444', moderateFill: '#f87171' },
  { name: 'Chips', level: 68, fill: '#10b981', moderateFill: '#34d399' },
];

const profitData = [
  { month: 'Jan', profit: 45000 },
  { month: 'Feb', profit: 52000 },
  { month: 'Mar', profit: 48000 },
  { month: 'Apr', profit: 61000 },
  { month: 'May', profit: 59000 },
  { month: 'Jun', profit: 75000 },
];

const notifications = [
  { id: '1', type: 'alert', title: 'Critical Stock: Wiring', msg: 'Stock dropped below 15% safety margin.' },
  { id: '2', type: 'info', title: 'Upcoming: Batch 44A', msg: 'Shipment from Singapore arriving in 2 days.' },
  { id: '3', type: 'success', title: 'Negotiation Complete', msg: 'Steel vendor finalized at 5% lower rate.' },
];

const Dashboard: React.FC = () => {
  return (
    <div className="p-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Row */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4">
        <div>
          <h1 className="text-4xl font-orbitron font-black tracking-tighter transition-colors">OPERATIONS DASHBOARD</h1>
          <p className="text-slate-400">System State: <span className="text-cyan-500 moderate:text-amber-500 font-bold uppercase">Optimized</span></p>
        </div>
        <div className="flex gap-4">
          <div className="glass px-6 py-3 rounded-xl flex items-center gap-3">
            <div className="p-2 bg-cyan-500/10 moderate:bg-amber-500/10 rounded-lg"><Activity className="text-cyan-500 moderate:text-amber-500" size={20} /></div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Sync Integrity</p>
              <p className="text-xl font-orbitron font-bold">99.8%</p>
            </div>
          </div>
          <div className="glass px-6 py-3 rounded-xl flex items-center gap-3 border-cyan-500/30 moderate:border-amber-500/30">
            <div className="p-2 bg-emerald-500/10 rounded-lg"><TrendingUp className="text-emerald-500" size={20} /></div>
            <div>
              <p className="text-[10px] text-slate-500 uppercase font-bold tracking-wider">Monthly Profit</p>
              <p className="text-xl font-orbitron font-bold text-emerald-500">+12.4%</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Material Status */}
        <div className="lg:col-span-2 glass p-6 rounded-2xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-30 transition-opacity">
            <Box size={100} />
          </div>
          <h2 className="text-xl font-orbitron mb-6 flex items-center gap-2">
            <div className="w-2 h-2 bg-cyan-500 moderate:bg-amber-500 rounded-full animate-pulse" />
            RAW MATERIAL LEVELS
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {rawMaterialData.map((item) => (
              <div key={item.name} className="flex flex-col items-center justify-center p-4 glass rounded-xl border-white/5 hover:border-cyan-500/30 moderate:hover:border-amber-500/30 transition-colors">
                <div className="relative w-20 h-20 mb-3">
                  <svg className="w-20 h-20 transform -rotate-90">
                    <circle cx="40" cy="40" r="35" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-slate-200 dark:text-slate-800 moderate:text-indigo-900/50" />
                    <circle 
                      cx="40" cy="40" r="35" stroke="currentColor" strokeWidth="8" fill="transparent" 
                      strokeDasharray={219.9} strokeDashoffset={219.9 - (item.level / 100) * 219.9}
                      className="transition-all duration-1000"
                      style={{ color: document.body.classList.contains('moderate') ? item.moderateFill : item.fill }}
                    />
                  </svg>
                  <span className="absolute inset-0 flex items-center justify-center text-sm font-bold font-orbitron">
                    {item.level}%
                  </span>
                </div>
                <p className="font-medium">{item.name}</p>
                <p className={`text-[10px] font-bold uppercase mt-1 ${item.level < 20 ? 'text-rose-500' : 'text-slate-500'}`}>
                  {item.level < 20 ? 'Critical' : 'Stable'}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div className="glass p-6 rounded-2xl">
          <h2 className="text-xl font-orbitron mb-6 flex items-center gap-2">
            <Zap className="text-yellow-500 moderate:text-amber-500" size={20} />
            RECENT INTEL
          </h2>
          <div className="space-y-4">
            {notifications.map((n) => (
              <div key={n.id} className="p-4 rounded-xl border transition-colors cursor-pointer group bg-white/5 border-slate-200 dark:border-white/5 moderate:border-indigo-400/10 hover:bg-white/10">
                <div className="flex justify-between items-start mb-1">
                   <h3 className={`text-sm font-bold ${n.type === 'alert' ? 'text-rose-500' : n.type === 'success' ? 'text-emerald-500' : 'text-cyan-500 moderate:text-amber-400'}`}>
                     {n.title}
                   </h3>
                   <Clock size={12} className="text-slate-400" />
                </div>
                <p className="text-xs text-slate-500 leading-relaxed group-hover:text-slate-300">
                  {n.msg}
                </p>
              </div>
            ))}
          </div>
          <button className="w-full mt-6 py-3 glass rounded-xl text-xs font-bold uppercase tracking-widest text-cyan-600 dark:text-cyan-400 moderate:text-amber-500 hover:bg-cyan-500/10 moderate:hover:bg-amber-500/10 transition-all">
            View All Archives
          </button>
        </div>

        {/* Profit Analysis */}
        <div className="lg:col-span-2 glass p-6 rounded-2xl min-h-[400px]">
          <h2 className="text-xl font-orbitron mb-6 flex items-center gap-2">
            <TrendingUp className="text-emerald-500" size={20} />
            FINANCIAL TRAJECTORY
          </h2>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={profitData}>
                <defs>
                  <linearGradient id="colorProfit" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="text-slate-200 dark:text-slate-800 moderate:text-indigo-900/40" vertical={false} />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `$${v/1000}k`} />
                <Tooltip 
                  contentStyle={{ background: 'var(--glass-bg)', border: '1px solid var(--glass-border)', borderRadius: '12px' }}
                  itemStyle={{ color: '#10b981' }}
                />
                <Area type="monotone" dataKey="profit" stroke="#10b981" fillOpacity={1} fill="url(#colorProfit)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="glass p-6 rounded-2xl flex flex-col justify-between">
           <div>
            <h2 className="text-xl font-orbitron mb-6 flex items-center gap-2">
              <Clock className="text-purple-500 moderate:text-amber-400" size={20} />
              UPCOMING SHIPMENTS
            </h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 glass rounded-lg border-white/5">
                <div>
                  <p className="text-xs font-bold">Batch #9928-C</p>
                  <p className="text-[10px] text-slate-500">Origin: Port of Busan</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-orbitron text-cyan-600 dark:text-cyan-400 moderate:text-amber-400">ETA 48H</p>
                  <div className="w-16 h-1 bg-slate-200 dark:bg-slate-800 moderate:bg-indigo-900 rounded-full mt-1 overflow-hidden">
                    <div className="w-[80%] h-full bg-cyan-500 moderate:bg-amber-500" />
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center p-3 glass rounded-lg border-white/5 opacity-60">
                <div>
                  <p className="text-xs font-bold">Batch #9929-D</p>
                  <p className="text-[10px] text-slate-500">Origin: Rotterdam</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-orbitron text-slate-500">ETA 12D</p>
                  <div className="w-16 h-1 bg-slate-200 dark:bg-slate-800 moderate:bg-indigo-900 rounded-full mt-1 overflow-hidden">
                    <div className="w-[10%] h-full bg-slate-600" />
                  </div>
                </div>
              </div>
            </div>
           </div>
           
           <div className="p-4 bg-cyan-500/10 moderate:bg-amber-500/10 rounded-xl border border-cyan-500/20 moderate:border-amber-500/20 mt-4">
              <p className="text-[10px] text-cyan-600 moderate:text-amber-500 font-bold uppercase tracking-wider mb-2">Pigeon AI Prediction</p>
              <p className="text-xs text-slate-600 dark:text-slate-300 moderate:text-indigo-100 leading-relaxed italic">
                "Recommended restocking Steel by Friday to leverage a projected 4% market dip. Negotiator is on standby."
              </p>
           </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
