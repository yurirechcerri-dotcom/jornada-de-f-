
import React from 'react';
import { motion } from 'framer-motion';

interface AppLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animate?: boolean;
}

const AppLogo: React.FC<AppLogoProps> = ({ size = 'md', animate = true }) => {
  const sizeClasses = {
    sm: 'w-10 h-10',
    md: 'w-16 h-16',
    lg: 'w-24 h-24',
    xl: 'w-32 h-32'
  };

  return (
    <motion.div
      initial={animate ? { opacity: 0, scale: 0.8, rotate: -5 } : false}
      animate={animate ? { opacity: 1, scale: 1, rotate: 0 } : false}
      className={`${sizeClasses[size]} bg-white rounded-[2rem] flex items-center justify-center mx-auto shadow-2xl border border-[#C2A385]/20 p-1 relative overflow-hidden`}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D4AF37" />
            <stop offset="50%" stopColor="#C2A385" />
            <stop offset="100%" stopColor="#8B7355" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Raios de Sol Complexos */}
        <g opacity="0.4">
          {[0, 45, 90, 135, 180, 225, 270, 315].map((angle) => (
            <line 
              key={angle}
              x1="50" y1="50" x2="50" y2="15" 
              stroke="url(#goldGradient)" 
              strokeWidth="0.5" 
              transform={`rotate(${angle} 50 50)`} 
            />
          ))}
        </g>

        {/* Círculo de Halo */}
        <circle cx="50" cy="45" r="25" stroke="url(#goldGradient)" strokeWidth="0.5" strokeDasharray="2 2" opacity="0.5" />

        {/* Montanha (A Jornada) */}
        <path 
          d="M20 80 L50 35 L80 80 Z" 
          fill="white" 
          stroke="url(#goldGradient)" 
          strokeWidth="1.5" 
          strokeLinejoin="round" 
        />
        
        {/* Segunda Montanha para Profundidade */}
        <path 
          d="M40 80 L60 55 L85 80 Z" 
          fill="#FDFCF8" 
          stroke="url(#goldGradient)" 
          strokeWidth="1" 
          strokeLinejoin="round" 
          opacity="0.7"
        />

        {/* A Cruz Minimalista mas Elegante */}
        <g filter="url(#glow)">
          <path 
            d="M50 30 L50 65 M40 42 L60 42" 
            stroke="url(#goldGradient)" 
            strokeWidth="3.5" 
            strokeLinecap="round" 
          />
        </g>

        {/* Sol Nascente */}
        <circle cx="50" cy="35" r="6" fill="url(#goldGradient)" opacity="0.8" />
        
        {/* Base de Solo */}
        <path d="M15 80 Q50 75 85 80" stroke="url(#goldGradient)" strokeWidth="1" strokeLinecap="round" opacity="0.4" />
      </svg>
      
      {/* Decorative inner border */}
      <div className="absolute inset-2 border border-[#C2A385]/5 rounded-[1.5rem] pointer-events-none" />
    </motion.div>
  );
};

export default AppLogo;
