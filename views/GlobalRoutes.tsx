
import React, { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import { 
  ShieldCheck, MapPin, CloudRain, 
  Sun, Radar, Cpu, Activity, Database, Search,
  Navigation, Wind, AlertTriangle, ShieldAlert,
  ArrowRight, Globe as GlobeIcon,
  Thermometer
} from 'lucide-react';

const GlobalRoutes: React.FC = () => {
  const [isStormActive, setIsStormActive] = useState(false);
  const [shipmentId, setShipmentId] = useState('PGN-8842-AX');
  const [isVerifying, setIsVerifying] = useState(false);
  const [activeWeather, setActiveWeather] = useState({ temp: '24°C', cond: 'Clear', location: 'Atlantic Transit' });
  const mountRef = useRef<HTMLDivElement>(null);
  
  // Three.js Refs
  const sceneRef = useRef<THREE.Scene | null>(null);
  const globeRef = useRef<THREE.Mesh | null>(null);
  const pigeonRef = useRef<THREE.Group | null>(null);
  const stormCloudRef = useRef<THREE.Mesh | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // --- Scene Setup ---
    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.z = 4;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    mountRef.current.appendChild(renderer.domElement);

    // --- Lights ---
    const ambientLight = new THREE.AmbientLight(0x404040, 2);
    scene.add(ambientLight);
    const pointLight = new THREE.PointLight(0x22d3ee, 100, 100);
    pointLight.position.set(5, 5, 5);
    scene.add(pointLight);

    // --- Globe ---
    const geometry = new THREE.SphereGeometry(1, 64, 64);
    const material = new THREE.MeshPhongMaterial({
      color: 0x0f172a,
      emissive: 0x22d3ee,
      emissiveIntensity: 0.1,
      shininess: 50,
      transparent: true,
      opacity: 0.9,
      wireframe: true, // Holographic grid feel
    });
    const globe = new THREE.Mesh(geometry, material);
    scene.add(globe);
    globeRef.current = globe;

    // Add a glowing core
    const coreGeom = new THREE.SphereGeometry(0.95, 32, 32);
    const coreMat = new THREE.MeshBasicMaterial({ color: 0x22d3ee, transparent: true, opacity: 0.05 });
    const core = new THREE.Mesh(coreGeom, coreMat);
    globe.add(core);

    // --- 3D Pigeon Drone Mascot ---
    const pigeonGroup = new THREE.Group();
    const bodyGeom = new THREE.BoxGeometry(0.15, 0.1, 0.2);
    const bodyMat = new THREE.MeshPhongMaterial({ color: 0x334155, emissive: 0x22d3ee });
    const body = new THREE.Mesh(bodyGeom, bodyMat);
    pigeonGroup.add(body);

    const wingGeom = new THREE.BoxGeometry(0.3, 0.02, 0.1);
    const wingL = new THREE.Mesh(wingGeom, bodyMat);
    wingL.position.x = -0.15;
    pigeonGroup.add(wingL);
    const wingR = wingL.clone();
    wingR.position.x = 0.15;
    pigeonGroup.add(wingR);

    scene.add(pigeonGroup);
    pigeonRef.current = pigeonGroup;

    // --- Storm Anomaly ---
    const stormGeom = new THREE.TorusGeometry(0.2, 0.05, 16, 100);
    const stormMat = new THREE.MeshBasicMaterial({ color: 0xff0055, transparent: true, opacity: 0 });
    const storm = new THREE.Mesh(stormGeom, stormMat);
    storm.position.set(0.6, 0.6, 0.6);
    scene.add(storm);
    stormCloudRef.current = storm;

    // --- Animation Loop ---
    let frame = 0;
    const animate = () => {
      frame += 0.01;
      requestAnimationFrame(animate);

      if (globe) globe.rotation.y += 0.002;
      
      if (pigeonGroup) {
        // Orbit logic
        const orbitRadius = 1.6;
        pigeonGroup.position.x = Math.cos(frame * 0.5) * orbitRadius;
        pigeonGroup.position.z = Math.sin(frame * 0.5) * orbitRadius;
        pigeonGroup.position.y = Math.sin(frame * 0.8) * 0.5;
        pigeonGroup.lookAt(globe.position);
        
        // Wing flap
        wingL.rotation.z = Math.sin(frame * 10) * 0.5;
        wingR.rotation.z = -Math.sin(frame * 10) * 0.5;
      }

      if (storm) {
        storm.rotation.z += 0.05;
        // Logic for storm visibility tied to state
        stormMat.opacity = THREE.MathUtils.lerp(stormMat.opacity, isStormActive ? 0.6 : 0, 0.05);
      }

      renderer.render(scene, camera);
    };

    animate();

    // Handle Resize
    const handleResize = () => {
      const w = mountRef.current?.clientWidth || width;
      const h = mountRef.current?.clientHeight || height;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      mountRef.current?.removeChild(renderer.domElement);
    };
  }, [isStormActive]);

  useEffect(() => {
    const stormTrigger = setTimeout(() => {
      setIsStormActive(true);
      setActiveWeather({ temp: '14°C', cond: 'Severe Storm', location: 'North Sea Vector' });
    }, 6000);
    return () => clearTimeout(stormTrigger);
  }, []);

  const handleVerify = () => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
    }, 2000);
  };

  return (
    <div className="h-full w-full relative overflow-hidden flex flex-col p-6 gap-6">
      {/* Top Telemetry Header */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 z-10">
        {/* Verification & ID */}
        <div className="glass p-4 rounded-3xl border-cyan-500/20 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-2">
              <h3 className="text-[10px] font-orbitron font-bold text-cyan-600 dark:text-cyan-400 flex items-center gap-2">
                <ShieldCheck size={14} /> SECURITY CLEARANCE
              </h3>
              <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
            </div>
            <div className="relative">
              <input 
                type="text" 
                value={shipmentId}
                onChange={(e) => setShipmentId(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-900/50 border border-slate-200 dark:border-white/10 rounded-xl py-2 px-4 text-xs font-orbitron focus:border-cyan-500/50 outline-none"
              />
              <button 
                onClick={handleVerify}
                className="absolute right-2 top-1.5 p-1 bg-cyan-500 text-white rounded-lg hover:bg-cyan-400 transition-colors"
              >
                <Search size={14} />
              </button>
            </div>
          </div>
          <div className="mt-3 flex items-center justify-between">
            <p className="text-[10px] font-bold text-slate-500">AUTHENTICATED AS:</p>
            <p className="text-[10px] font-bold text-emerald-500">ADITYA G.</p>
          </div>
        </div>

        {/* Global Weather API Simulation */}
        <div className="md:col-span-2 glass p-4 rounded-3xl flex items-center justify-around gap-4 border-white/5 relative overflow-hidden">
          {/* Background data stream animation */}
          <div className="absolute inset-0 opacity-5 pointer-events-none text-[8px] font-mono leading-none break-all p-2 select-none overflow-hidden">
            WEATHER_DATA_IN_09218201298301293081230123...
            STREAM_NORTH_SEA_VECTOR_ACTIVE...
            TEMP_DECREASE_DETECTED...
          </div>
          
          <div className="flex items-center gap-4">
             <div className={`p-4 rounded-full transition-all duration-700 ${isStormActive ? 'bg-rose-500/10 text-rose-500 animate-bounce' : 'bg-cyan-500/10 text-cyan-500'}`}>
                {isStormActive ? <CloudRain size={28} /> : <Sun size={28} />}
             </div>
             <div>
                <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Active Weather Feed</p>
                <p className="text-xl font-orbitron">{activeWeather.location}</p>
                <div className="flex gap-2 items-center mt-1">
                   <div className="flex items-center gap-1 px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 text-[10px] font-bold">
                     <Thermometer size={10} /> {activeWeather.temp}
                   </div>
                   <div className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${isStormActive ? 'bg-rose-500 text-white' : 'bg-emerald-500/10 text-emerald-500'}`}>
                     {activeWeather.cond}
                   </div>
                </div>
             </div>
          </div>
          <div className="hidden lg:flex flex-col gap-2">
             <div className="flex items-center gap-2">
                <Wind size={14} className="text-slate-400" />
                <span className="text-xs font-medium">{isStormActive ? '85 km/h' : '12 km/h'}</span>
             </div>
             <div className="flex items-center gap-2">
                <Navigation size={14} className="text-slate-400" />
                <span className="text-xs font-medium">NE Vector</span>
             </div>
          </div>
        </div>

        {/* System Health */}
        <div className="glass p-4 rounded-3xl border-white/5 flex flex-col justify-center">
           <div className="flex justify-between items-center mb-2">
             <p className="text-[10px] font-bold text-slate-500">PIGEON SCOUT MESH</p>
             <div className="flex gap-0.5">
               <div className="w-1 h-3 bg-emerald-500 rounded-full" />
               <div className="w-1 h-3 bg-emerald-500 rounded-full" />
               <div className={`w-1 h-3 rounded-full ${isStormActive ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`} />
             </div>
           </div>
           <div className="flex gap-3">
              <Cpu size={16} className="text-cyan-500" />
              <Database size={16} className="text-purple-500" />
              <Radar size={16} className="text-rose-500 animate-spin" />
           </div>
        </div>
      </div>

      {/* Main 3D Holographic Display */}
      <div className="flex-1 flex flex-col lg:flex-row gap-6 relative">
        
        {/* The 3D World */}
        <div className="flex-1 glass rounded-[3rem] relative overflow-hidden bg-slate-950/20 group">
          <div id="three-canvas-container" ref={mountRef} className="absolute inset-0 cursor-grab active:cursor-grabbing" />
          
          {/* Holographic Controls UI Overlay */}
          <div className="absolute top-6 left-6 z-10 pointer-events-none">
             <div className="glass p-3 rounded-2xl border-white/10 backdrop-blur-xl pointer-events-auto">
                <h4 className="text-[10px] font-orbitron font-bold text-cyan-400 mb-2">TELEMETRY OVERLAY</h4>
                <div className="space-y-2">
                   <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-cyan-500 animate-ping" />
                      <span className="text-[9px] font-bold text-slate-400 uppercase">Globe Rotation: Active</span>
                   </div>
                   <div className="flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-500" />
                      <span className="text-[9px] font-bold text-slate-400 uppercase">Mascot Link: 99%</span>
                   </div>
                </div>
             </div>
          </div>

          {/* Storm Alert Overlay */}
          {isStormActive && (
            <div className="absolute top-6 right-6 z-10 pointer-events-none animate-in fade-in slide-in-from-right duration-500">
               <div className="glass p-4 rounded-2xl border-rose-500/30 bg-rose-500/10 backdrop-blur-xl pointer-events-auto">
                  <div className="flex items-center gap-3 text-rose-500 mb-2">
                     <AlertTriangle size={20} className="animate-pulse" />
                     <h4 className="text-xs font-orbitron font-bold">STORM ANOMALY</h4>
                  </div>
                  <p className="text-[10px] text-slate-300 mb-3 leading-tight max-w-[150px]">
                    Heavy convection detected on Sector 44-B. Alternative path generated.
                  </p>
                  <button className="w-full py-2 bg-rose-500 text-white text-[10px] font-black rounded-lg uppercase tracking-widest hover:bg-rose-600 transition-colors">
                    Reroute Assets
                  </button>
               </div>
            </div>
          )}

          {/* Bottom Legend */}
          <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end pointer-events-none">
             <div className="glass px-4 py-2 rounded-xl text-[10px] font-bold text-cyan-400 border-white/5 pointer-events-auto">
                COORD: 51.5074° N, 0.1278° W
             </div>
             <div className="flex gap-2 pointer-events-auto">
                <button className="glass p-3 rounded-full hover:bg-cyan-500/20 text-slate-400 hover:text-cyan-400 transition-all"><GlobeIcon size={18} /></button>
                <button className="glass p-3 rounded-full hover:bg-cyan-500/20 text-slate-400 hover:text-cyan-400 transition-all"><Radar size={18} /></button>
             </div>
          </div>
        </div>

        {/* Tactical Route Details & Tracking (Google Maps Style Enhancement) */}
        <div className="w-full lg:w-[450px] flex flex-col gap-6">
          <div className="glass rounded-[2rem] p-6 border-white/5 flex flex-col h-full bg-slate-100/30 dark:bg-slate-950/40">
            <div className="flex justify-between items-center mb-6">
               <h3 className="text-xs font-orbitron text-slate-500 flex items-center gap-2">
                  <MapPin size={14} className="text-rose-500" /> TACTICAL VECTOR ANALYSIS
               </h3>
               <span className="text-[9px] font-bold text-cyan-500 bg-cyan-500/10 px-2 py-1 rounded">LIVE MAP</span>
            </div>

            {/* Simulated High-End Map Interface */}
            <div className="flex-1 relative rounded-3xl bg-slate-900 overflow-hidden border border-white/5 group mb-6">
               {/* Grid Background */}
               <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] bg-[size:16px_16px] opacity-20" />
               
               <div className="absolute inset-0 flex flex-col p-4">
                  <div className="flex-1 border border-white/5 rounded-2xl bg-slate-950/30 backdrop-blur-sm relative overflow-hidden">
                     {/* Paths */}
                     <svg className="w-full h-full" viewBox="0 0 200 120">
                        {/* Static Path (Original) */}
                        <path 
                          d="M 30 60 L 170 60" 
                          stroke={isStormActive ? "#ef4444" : "#22d3ee"} 
                          strokeWidth="2" 
                          strokeDasharray="4 4" 
                          fill="none"
                          className="transition-colors duration-1000"
                        />
                        {/* Dynamic Alternative Path */}
                        {isStormActive && (
                          <path 
                            d="M 30 60 Q 100 110 170 60" 
                            stroke="#10b981" 
                            strokeWidth="3" 
                            fill="none" 
                            className="animate-[dash_2s_linear_infinite]"
                            strokeDasharray="6 4"
                          />
                        )}
                        
                        {/* Nodes */}
                        <circle cx="30" cy="60" r="4" fill="#ef4444" className="animate-pulse" />
                        <circle cx="170" cy="60" r="4" fill="#22d3ee" className="animate-pulse" />
                        
                        <text x="25" y="50" className="text-[6px] fill-slate-500 font-bold uppercase">Departure</text>
                        <text x="160" y="50" className="text-[6px] fill-slate-500 font-bold uppercase">Arrival</text>
                     </svg>

                     {/* Pigeon Scout Suggestion Box */}
                     {isStormActive && (
                        <div className="absolute bottom-4 left-4 right-4 animate-in slide-in-from-bottom-2 duration-500">
                           <div className="glass p-3 rounded-xl border-emerald-500/20 flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-emerald-500/20 flex items-center justify-center">
                                 <Navigation size={14} className="text-emerald-500" />
                              </div>
                              <div>
                                 <p className="text-[8px] font-bold text-emerald-500 uppercase tracking-widest">Optimized Vector</p>
                                 <p className="text-[10px] text-slate-300">Savings: +4.2h / -12% Fuel</p>
                              </div>
                           </div>
                        </div>
                     )}
                  </div>
               </div>

               {/* Map Controls */}
               <div className="absolute top-4 right-4 flex flex-col gap-2">
                  <button className="w-8 h-8 glass rounded-lg flex items-center justify-center text-slate-400 hover:text-white">+</button>
                  <button className="w-8 h-8 glass rounded-lg flex items-center justify-center text-slate-400 hover:text-white">-</button>
               </div>
            </div>

            {/* Shipment Tracking Stats */}
            <div className="space-y-4">
               <div className="flex justify-between items-center text-xs p-3 glass rounded-2xl border-white/5">
                  <div className="flex items-center gap-2">
                     <ShieldAlert size={14} className={isStormActive ? 'text-rose-500' : 'text-slate-400'} />
                     <span className="text-slate-500 font-bold uppercase tracking-wider">Status:</span>
                  </div>
                  <span className={`font-orbitron font-bold ${isStormActive ? 'text-rose-500' : 'text-emerald-500'}`}>
                    {isStormActive ? 'REDIRECT REQUIRED' : 'ON TRACK'}
                  </span>
               </div>
               
               <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 glass rounded-2xl border-white/5">
                     <p className="text-[9px] text-slate-500 font-bold uppercase mb-1">Current Speed</p>
                     <p className="text-xl font-orbitron">{isStormActive ? '14.2 kt' : '22.8 kt'}</p>
                  </div>
                  <div className="p-4 glass rounded-2xl border-white/5">
                     <p className="text-[9px] text-slate-500 font-bold uppercase mb-1">ETA Offset</p>
                     <p className={`text-xl font-orbitron ${isStormActive ? 'text-rose-500' : 'text-emerald-500'}`}>
                       {isStormActive ? '+04:22' : '00:00'}
                     </p>
                  </div>
               </div>

               <button className="w-full py-4 bg-cyan-500 text-slate-950 font-black text-xs rounded-2xl uppercase tracking-[0.2em] shadow-[0_0_20px_rgba(34,211,238,0.3)] hover:scale-[1.02] transition-all flex items-center justify-center gap-3">
                  INITIATE TACTICAL REROUTE <ArrowRight size={16} />
               </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalRoutes;
