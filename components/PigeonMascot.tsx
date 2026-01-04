
import React from 'react';

interface PigeonMascotProps {
  className?: string;
  isSpeaking?: boolean;
}

const PigeonMascot: React.FC<PigeonMascotProps> = ({ className = '', isSpeaking = false }) => {
  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Glow Effect */}
      <div className={`absolute inset-0 bg-cyan-500 rounded-full blur-2xl opacity-20 transition-all duration-500 ${isSpeaking ? 'scale-125 opacity-40' : 'scale-100 opacity-20'}`} />
      
      {/* Robot Pigeon SVG */}
      <svg
        viewBox="0 0 100 100"
        className={`w-full h-full pigeon-float drop-shadow-[0_0_15px_rgba(34,211,238,0.8)]`}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Head */}
        <path d="M65 30C65 24.4772 60.5228 20 55 20H40C34.4772 20 30 24.4772 30 30V40C30 45.5228 34.4772 50 40 50H55C60.5228 50 65 45.5228 65 40V30Z" fill="#1e293b" />
        <path d="M65 30V40C65 45.5228 60.5228 50 55 50H40C34.4772 50 30 45.5228 30 40V30C30 24.4772 34.4772 20 40 20H55C60.5228 20 65 24.4772 65 30Z" stroke="#22d3ee" strokeWidth="2" />
        
        {/* Eyes/Sensors */}
        <circle cx="40" cy="35" r="4" fill={isSpeaking ? "#ff00ff" : "#22d3ee"} className="transition-colors duration-300" />
        <circle cx="55" cy="35" r="4" fill={isSpeaking ? "#ff00ff" : "#22d3ee"} className="transition-colors duration-300" />
        
        {/* Beak */}
        <path d="M65 38L75 42L65 46V38Z" fill="#22d3ee" fillOpacity="0.8" />
        
        {/* Body */}
        <path d="M30 55C30 55 15 60 15 75C15 85 25 90 50 90C75 90 85 85 85 75C85 60 70 55 70 55H30Z" fill="#1e293b" stroke="#22d3ee" strokeWidth="2" />
        
        {/* Cyber Details */}
        <line x1="30" y1="65" x2="70" y2="65" stroke="#22d3ee" strokeWidth="1" strokeDasharray="4 2" />
        <line x1="30" y1="75" x2="70" y2="75" stroke="#22d3ee" strokeWidth="1" strokeDasharray="4 2" />
      </svg>
      
      {/* Speaking Ripple */}
      {isSpeaking && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 border-2 border-cyan-400 rounded-full animate-ping opacity-30" />
      )}
    </div>
  );
};

export default PigeonMascot;
