
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, Loader2, AlertCircle, UserPlus, LogIn } from 'lucide-react';
import { supabase, isSupabaseConfigured, setLocalSession } from '../lib/supabase';
import AppLogo from '../components/AppLogo';

const Login: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    // MODO LOCAL (Fallback caso o Supabase não esteja pronto)
    if (!isSupabaseConfigured()) {
      setTimeout(() => {
        const mockUser = {
          id: btoa(email),
          email: email.trim(),
          display_name: email.split('@')[0],
          is_local: true
        };
        setLocalSession(mockUser);
        localStorage.setItem('user_data', JSON.stringify(mockUser));
        setIsLoading(false);
        // Recarrega para o App.tsx pegar a nova sessão
        window.location.reload();
      }, 800);
      return;
    }

    // MODO SUPABASE REAL
    try {
      if (isSignUp) {
        const { error } = await supabase.auth.signUp({ 
          email: email.trim(), 
          password,
          options: { data: { display_name: email.split('@')[0] } }
        });
        if (error) throw error;
        setErrorMsg("Conta criada! Verifique seu e-mail.");
        setIsSignUp(false);
      } else {
        const { error } = await supabase.auth.signInWithPassword({ 
          email: email.trim(), 
          password 
        });
        if (error) throw error;
      }
    } catch (err: any) {
      setErrorMsg(err.message || "Erro ao conectar. Tente novamente.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#FDFCF8] flex flex-col items-center justify-start overflow-y-auto pt-[8vh] pb-12 no-scrollbar">
      <div className="absolute inset-0 -z-10">
        <img 
          src="https://images.unsplash.com/photo-1490730141103-6cac27aaab94?q=80&w=2070&auto=format&fit=crop" 
          className="w-full h-full object-cover opacity-60"
          alt="Sunrise background"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#2C3E50]/40 via-[#2C3E50]/60 to-[#FDFCF8]" />
      </div>

      <div className="relative z-10 w-full max-w-md px-8 text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="bg-white p-5 inline-block rounded-[2.5rem] shadow-2xl mb-6">
            <AppLogo size="lg" animate={false} />
          </div>
          <h1 className="font-serif text-4xl text-white mb-1 drop-shadow-lg">Jornada de Fé</h1>
          <p className="text-white/80 italic text-sm drop-shadow-md">Sua caminhada diária com o Pai.</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-8 rounded-[3rem] shadow-[0_30px_60px_rgba(0,0,0,0.2)] border border-white/20"
        >
          <div className="mb-8">
            <h2 className="font-serif text-2xl text-[#2C3E50]">
              {isSignUp ? 'Criar Nova Conta' : 'Bem-vindo de volta'}
            </h2>
          </div>

          <AnimatePresence mode="wait">
            {errorMsg && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 p-4 rounded-2xl bg-red-50 text-red-600 border border-red-100 flex items-start gap-3 text-left"
              >
                <AlertCircle size={16} className="shrink-0 mt-0.5" />
                <p className="text-[10px] font-bold leading-tight">{errorMsg}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleAuth} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-[#2C3E50]/20" size={16} />
              <input 
                required
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Seu e-mail"
                className="w-full pl-12 pr-6 py-4 bg-[#FDFCF8] rounded-2xl outline-none border border-gray-100 focus:border-[#C2A385]/50 text-sm"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-[#2C3E50]/20" size={16} />
              <input 
                required
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Sua senha"
                className="w-full pl-12 pr-6 py-4 bg-[#FDFCF8] rounded-2xl outline-none border border-gray-100 focus:border-[#C2A385]/50 text-sm"
              />
            </div>
            
            <button 
              type="submit"
              disabled={isLoading}
              className={`w-full bg-[#C2A385] text-white py-4 rounded-2xl font-bold uppercase tracking-[0.1em] text-[11px] shadow-lg flex items-center justify-center gap-2 transition-all active:scale-95 ${isLoading ? 'opacity-70' : 'hover:brightness-105'}`}
            >
              {isLoading ? (
                <Loader2 size={18} className="animate-spin" />
              ) : (
                <>
                  <span>{isSignUp ? 'Cadastrar Agora' : 'Entrar na Jornada'}</span>
                  {isSignUp ? <UserPlus size={16} /> : <LogIn size={16} />}
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-50">
            <button 
              onClick={() => {
                setIsSignUp(!isSignUp);
                setErrorMsg(null);
              }}
              className="text-[#C2A385] text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 mx-auto hover:underline"
            >
              {isSignUp ? "Já tenho uma conta" : "Não tenho conta, quero cadastrar"}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
