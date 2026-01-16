
import React from 'react';

interface PigeonMascotProps {
  className?: string;
  isSpeaking?: boolean;
}

const PigeonMascot: React.FC<PigeonMascotProps> = ({ className = '', isSpeaking = false }) => {
  const isModerate = document.body.classList.contains('moderate');
  const accentColor = isModerate ? "#f59e0b" : "#22d3ee";
  const eyeColor = isSpeaking ? "#ff00ff" : accentColor;

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Glow Effect */}
      <div className={`absolute inset-0 rounded-full blur-2xl transition-all duration-500 ${isSpeaking ? 'scale-150 opacity-50' : 'scale-100 opacity-20'} ${isModerate ? 'bg-amber-500' : 'bg-cyan-500'}`} />
      
      {/* Advanced Cyber Pigeon SVG */}
      <svg
        viewBox="0 0 100 100"
        className={`w-full h-full pigeon-float drop-shadow-[0_0_15px_${accentColor}80]`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Definition for gradients and patterns */}
        <defs>
          <linearGradient id="pigeonGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e293b" />
            <stop offset="100%" stopColor="#0f172a" />
          </linearGradient>
        </defs>

        {/* Pigeon Neck and Head Silhouette */}
        <path 
          d="M35 70 Q 30 40 45 25 Q 55 15 65 22 Q 72 28 65 35 Q 55 45 55 60" 
          stroke={accentColor} 
          strokeWidth="1.5" 
          fill="url(#pigeonGradient)"
        />
        
        {/* Head/Brain Unit */}
        <circle cx="56" cy="24" r="8" fill="#1e293b" stroke={accentColor} strokeWidth="1" />
        
        {/* Cyber Eye Sensor */}
        <circle 
          cx="60" 
          cy="24" 
          r="3" 
          fill={eyeColor} 
          className={`transition-colors duration-300 ${isSpeaking ? 'animate-pulse' : ''}`} 
        />
        
        {/* Beak - Sleek and Aero */}
        <path d="M64 24L74 26L64 28V24Z" fill={accentColor} fillOpacity="0.9" />

        {/* Main Body Hull */}
        <path 
          d="M25 65 C 20 65 10 75 10 85 C 10 92 20 95 50 95 C 80 95 90 92 90 85 C 90 70 75 60 55 60 L 25 65Z" 
          fill="url(#pigeonGradient)" 
          stroke={accentColor} 
          strokeWidth="2" 
        />
        
        {/* Cybernetic Wing Plates */}
        <path 
          d="M30 65 Q 45 60 75 75 Q 85 85 80 90" 
          stroke={accentColor} 
          strokeWidth="1" 
          strokeDasharray="4 2" 
          opacity="0.6"
        />
        <path 
          d="M35 72 Q 50 68 70 80" 
          stroke={accentColor} 
          strokeWidth="0.5" 
          opacity="0.4"
        />

        {/* Data/Energy Flow Lines */}
        <circle cx="35" cy="85" r="1" fill={accentColor} className="animate-pulse" />
        <circle cx="45" cy="88" r="1" fill={accentColor} className="animate-pulse [animation-delay:0.3s]" />
        <circle cx="55" cy="86" r="1" fill={accentColor} className="animate-pulse [animation-delay:0.6s]" />
        
        {/* Tail Feathers - Tech Styled */}
        <path d="M10 85 L 2 82 L 8 88 L 0 90 L 10 92" stroke={accentColor} strokeWidth="1" />
      </svg>
      
      {/* Speaking Ripple Rings */}
      {isSpeaking && (
        <>
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 rounded-full animate-ping opacity-30 ${isModerate ? 'border-amber-400' : 'border-cyan-400'}`} />
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 border rounded-full animate-ping opacity-10 [animation-delay:0.5s] ${isModerate ? 'border-amber-400' : 'border-cyan-400'}`} />
        </>
      )}
    </div>
  );
};

export default PigeonMascot;
