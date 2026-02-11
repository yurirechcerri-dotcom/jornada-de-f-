
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, BookOpen, Sun, User, Search, MessageCircle } from 'lucide-react';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Início', icon: Home },
    { path: '/journey', label: 'Caminhos', icon: BookOpen },
    { path: '/bible', label: 'Bíblia', icon: Search },
    { path: '/morning', label: 'Ritual', icon: Sun },
    { path: '/profile', label: 'Eu', icon: User },
  ];

  return (
    <div className="min-h-screen bg-[#FDFCF8] flex flex-col max-w-md mx-auto shadow-2xl relative overflow-hidden">
      <main className="flex-1 pb-24 overflow-y-auto relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="px-6 py-8"
          >
            {children}
          </motion.div>
        </AnimatePresence>
      </main>

      <div className="fixed bottom-6 left-0 right-0 max-w-[calc(100%-3rem)] mx-auto z-50">
        <nav className="bg-white/90 backdrop-blur-xl border border-[#C2A385]/20 rounded-[2.5rem] shadow-[0_20px_50px_rgba(44,62,80,0.1)] flex justify-around items-center h-20 px-2 relative overflow-hidden">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.path === '/' ? location.pathname === '/' : location.pathname.startsWith(item.path);
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className="relative flex flex-col items-center justify-center w-full h-full z-10 group"
              >
                {isActive && (
                  <motion.div
                    layoutId="activeNavTab"
                    className="absolute inset-x-1 inset-y-2 bg-[#C2A385]/10 rounded-3xl -z-10"
                    transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                  />
                )}
                
                <motion.div
                  animate={{ scale: isActive ? 1.1 : 1, y: isActive ? -2 : 0 }}
                  className={`transition-colors duration-300 ${isActive ? 'text-[#C2A385]' : 'text-[#2C3E50]/30'}`}
                >
                  <Icon size={isActive ? 22 : 18} strokeWidth={isActive ? 2.5 : 2} />
                </motion.div>

                <motion.span 
                  animate={{ opacity: isActive ? 1 : 0.4, scale: isActive ? 1 : 0.9 }}
                  className={`text-[7px] uppercase tracking-[0.2em] font-black mt-1 ${isActive ? 'text-[#C2A385]' : 'text-[#2C3E50]/30'}`}
                >
                  {item.label}
                </motion.span>
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="fixed bottom-0 left-0 right-0 h-8 bg-[#FDFCF8] z-40 pointer-events-none" />
    </div>
  );
};

export default Layout;
