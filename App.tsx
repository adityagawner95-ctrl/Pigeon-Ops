
import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Globe2, Handshake, FileSearch, Settings, LogOut, Sun, Moon } from 'lucide-react';
import { View } from './types';
import Dashboard from './views/Dashboard';
import GlobalRoutes from './views/GlobalRoutes';
import DealMaker from './views/DealMaker';
import DocInsight from './views/DocInsight';
import AIAssistantOverlay from './components/AIAssistantOverlay';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');

  // Sync theme class with body element
  useEffect(() => {
    if (theme === 'light') {
      document.body.classList.add('light');
    } else {
      document.body.classList.remove('light');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

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
    <div className={`flex h-screen w-screen overflow-hidden font-inter selection:bg-cyan-500/30 transition-colors duration-400 ${theme === 'dark' ? 'bg-[#020617] text-slate-200' : 'bg-slate-50 text-slate-900'}`}>
      {/* Sidebar Navigation */}
      <nav className={`w-20 md:w-24 border-r flex flex-col items-center py-8 gap-10 z-40 transition-colors duration-400 ${theme === 'dark' ? 'bg-slate-950/80 border-white/5' : 'bg-white/80 border-slate-200'}`}>
        <div className="relative group cursor-pointer" onClick={() => setCurrentView(View.DASHBOARD)}>
           <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all duration-300 ${theme === 'dark' ? 'bg-cyan-500/20 border-cyan-500/30 group-hover:bg-cyan-500' : 'bg-cyan-100 border-cyan-200 group-hover:bg-cyan-500'}`}>
             <span className={`font-orbitron font-black text-xl transition-colors ${theme === 'dark' ? 'text-cyan-400 group-hover:text-slate-950' : 'text-cyan-600 group-hover:text-white'}`}>P</span>
           </div>
           <div className="absolute -inset-2 bg-cyan-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        <div className="flex-1 flex flex-col gap-6">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`p-4 rounded-2xl transition-all duration-300 relative group flex flex-col items-center gap-1 ${currentView === item.id 
                ? (theme === 'dark' ? 'bg-white/10 text-cyan-400' : 'bg-slate-100 text-cyan-600') 
                : (theme === 'dark' ? 'text-slate-500 hover:text-slate-300 hover:bg-white/5' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50')}`}
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
          <button className={`p-4 transition-colors ${theme === 'dark' ? 'text-slate-500 hover:text-slate-300' : 'text-slate-400 hover:text-slate-600'}`}><Settings size={22} /></button>
          <button className="p-4 text-rose-500/50 hover:text-rose-500 transition-colors"><LogOut size={22} /></button>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col relative overflow-hidden">
        {/* Background Decorative Elements */}
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-5%] left-[10%] w-[300px] h-[300px] bg-purple-500/5 blur-[100px] rounded-full pointer-events-none" />
        
        {/* Top bar (Status/Breadcrumb) */}
        <header className={`h-16 px-8 flex items-center justify-between border-b backdrop-blur-md z-30 transition-colors duration-400 ${theme === 'dark' ? 'bg-slate-950/20 border-white/5' : 'bg-white/20 border-slate-200'}`}>
           <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                 <p className="text-[10px] font-black uppercase text-slate-500 tracking-[0.3em]">Network:</p>
                 <div className="flex gap-1">
                    <div className="w-3 h-1 bg-emerald-500 rounded-full" />
                    <div className="w-3 h-1 bg-emerald-500 rounded-full animate-pulse" />
                    <div className="w-3 h-1 bg-emerald-500 rounded-full" />
                 </div>
              </div>
              
              {/* Theme Toggle */}
              <button 
                onClick={toggleTheme}
                className={`p-2 rounded-xl glass border transition-all duration-300 hover:scale-105 flex items-center gap-2 ${theme === 'dark' ? 'text-yellow-400 border-yellow-400/20' : 'text-indigo-600 border-indigo-600/20'}`}
              >
                {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
                <span className="text-[10px] font-bold uppercase tracking-widest hidden sm:block">
                  {theme === 'dark' ? 'Light' : 'Dark'} Mode
                </span>
              </button>
           </div>
           
           <div className="flex items-center gap-6">
              <div className="text-right">
                 <p className="text-[10px] font-bold text-slate-500 uppercase">Current User</p>
                 <p className={`text-sm font-orbitron font-bold tracking-wide ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>ADITYA GAWNER</p>
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
