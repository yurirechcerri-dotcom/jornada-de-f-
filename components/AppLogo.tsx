import React from 'react';
import { motion } from 'framer-motion';

interface AppLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animate?: boolean;
}

const AppLogo: React.FC<AppLogoProps> = ({ size = 'md', animate = true }) => {
  const sizeClasses = {
    sm: 'w-10 h-10 rounded-xl',
    md: 'w-16 h-16 rounded-2xl',
    lg: 'w-24 h-24 rounded-[2.8rem]',
    xl: 'w-32 h-32 rounded-[3.5rem]'
  };

  return (
    <motion.div
      initial={animate ? { opacity: 0, scale: 0.95 } : false}
      animate={animate ? { opacity: 1, scale: 1 } : false}
      className={`${sizeClasses[size]} bg-white flex items-center justify-center mx-auto relative overflow-hidden p-3`}
    >
      <svg viewBox="0 0 100 100" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Halo Pontilhado sutil */}
        <circle 
          cx="50" cy="42" r="32" 
          stroke="#C2A385" 
          strokeWidth="0.8" 
          strokeDasharray="2 4" 
          opacity="0.3"
        />

        {/* Triângulo Base (Fino conforme a imagem) */}
        <path 
          d="M25 80 L50 42 L75 80 H25Z" 
          stroke="#C2A385" 
          strokeWidth="1.2" 
          strokeLinejoin="round"
        />
        
        {/* Cruz (Hastes mais grossas e centradas) */}
        <path 
          d="M50 34 V72" 
          stroke="#C2A385" 
          strokeWidth="4.5" 
          strokeLinecap="round" 
        />
        <path 
          d="M40 52 H60" 
          stroke="#C2A385" 
          strokeWidth="4.5" 
          strokeLinecap="round" 
        />

        {/* Círculo Sólido no Topo da Cruz */}
        <circle 
          cx="50" cy="30" r="5" 
          fill="#C2A385" 
        />
      </svg>
    </motion.div>
  );
};

export default AppLogo;