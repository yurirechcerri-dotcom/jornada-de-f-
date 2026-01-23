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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      onLogin();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#FDFCF8] flex flex-col items-center justify-start overflow-y-auto pt-[15vh] pb-12 no-scrollbar">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 -z-10">
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
          className="mb-12"
        >
          {/* Container da Logo com fundo branco e cantos arredondados */}
          <div className="bg-white p-6 inline-block rounded-[3rem] shadow-2xl mb-8">
            <AppLogo size="xl" animate={false} />
          </div>
          
          <h1 className="font-serif text-5xl text-white mb-2 drop-shadow-lg">Jornada de Fé</h1>
          <p className="text-white/90 italic text-lg drop-shadow-md">Sua caminhada diária com o Pai.</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-8 rounded-[3.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.3)] border border-white/20"
        >
          <div className="mb-8 p-4 bg-[#FDFCF8] border border-[#C2A385]/10 rounded-2xl flex items-start gap-3 text-left">
            <ShieldCheck size={18} className="text-[#C2A385] shrink-0 mt-0.5" />
            <p className="text-[10px] text-[#2C3E50]/60 font-black uppercase leading-tight tracking-tight">
              Atenção: Use o e-mail cadastrado na <span className="text-[#C2A385] underline">Cakto</span> para manter seu acesso vitalício.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-[#2C3E50]/20" size={18} />
              <input 
                required
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="E-mail da sua compra"
                className="w-full pl-14 pr-6 py-5 bg-[#FDFCF8] rounded-[1.5rem] outline-none focus:ring-2 focus:ring-[#C2A385]/30 transition-all border border-gray-100 text-sm font-medium placeholder:text-gray-300"
              />
            </div>
            <div className="relative">
              <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-[#2C3E50]/20" size={18} />
              <input 
                required
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Sua senha"
                className="w-full pl-14 pr-6 py-5 bg-[#FDFCF8] rounded-[1.5rem] outline-none focus:ring-2 focus:ring-[#C2A385]/30 transition-all border border-gray-100 text-sm font-medium placeholder:text-gray-300"
              />
            </div>
            
            <button 
              type="submit"
              disabled={isLoading}
              className={`w-full bg-[#C2A385] text-white py-5 rounded-[1.5rem] font-bold uppercase tracking-[0.15em] text-[11px] shadow-lg shadow-[#C2A385]/30 flex items-center justify-center gap-3 transition-all active:scale-95 ${isLoading ? 'opacity-70 cursor-wait' : 'hover:brightness-105'}`}
            >
              {isLoading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  <span>{isLogin ? 'Iniciar minha Jornada' : 'Criar minha Conta'}</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 flex items-center justify-between text-[10px] font-black text-[#2C3E50]/30 uppercase tracking-[0.1em] px-2">
            <button type="button" onClick={() => setIsLogin(!isLogin)} className="hover:text-[#C2A385] transition-colors">
              {isLogin ? 'Cadastre-se' : 'Já tenho conta'}
            </button>
            <button type="button" className="hover:text-[#C2A385] transition-colors">Esqueci a senha</button>
          </div>
        </motion.div>

        <p className="mt-12 text-[10px] text-[#FDFCF8]/40 font-black uppercase tracking-[0.4em]">
          Ambiente Seguro & Criptografado
        </p>
      </div>
    </div>
  );
};

export default Login;