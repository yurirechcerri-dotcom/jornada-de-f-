
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle2, Sparkles, Smartphone, Bell, Heart, ArrowRight, Mail } from 'lucide-react';
import AppLogo from '../components/AppLogo';

const ThankYou: React.FC = () => {
  const navigate = useNavigate();

  const steps = [
    { icon: Mail, title: 'Use seu e-mail', desc: 'Acesse usando o mesmo e-mail que você usou na compra da Cakto.' },
    { icon: Smartphone, title: 'Instale o App', desc: 'Siga o guia interno para ter a Jornada no seu menu de aplicativos.' },
    { icon: Bell, title: 'Ative Avisos', desc: 'Não perca suas sementes diárias e lembretes de oração.' },
  ];

  return (
    <div className="min-h-screen bg-[#FDFCF8] flex flex-col items-center justify-center p-6 pb-24">
      <div className="max-w-md w-full space-y-8 text-center">
        
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="relative inline-block"
        >
          <div className="bg-green-100 w-24 h-24 rounded-full flex items-center justify-center mx-auto text-green-600 shadow-inner">
            <CheckCircle2 size={48} />
          </div>
          <motion.div 
            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute inset-0 bg-green-200 rounded-full -z-10"
          />
        </motion.div>

        <header className="space-y-3">
          <AppLogo size="lg" />
          <h1 className="font-serif text-4xl text-[#2C3E50] mt-6">Sua Jornada Começa Agora!</h1>
          <div className="inline-block bg-[#C2A385]/10 px-4 py-1.5 rounded-full">
            <p className="text-[#C2A385] font-black uppercase tracking-widest text-[10px]">Pagamento Confirmado via Cakto</p>
          </div>
        </header>

        <div className="bg-white p-8 rounded-[3.5rem] border border-[#C2A385]/10 shadow-2xl space-y-8 text-left relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-[#C2A385]/5 to-transparent rounded-full -mr-16 -mt-16" />
          
          <div className="space-y-2">
            <h3 className="font-serif text-2xl text-[#2C3E50]">Próximos Passos:</h3>
            <p className="text-xs text-[#2C3E50]/40 font-medium leading-relaxed">
              Siga estas instruções para garantir que seu progresso seja salvo corretamente.
            </p>
          </div>

          <div className="space-y-6">
            {steps.map((step, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + idx * 0.1 }}
                className="flex gap-5"
              >
                <div className="bg-[#FDFCF8] p-3 rounded-2xl h-fit border border-[#C2A385]/10 shadow-sm">
                  <step.icon size={20} className="text-[#C2A385]" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-black text-[#2C3E50] uppercase tracking-wider">{step.title}</h4>
                  <p className="text-[11px] text-[#2C3E50]/50 font-medium leading-normal">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="bg-amber-50 p-5 rounded-2xl border border-amber-100/50">
            <p className="text-[10px] text-amber-800 font-bold leading-relaxed">
              <span className="uppercase text-amber-900 mr-1">Atenção:</span> 
              Se você usar um e-mail diferente do e-mail da compra, seu acesso vitalício poderá não ser reconhecido automaticamente.
            </p>
          </div>
        </div>

        <div className="space-y-4 pt-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/')}
            className="w-full py-6 bg-[#2C3E50] text-white rounded-[2.5rem] font-bold uppercase tracking-[0.2em] text-[11px] shadow-2xl flex items-center justify-center gap-4 relative overflow-hidden group"
          >
            <span className="relative z-10">Entrar no Aplicativo</span>
            <ArrowRight size={18} className="relative z-10 group-hover:translate-x-1 transition-transform" />
            <motion.div 
              animate={{ x: ['-100%', '200%'] }}
              transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
              className="absolute inset-y-0 w-32 bg-white/5 skew-x-12"
            />
          </motion.button>
          
          <p className="text-[9px] text-[#2C3E50]/30 font-bold uppercase tracking-widest">
            O acesso foi enviado também para o seu e-mail.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ThankYou;
