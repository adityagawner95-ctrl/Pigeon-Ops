
import React, { useState } from 'react';
import { LayoutDashboard, Globe2, Handshake, FileSearch, Settings, LogOut } from 'lucide-react';
import { View } from './types';
import Dashboard from './views/Dashboard';
import GlobalRoutes from './views/GlobalRoutes';
import DealMaker from './views/DealMaker';
import DocInsight from './views/DocInsight';
import AIAssistantOverlay from './components/AIAssistantOverlay';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);

  const renderView = () => {
    switch (currentView) {
      case View.DASHBOARD: return <Dashboard />;
      case View.GLOBAL_ROUTES: return <GlobalRoutes />;
      case View.DEAL_MAKER: return <DealMaker />;
      case View.DOC_INSIGHT: return <DocInsight />;
      default: return <Dashboard />;
    }
  };

  const navItems = [
    { id: View.DASHBOARD, label: 'Dash', icon: LayoutDashboard },
    { id: View.GLOBAL_ROUTES, label: 'Global', icon: Globe2 },
    { id: View.DEAL_MAKER, label: 'Deals', icon: Handshake },
    { id: View.DOC_INSIGHT, label: 'Insights', icon: FileSearch },
  ];

  return (
    <div className="flex h-screen w-screen bg-[#020617] text-slate-200 overflow-hidden font-inter selection:bg-cyan-500/30">
      {/* Sidebar Navigation */}
      <nav className="w-20 md:w-24 bg-slate-950/80 border-r border-white/5 flex flex-col items-center py-8 gap-10 z-40">
        <div className="relative group cursor-pointer" onClick={() => setCurrentView(View.DASHBOARD)}>
           <div className="w-12 h-12 bg-cyan-500/20 rounded-2xl flex items-center justify-center border border-cyan-500/30 group-hover:bg-cyan-500 transition-all duration-300">
             <span className="font-orbitron font-black text-xl text-cyan-400 group-hover:text-slate-950">P</span>
           </div>
           <div className="absolute -inset-2 bg-cyan-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        <div className="flex-1 flex flex-col gap-6">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`p-4 rounded-2xl transition-all duration-300 relative group flex flex-col items-center gap-1 ${currentView === item.id ? 'bg-white/10 text-cyan-400' : 'text-slate-500 hover:text-slate-300 hover:bg-white/5'}`}
            >
              <item.icon size={24} />
              <span className="text-[10px] font-bold uppercase tracking-widest hidden md:block">{item.label}</span>
              {currentView === item.id && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-cyan-500 rounded-r-full shadow-[0_0_10px_#22d3ee]" />
              )}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-6">
          <button className="p-4 text-slate-500 hover:text-slate-300 transition-colors"><Settings size={22} /></button>
          <button className="p-4 text-rose-500/50 hover:text-rose-500 transition-colors"><LogOut size={22} /></button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-5%] left-[10%] w-[300px] h-[300px] bg-purple-500/5 blur-[100px] rounded-full pointer-events-none" />
        
        {/* Top bar (Status/Breadcrumb) */}
        <header className="h-16 px-8 flex items-center justify-between border-b border-white/5 backdrop-blur-md bg-slate-950/20 z-30">
           <div className="flex items-center gap-3">
              <p className="text-[10px] font-black uppercase text-slate-500 tracking-[0.3em]">Network Connection:</p>
              <div className="flex gap-1">
                 <div className="w-3 h-1 bg-emerald-500 rounded-full" />
                 <div className="w-3 h-1 bg-emerald-500 rounded-full animate-pulse" />
                 <div className="w-3 h-1 bg-emerald-500 rounded-full" />
              </div>
           </div>
           <div className="flex items-center gap-6">
              <div className="text-right">
                 <p className="text-[10px] font-bold text-slate-500 uppercase">Current User</p>
                 <p className="text-sm font-orbitron font-bold text-white tracking-wide">ADITYA GAWNER</p>
              </div>
              <div className="w-10 h-10 rounded-full glass border border-white/10 flex items-center justify-center p-1">
                 <div className="w-full h-full rounded-full bg-gradient-to-tr from-cyan-500 to-purple-500" />
              </div>
           </div>
        </header>

        {/* View Container */}
        <div className="flex-1 overflow-y-auto overflow-x-hidden relative z-20">
          {renderView()}
        </div>
      </main>

      {/* Global AI Assistant Overlay */}
      <AIAssistantOverlay />
    </div>
  );
};

export default App;
