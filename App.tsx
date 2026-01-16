
import React, { useState, useEffect } from 'react';
import { LayoutDashboard, Globe2, Bird as BirdIcon, FileSearch, Settings, LogOut, Sun, Moon, Sparkles, CheckSquare, ShieldCheck, Lock, Fingerprint, Loader2 } from 'lucide-react';
import { View } from './types';
import Dashboard from './views/Dashboard';
import GlobalRoutes from './views/GlobalRoutes';
import DealMaker from './views/DealMaker';
import DocInsight from './views/DocInsight';
import Confirmation from './views/Confirmation';
import AIAssistantOverlay from './components/AIAssistantOverlay';

type Theme = 'dark' | 'light' | 'moderate';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.DASHBOARD);
  const [theme, setTheme] = useState<Theme>('dark');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  useEffect(() => {
    document.body.classList.remove('light', 'moderate');
    if (theme !== 'dark') {
      document.body.classList.add(theme);
    }
  }, [theme]);

  const handleBiometricAuth = () => {
    setIsScanning(true);
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress >= 100) {
        setScanProgress(100);
        clearInterval(interval);
        setTimeout(() => {
          setIsAuthenticated(true);
          setIsScanning(false);
        }, 600);
      } else {
        setScanProgress(progress);
      }
    }, 150);
  };

  const toggleTheme = () => {
    setTheme(prev => {
      if (prev === 'dark') return 'light';
      if (prev === 'light') return 'moderate';
      return 'dark';
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-[#020617] text-white font-inter relative overflow-hidden">
        {/* Animated Background Grids */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-20" />
        
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-cyan-500/10 blur-[120px] rounded-full animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-purple-500/10 blur-[120px] rounded-full animate-pulse [animation-delay:1s]" />

        <div className="glass p-12 rounded-[3rem] border-white/5 w-full max-w-lg z-10 flex flex-col items-center gap-10 animate-in fade-in zoom-in-95 duration-1000">
           <div className="relative">
              <div className="w-24 h-24 rounded-3xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shadow-[0_0_40px_rgba(34,211,238,0.2)]">
                 <span className="font-orbitron font-black text-5xl text-cyan-400">P</span>
              </div>
              <div className="absolute -inset-4 bg-cyan-500/20 blur-2xl -z-10 rounded-full animate-pulse" />
           </div>

           <div className="text-center space-y-2">
              <h1 className="text-3xl font-orbitron font-black tracking-tighter text-white">PIGEON OPS <span className="text-cyan-400">S.C.O.P.E</span></h1>
              <p className="text-slate-500 text-[10px] font-black uppercase tracking-[0.5em]">Neural Supply Chain Authorization</p>
           </div>

           <div className="w-full space-y-8">
              <div className="flex flex-col items-center gap-6">
                 <button 
                   onClick={handleBiometricAuth}
                   disabled={isScanning}
                   className={`relative w-32 h-32 rounded-full border-2 transition-all duration-500 flex items-center justify-center group ${isScanning ? 'border-cyan-500 shadow-[0_0_30px_rgba(34,211,238,0.5)]' : 'border-slate-800 hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(34,211,238,0.2)]'}`}
                 >
                    {isScanning ? (
                      <div className="relative w-full h-full flex items-center justify-center">
                         <div className="absolute inset-0 rounded-full border-t-2 border-cyan-400 animate-spin" />
                         <Fingerprint className="text-cyan-400 animate-pulse" size={48} />
                      </div>
                    ) : (
                      <Fingerprint className="text-slate-600 group-hover:text-cyan-400 transition-colors" size={48} />
                    )}
                    
                    {/* Scanning Line */}
                    {isScanning && (
                      <div 
                        className="absolute left-0 right-0 h-0.5 bg-cyan-400 shadow-[0_0_10px_#22d3ee] z-20"
                        style={{ top: `${scanProgress}%`, transition: 'top 0.1s linear' }}
                      />
                    )}
                 </button>
                 
                 <div className="text-center">
                    <p className={`text-xs font-orbitron font-bold uppercase tracking-widest ${isScanning ? 'text-cyan-400 animate-pulse' : 'text-slate-500'}`}>
                       {isScanning ? `Scanning Fingerprint... ${Math.round(scanProgress)}%` : 'Ready for Biometric Input'}
                    </p>
                    <p className="text-[9px] text-slate-700 mt-2 font-bold uppercase italic">Scan or click to bypass for commander access</p>
                 </div>
              </div>

              <div className="relative">
                 <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/5"></div></div>
                 <div className="relative flex justify-center text-[10px] uppercase font-bold text-slate-600"><span className="bg-[#020617] px-4">Secure Passcode Override</span></div>
              </div>

              <button 
                onClick={() => setIsAuthenticated(true)}
                className="w-full py-5 bg-white/5 border border-white/10 hover:border-cyan-500/30 text-slate-400 hover:text-cyan-400 font-black text-xs rounded-2xl uppercase tracking-[0.3em] transition-all flex items-center justify-center gap-3"
              >
                <ShieldCheck size={18} />
                COMMANDER BYPASS
              </button>
           </div>
           
           <div className="flex gap-4 items-center">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <p className="text-[9px] text-slate-600 font-bold uppercase tracking-tighter">System integrity check complete • AES-256 Link Stable</p>
           </div>
        </div>
      </div>
    );
  }

  const renderView = () => {
    switch (currentView) {
      case View.DASHBOARD: return <Dashboard />;
      case View.GLOBAL_ROUTES: return <GlobalRoutes />;
      case View.DEAL_MAKER: return <DealMaker />;
      case View.DOC_INSIGHT: return <DocInsight />;
      case View.CONFIRMATION: return <Confirmation />;
      default: return <Dashboard />;
    }
  };

  const navItems = [
    { id: View.DASHBOARD, label: 'Dash', icon: LayoutDashboard },
    { id: View.GLOBAL_ROUTES, label: 'Global', icon: Globe2 },
    { id: View.DEAL_MAKER, label: 'Bot', icon: BirdIcon },
    { id: View.CONFIRMATION, label: 'Confirm', icon: CheckSquare },
    { id: View.DOC_INSIGHT, label: 'Insights', icon: FileSearch },
  ];

  const getThemeColors = () => {
    switch(theme) {
      case 'light': return { bg: 'bg-slate-50', text: 'text-slate-900', nav: 'bg-white/80 border-slate-200', active: 'text-cyan-600', icon: 'text-slate-400' };
      case 'moderate': return { bg: 'bg-[#1e1b4b]', text: 'text-indigo-50', nav: 'bg-indigo-950/40 border-indigo-400/20', active: 'text-amber-400', icon: 'text-indigo-300' };
      default: return { bg: 'bg-[#020617]', text: 'text-slate-200', nav: 'bg-slate-950/80 border-white/5', active: 'text-cyan-400', icon: 'text-slate-500' };
    }
  };

  const colors = getThemeColors();

  return (
    <div className={`flex h-screen w-screen overflow-hidden font-inter selection:bg-cyan-500/30 transition-colors duration-500 ${colors.bg} ${colors.text}`}>
      <nav className={`w-20 md:w-24 border-r flex flex-col items-center py-8 gap-10 z-40 transition-colors duration-500 backdrop-blur-md ${colors.nav}`}>
        <div className="relative group cursor-pointer" onClick={() => setCurrentView(View.DASHBOARD)}>
           <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all duration-300 ${theme === 'moderate' ? 'bg-amber-500/20 border-amber-500/30 group-hover:bg-amber-500' : 'bg-cyan-500/20 border-cyan-500/30 group-hover:bg-cyan-500'}`}>
             <span className={`font-orbitron font-black text-xl transition-colors ${theme === 'moderate' ? 'text-amber-400 group-hover:text-indigo-950' : 'text-cyan-400 group-hover:text-slate-950'}`}>P</span>
           </div>
        </div>

        <div className="flex-1 flex flex-col gap-6">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={`p-4 rounded-2xl transition-all duration-300 relative group flex flex-col items-center gap-1 ${currentView === item.id 
                ? (theme === 'moderate' ? 'bg-indigo-500/20 text-amber-400' : colors.active + ' bg-white/10') 
                : (colors.icon + ' hover:text-slate-100 hover:bg-white/5')}`}
            >
              <item.icon size={22} />
              <span className="text-[10px] font-bold uppercase tracking-widest hidden md:block">{item.label}</span>
              {currentView === item.id && (
                <div className={`absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 rounded-r-full shadow-[0_0_10px_currentColor] ${theme === 'moderate' ? 'bg-amber-500' : 'bg-cyan-500'}`} />
              )}
            </button>
          ))}
        </div>

        <div className="flex flex-col gap-6">
          <button className={`p-4 transition-colors ${colors.icon} hover:text-slate-200`}><Settings size={20} /></button>
          <button onClick={() => setIsAuthenticated(false)} className="p-4 text-rose-500/50 hover:text-rose-500 transition-colors"><LogOut size={20} /></button>
        </div>
      </nav>

      <main className="flex-1 flex flex-col relative overflow-hidden">
        <header className={`h-16 px-8 flex items-center justify-between border-b backdrop-blur-md z-30 transition-colors duration-500 ${theme === 'dark' ? 'bg-slate-950/20 border-white/5' : theme === 'moderate' ? 'bg-indigo-950/20 border-indigo-400/10' : 'bg-white/20 border-slate-200'}`}>
           <div className="flex items-center gap-6">
              <button 
                onClick={toggleTheme}
                className={`p-2 px-3 rounded-xl glass border transition-all duration-500 hover:scale-105 flex items-center gap-2 ${theme === 'dark' ? 'text-yellow-400 border-yellow-400/20' : theme === 'light' ? 'text-indigo-600 border-indigo-600/20' : 'text-amber-400 border-amber-400/40 bg-indigo-900/40'}`}
              >
                {theme === 'dark' && <Moon size={18} />}
                {theme === 'light' && <Sun size={18} />}
                {theme === 'moderate' && <Sparkles size={18} />}
                <span className="text-[10px] font-bold uppercase tracking-widest hidden sm:block">
                  {theme === 'dark' ? 'Dark' : theme === 'light' ? 'Light' : 'Ethereal'}
                </span>
              </button>
           </div>
           
           <div className="flex items-center gap-6">
              <div className="text-right">
                 <p className="text-[10px] font-bold text-slate-500 uppercase">Commander</p>
                 <p className={`text-sm font-orbitron font-bold tracking-wide transition-colors ${theme === 'moderate' ? 'text-amber-200' : colors.text}`}>ADITYA GAWNER</p>
              </div>
              <div className="w-10 h-10 rounded-full glass border border-white/10 flex items-center justify-center p-1">
                 <div className={`w-full h-full rounded-full bg-gradient-to-tr ${theme === 'moderate' ? 'from-amber-500 to-indigo-500' : 'from-cyan-500 to-purple-500'}`} />
              </div>
           </div>
        </header>

        <div className="flex-1 overflow-y-auto overflow-x-hidden relative z-20">
          {renderView()}
        </div>
      </main>

      <AIAssistantOverlay />
    </div>
  );
};

export default App;
