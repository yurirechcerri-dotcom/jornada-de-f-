
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Timer, Check, ChevronDown } from 'lucide-react';
import { trackingService } from '../services/trackingService';
import AppLogo from '../components/AppLogo';

const steps = [
  { id: 'focus', title: 'Silêncio e Foco', desc: 'Respire fundo. Dedique 2 minutos apenas para estar na presença.' },
  { id: 'verse', title: 'Palavra do Dia', desc: '"Elevo os meus olhos para os montes; de onde virá o meu socorro? O meu socorro vem do Senhor, que fez os céus e a terra." — Salmo 121:1-2' },
  { id: 'prayer', title: 'Oração Matinal', desc: 'Fale com Deus como um amigo. Agradeça pelo novo dia e entregue suas preocupações.' },
  { id: 'intention', title: 'Intenção do Dia', desc: 'Qual é o seu foco espiritual para hoje? Escreva sua intenção.' }
];

const MorningRitual: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [intention, setIntention] = useState('');
  const [timeLeft, setTimeLeft] = useState(120);
  const [isTimerActive, setIsTimerActive] = useState(false);

  useEffect(() => {
    let interval: any;
    if (isTimerActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0) {
      setIsTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [isTimerActive, timeLeft]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleFinish = async () => {
    const mockUserId = "user-123";
    await trackingService.completeDay(mockUserId, 'morning-ritual-daily', intention);
    alert("Ritual concluído! Tenha um dia abençoado.");
    window.location.hash = "#/";
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="h-full flex flex-col justify-center items-center text-center space-y-12 py-10">
      <AppLogo size="sm" />
      
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-xs space-y-8"
        >
          <header className="space-y-2">
            <span className="text-[#C2A385] text-xs font-bold uppercase tracking-[0.3em]">Passo {currentStep + 1} de {steps.length}</span>
            <h2 className="font-serif text-4xl text-[#2C3E50]">{steps[currentStep].title}</h2>
          </header>

          <div className="min-h-[160px] flex items-center justify-center">
            {currentStep === 0 ? (
              <div className="space-y-6">
                <p className="text-[#2C3E50]/70 italic leading-relaxed">{steps[currentStep].desc}</p>
                <div className="flex flex-col items-center gap-4">
                  <div className="text-5xl font-serif text-[#C2A385]">{formatTime(timeLeft)}</div>
                  <button 
                    onClick={() => setIsTimerActive(!isTimerActive)}
                    className="flex items-center gap-2 px-6 py-2 rounded-full border border-[#C2A385] text-[#C2A385] font-semibold text-xs uppercase tracking-widest hover:bg-[#C2A385] hover:text-white transition-all"
                  >
                    <Timer size={16} />
                    {isTimerActive ? 'Pausar' : timeLeft === 120 ? 'Iniciar' : 'Retomar'}
                  </button>
                </div>
              </div>
            ) : currentStep === 3 ? (
              <div className="space-y-6 w-full">
                <p className="text-[#2C3E50]/70 italic leading-relaxed">{steps[currentStep].desc}</p>
                <textarea
                  value={intention}
                  onChange={(e) => setIntention(e.target.value)}
                  placeholder="Minha intenção é..."
                  className="w-full bg-white border border-[#C2A385]/20 p-4 rounded-2xl focus:ring-2 focus:ring-[#C2A385] outline-none text-[#2C3E50] min-h-[120px]"
                />
              </div>
            ) : (
              <p className="text-[#2C3E50] text-lg font-serif italic leading-loose">
                {steps[currentStep].desc}
              </p>
            )}
          </div>

          <div className="pt-8 flex flex-col items-center gap-4">
            {currentStep < steps.length - 1 ? (
              <button 
                onClick={handleNext}
                className="w-16 h-16 rounded-full bg-[#C2A385] text-white flex items-center justify-center shadow-lg shadow-[#C2A385]/20 active:scale-90 transition-transform"
              >
                <ChevronDown size={32} />
              </button>
            ) : (
              <button 
                onClick={handleFinish}
                className="px-10 py-5 bg-[#2C3E50] text-white rounded-2xl font-bold uppercase tracking-[0.2em] text-sm shadow-xl active:scale-95 transition-all flex items-center gap-3"
              >
                <Check size={20} />
                Finalizar
              </button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default MorningRitual;
