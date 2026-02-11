
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
}

const OptimizedImage: React.FC<OptimizedImageProps> = ({ src, alt, className }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div className={`relative overflow-hidden bg-[#C2A385]/5 ${className}`}>
      <AnimatePresence>
        {!isLoaded && !error && (
          <motion.div
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-gradient-to-br from-[#FDFCF8] to-[#C2A385]/10 animate-pulse"
          />
        )}
      </AnimatePresence>
      
      <img
        src={src}
        alt={alt}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        onError={() => setError(true)}
        className={`w-full h-full object-cover transition-opacity duration-700 ${
          isLoaded ? 'opacity-100' : 'opacity-0'
        }`}
      />
      
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-50 text-[10px] text-gray-300 font-bold uppercase tracking-widest">
          Imagem Indisponível
        </div>
      )}
    </div>
  );
};

export default React.memo(OptimizedImage);
