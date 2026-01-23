
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, ArrowRight, ShieldCheck, Loader2, AlertCircle, Crown } from 'lucide-react';
import { supabase } from '../lib/supabase';
import AppLogo from '../components/AppLogo';

interface LoginProps {
  onLogin: (userData: any) => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const checkAccessAndLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMsg(null);

    const normalizedEmail = email.toLowerCase().trim();

    // --- BYPASS DE PROPRIETÁRIO (YURI) ---
    if (normalizedEmail === 'yurirechcerri@gmail.com') {
      console.log("👑 Acesso de Proprietário Identificado:", normalizedEmail);
      setTimeout(() => {
        onLogin({
          email: normalizedEmail,
          has_vital_access: true,
          is_admin: true,
          display_name: "Yuri (Admin)"
        });
      }, 600);
      return;
    }

    try {
      // Busca o perfil pelo e-mail
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('email', normalizedEmail)
        .single();

      if (error || !data) {
        setErrorMsg("E-mail não encontrado. Verifique se o pagamento na Cakto foi concluído.");
        setIsLoading(false);
        return;
      }

      // Verifica se o acesso está liberado (has_vital_access)
      if (!data.has_vital_access) {
        setErrorMsg("Seu pagamento foi registrado, mas o acesso ainda não foi liberado. Tente em alguns minutos.");
        setIsLoading(false);
        return;
      }

      // Login bem sucedido
      setTimeout(() => {
        onLogin(data);
      }, 800);

    } catch (err) {
      console.error(err);
      setErrorMsg("Erro de conexão com o banco de dados. Verifique a configuração da chave API.");
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-[#FDFCF8] flex flex-col items-center justify-start overflow-y-auto pt-[12vh] pb-12 no-scrollbar">
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
          className="mb-10"
        >
          <div className="bg-white p-6 inline-block rounded-[3rem] shadow-2xl mb-8">
            <AppLogo size="xl" animate={false} />
          </div>
          <h1 className="font-serif text-5xl text-white mb-2 drop-shadow-lg">Jornada de Fé</h1>
          <p className="text-white/90 italic text-lg drop-shadow-md">Sua caminhada diária com o Pai.</p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-10 rounded-[3.5rem] shadow-[0_30px_60px_rgba(0,0,0,0.3)] border border-white/20"
        >
          <div className="mb-8 space-y-2">
            <h2 className="font-serif text-2xl text-[#2C3E50]">Bem-vindo de volta</h2>
            <p className="text-xs text-[#2C3E50]/40 font-medium">Digite o e-mail usado na sua compra.</p>
          </div>

          {email.toLowerCase().trim() === 'yurirechcerri@gmail.com' && (
             <div className="mb-6 p-4 bg-amber-50 border border-amber-100 rounded-2xl flex items-start gap-3 text-left">
                <Crown size={18} className="text-amber-600 shrink-0 mt-0.5" />
                <p className="text-[10px] text-amber-800 font-black uppercase leading-tight tracking-tight">
                  Acesso de Proprietário Identificado.
                </p>
             </div>
          )}

          <AnimatePresence>
            {errorMsg && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl flex items-start gap-3 text-left text-red-600"
              >
                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                <p className="text-[11px] font-bold">{errorMsg}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={checkAccessAndLogin} className="space-y-6">
            <div className="relative">
              <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-[#2C3E50]/20" size={18} />
              <input 
                required
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="E-mail da sua compra"
                className="w-full pl-14 pr-6 py-5 bg-[#FDFCF8] rounded-[1.5rem] outline-none focus:ring-2 focus:ring-[#C2A385]/30 transition-all border border-gray-100 text-sm font-medium"
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
                  <span>{email.toLowerCase().trim() === 'yurirechcerri@gmail.com' ? 'Entrar como Admin' : 'Acessar Jornada'}</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-gray-50 flex flex-col items-center gap-4">
            <div className="flex items-center gap-2 text-[#2C3E50]/30">
              <ShieldCheck size={14} />
              <span className="text-[9px] font-bold uppercase tracking-widest">Acesso Seguro Cakto</span>
            </div>
            <a 
              href="https://cakto.com.br" 
              target="_blank" 
              className="text-[10px] font-black text-[#C2A385] uppercase tracking-[0.1em] hover:underline"
            >
              Dúvidas com seu acesso?
            </a>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
