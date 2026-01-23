
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Lock, ArrowRight, ShieldCheck, Loader2 } from 'lucide-react';
import AppLogo from '../components/AppLogo';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simula um pequeno delay para feedback visual
    setTimeout(() => {
      onLogin();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#FDFCF8] flex flex-col items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img 
          src="https://images.unsplash.com/photo-1490730141103-6cac27aaab94?q=80&w=2070&auto=format&fit=crop" 
          className="w-full h-full object-cover"
          alt="Sunrise background"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#2C3E50]/40 via-[#2C3E50]/60 to-[#FDFCF8]" />
      </div>

      <div className="relative z-10 w-full max-w-md px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-10"
        >
          <AppLogo size="xl" />
          <h1 className="font-serif text-5xl text-white mt-6 mb-2">Jornada de Fé</h1>
          <p className="text-white/80 italic">Sua caminhada diária com o Pai.</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-8 rounded-[3rem] shadow-2xl border border-[#C2A385]/10"
        >
          <div className="mb-8 p-4 bg-[#FDFCF8] border border-[#C2A385]/10 rounded-2xl flex items-start gap-3 text-left">
            <ShieldCheck size={18} className="text-[#C2A385] shrink-0" />
            <p className="text-[10px] text-[#2C3E50]/60 font-bold uppercase leading-tight tracking-tight">
              Atenção: Use o e-mail cadastrado na <span className="text-[#C2A385]">Cakto</span> para manter seu acesso vitalício.
            </p>
          </div>

          <div className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-[#2C3E50]/30" size={18} />
              <input 
                type="email" 
                placeholder="E-mail da sua compra"
                className="w-full pl-12 pr-4 py-4 bg-[#FDFCF8] rounded-2xl outline-none focus:ring-2 focus:ring-[#C2A385] transition-all border border-gray-100 text-sm font-medium"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-[#2C3E50]/30" size={18} />
              <input 
                type="password" 
                placeholder="Sua senha"
                className="w-full pl-12 pr-4 py-4 bg-[#FDFCF8] rounded-2xl outline-none focus:ring-2 focus:ring-[#C2A385] transition-all border border-gray-100 text-sm font-medium"
              />
            </div>
            
            <button 
              type="button"
              onClick={handleSubmit}
              disabled={isLoading}
              className={`w-full bg-[#C2A385] text-white py-5 rounded-2xl font-bold uppercase tracking-widest text-xs shadow-xl shadow-[#C2A385]/20 flex items-center justify-center gap-3 transition-all active:scale-95 ${isLoading ? 'opacity-70 cursor-wait' : 'hover:bg-[#B19274]'}`}
            >
              {isLoading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  Conectando...
                </>
              ) : (
                <>
                  {isLogin ? 'Iniciar minha Jornada' : 'Criar minha Conta'}
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </div>

          <div className="mt-6 flex items-center justify-between text-[9px] font-black text-[#2C3E50]/40 uppercase tracking-widest">
            <button onClick={() => setIsLogin(!isLogin)}>
              {isLogin ? 'Não tem conta? Cadastre-se' : 'Já tem conta? Login'}
            </button>
            <button>Esqueci a senha</button>
          </div>
        </motion.div>

        <p className="mt-10 text-[9px] text-[#FDFCF8]/60 font-bold uppercase tracking-widest">
          Ambiente Seguro & Criptografado
        </p>
      </div>
    </div>
  );
};

export default Login;
