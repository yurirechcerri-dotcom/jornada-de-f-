
import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useSpring, useTransform } from 'framer-motion';
import { Lock, ArrowLeft, X, Trophy, Check, Star, ChevronRight, Wind, BookOpen, Sun, Sparkles, MessageCircle } from 'lucide-react';
import { contentService } from '../services/contentService';
import { trackingService } from '../services/trackingService';
import { ContentItem, UserTracking } from '../types';

const JourneyDetail: React.FC = () => {
  const { type: journeyId } = useParams<{ type: string }>();
  const navigate = useNavigate();
  const [content, setContent] = useState<ContentItem[]>([]);
  const [completions, setCompletions] = useState<UserTracking[]>([]);
  const [selectedDay, setSelectedDay] = useState<ContentItem | null>(null);
  const [activeStep, setActiveStep] = useState(0); // 0 a 4 (5 passos do devocional)
  const [loading, setLoading] = useState(true);
  const [isCelebrating, setIsCelebrating] = useState(false);
  const [taskChecked, setTaskChecked] = useState(false);

  const userData = JSON.parse(localStorage.getItem('user_data') || '{}');
  const userId = userData.id || userData.email;

  const springProgress = useSpring(0, { stiffness: 60, damping: 20 });
  const widthTransform = useTransform(springProgress, (v: number) => `${v}%`);
  const leftTransform = useTransform(springProgress, (v: number) => `${v}%`);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      if (!journeyId || !userId) return;
      try {
        const items = await contentService.getJourneyContent(journeyId);
        const done = await trackingService.getCompletions(userId);
        if (isMounted) {
          setContent(items);
          setCompletions(done);
          setLoading(false);
        }
      } catch (e) {
        if (isMounted) setLoading(false);
      }
    };
    load();
    return () => { isMounted = false; };
  }, [journeyId, userId]);

  useEffect(() => {
    if (!loading && content.length > 0) {
      const doneCount = content.filter(item => completions.some(c => c.content_id === item.id)).length;
      const percentage = (doneCount / content.length) * 100;
      springProgress.set(percentage);
    }
  }, [completions, content, loading, springProgress]);
  
  const theme = useMemo(() => {
    const themes: Record<string, { title: string, color: string, accent: string }> = {
      'gratitude_7': { title: 'Gratidão', color: 'from-[#D4AF37] to-[#B19274]', accent: '#D4AF37' },
      'pardon_7': { title: 'Perdão', color: 'from-[#8A9A5B] to-[#556B2F]', accent: '#8A9A5B' },
      'patience_7': { title: 'Paciência', color: 'from-[#9B59B6] to-[#8E44AD]', accent: '#9B59B6' },
      'hope_7': { title: 'Esperança', color: 'from-[#3498DB] to-[#2980B9]', accent: '#3498DB' },
      'service_7': { title: 'Serviço', color: 'from-[#4A69BD] to-[#1E3799]', accent: '#4A69BD' },
      'adversity_21': { title: 'Fé na Adversidade', color: 'from-[#34495E] to-[#2C3E50]', accent: '#34495E' },
      'proposito_21': { title: 'Propósito', color: 'from-[#E67E22] to-[#D35400]', accent: '#E67E22' },
    };
    return themes[journeyId || ''] || { title: 'Jornada', color: 'from-[#C2A385] to-[#B19274]', accent: '#C2A385' };
  }, [journeyId]);

  const handleOpenDay = (day: ContentItem) => {
    setSelectedDay(day);
    setActiveStep(0);
    const alreadyDone = completions.some(c => c.content_id === day.id);
    setTaskChecked(alreadyDone);
  };

  const nextStep = () => setActiveStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setActiveStep(prev => Math.max(prev - 1, 0));

  const handleComplete = async (contentId: string) => {
    if (!userId) return;
    setIsCelebrating(true);
    await trackingService.completeDay(userId, contentId);
    const done = await trackingService.getCompletions(userId);
    setCompletions(done);
    setTimeout(() => {
      setIsCelebrating(false);
      setSelectedDay(null);
    }, 2000);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 space-y-4">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-[#C2A385]"></div>
        <p className="text-[#C2A385] text-xs font-bold uppercase tracking-widest">Preparando seu Devocional...</p>
      </div>
    );
  }

  const completedCount = content.filter(item => completions.some(c => c.content_id === item.id)).length;
  const progressPercentage = content.length > 0 ? (completedCount / content.length) * 100 : 0;

  return (
    <div className="space-y-6">
      <header className="flex items-center gap-4">
        <button onClick={() => navigate('/journey')} className="p-2 hover:bg-[#C2A385]/10 rounded-full transition-colors text-[#2C3E50]/40">
          <ArrowLeft size={24} />
        </button>
        <h1 className="font-serif text-3xl text-[#2C3E50]">{theme.title}</h1>
      </header>

      <div className="bg-white p-8 rounded-[3rem] border border-[#C2A385]/10 shadow-xl space-y-6 relative overflow-hidden">
        <div className="flex justify-between items-end relative z-10">
          <div className="space-y-1">
            <span className="text-[#C2A385] text-[10px] font-black uppercase tracking-[0.4em]">Caminhada Realizada</span>
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-5xl text-[#2C3E50]">{completedCount}</span>
              <span className="text-xl text-[#2C3E50]/20 font-serif italic">de {content.length} devocionais</span>
            </div>
          </div>
          <div className="text-right">
            <div className="font-serif text-4xl text-[#C2A385] leading-none mb-1">{Math.round(progressPercentage)}%</div>
          </div>
        </div>

        <div className="relative h-4 w-full bg-[#FDFCF8] rounded-full overflow-hidden border border-[#C2A385]/5">
          <motion.div style={{ width: widthTransform }} className={`absolute top-0 left-0 h-full bg-gradient-to-r ${theme.color}`} />
          <motion.div style={{ left: leftTransform }} className="absolute top-1/2 -translate-y-1/2 -ml-2">
             <Star size={12} fill={theme.accent} className="text-white shadow-sm" />
          </motion.div>
        </div>
      </div>

      <div className="space-y-4 pt-2">
        {content.map((item, idx) => {
          const done = completions.some(c => c.content_id === item.id);
          const locked = item.day_number > 1 && !completions.some(c => c.content_id === content[idx-1]?.id);
          return (
            <motion.div
              key={item.id}
              whileTap={!locked ? { scale: 0.97 } : {}}
              onClick={() => !locked && handleOpenDay(item)}
              className={`p-6 rounded-[2.5rem] border-2 transition-all cursor-pointer flex items-center justify-between relative overflow-hidden ${
                locked ? 'opacity-30 grayscale bg-gray-50 border-transparent' : 
                done ? 'bg-white border-[#C2A385]/10 shadow-sm' : `bg-white border-[#C2A385]/40 shadow-xl`
              }`}
            >
              <div className="flex items-center gap-5">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-serif text-2xl ${
                  done ? `bg-gradient-to-br ${theme.color} text-white` : `bg-[#FDFCF8] text-[#C2A385] border border-[#C2A385]/20`
                }`}>
                  {done ? <Check size={24} strokeWidth={3} /> : item.day_number}
                </div>
                <div>
                  <h4 className="font-serif text-xl text-[#2C3E50]">{item.title}</h4>
                  <p className="text-[9px] font-bold uppercase tracking-widest text-[#C2A385]">
                    {done ? 'Semente Plantada' : locked ? 'Aguardando' : 'Novo Devocional'}
                  </p>
                </div>
              </div>
              {!locked && !done && <Sparkles size={20} className="text-[#C2A385]/20" />}
              {locked && <Lock size={20} className="text-[#2C3E50]/20" />}
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {selectedDay && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center bg-[#2C3E50]/90 backdrop-blur-xl p-4">
            <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }} className="bg-[#FDFCF8] w-full max-w-sm rounded-[4rem] p-10 max-h-[90vh] overflow-y-auto relative shadow-2xl space-y-10">
              
              {/* Barra de progresso do devocional */}
              <div className="absolute top-0 left-0 right-0 p-1 bg-[#2C3E50]/5 flex gap-1">
                {[0,1,2,3,4].map(s => (
                  <div key={s} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${activeStep >= s ? `bg-[#C2A385]` : 'bg-gray-100'}`} />
                ))}
              </div>

              <button onClick={() => setSelectedDay(null)} className="absolute top-6 right-8 p-3 bg-white/50 rounded-full text-[#2C3E50]/40"><X size={20} /></button>
              
              {isCelebrating ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-6 text-center">
                  <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ repeat: Infinity, duration: 1 }}>
                    <Trophy size={80} className="text-[#C2A385]" />
                  </motion.div>
                  <h3 className="font-serif text-5xl text-[#2C3E50]">Amém!</h3>
                  <p className="text-[#C2A385] text-xs font-bold uppercase tracking-widest">Semente Registrada no Coração</p>
                </div>
              ) : (
                <div className="space-y-10 min-h-[400px] flex flex-col">
                  
                  <AnimatePresence mode="wait">
                    {/* PASSO 1: Oração Inicial */}
                    {activeStep === 0 && (
                      <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8 flex-1 flex flex-col justify-center">
                        <div className="flex flex-col items-center gap-4 text-center">
                          <Wind size={40} className="text-[#C2A385] opacity-40 animate-pulse" />
                          <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#C2A385]">Passo 1: Preparação</h2>
                          <h3 className="font-serif text-3xl text-[#2C3E50]">Aquiete seu Coração</h3>
                        </div>
                        <p className="font-serif text-2xl text-[#2C3E50]/80 italic leading-relaxed text-center">"{selectedDay.initial_prayer}"</p>
                      </motion.div>
                    )}

                    {/* PASSO 2: Leitura Bíblica */}
                    {activeStep === 1 && (
                      <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8 flex-1 flex flex-col justify-center">
                        <div className="flex flex-col items-center gap-4 text-center">
                          <BookOpen size={40} className="text-[#C2A385] opacity-40" />
                          <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#C2A385]">Passo 2: A Palavra</h2>
                        </div>
                        <div className="bg-white p-10 rounded-[3rem] border border-[#C2A385]/10 shadow-sm text-center">
                          <p className="font-serif text-3xl italic text-[#2C3E50]">"{selectedDay.verse}"</p>
                          <p className="text-[10px] font-black text-[#C2A385] uppercase tracking-widest mt-6">— {selectedDay.reference}</p>
                        </div>
                      </motion.div>
                    )}

                    {/* PASSO 3: Meditação */}
                    {activeStep === 2 && (
                      <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8 flex-1 flex flex-col justify-center">
                        <div className="flex flex-col items-center gap-4 text-center">
                          <Sun size={40} className="text-[#C2A385] opacity-40" />
                          <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#C2A385]">Passo 3: Meditação</h2>
                          <h3 className="font-serif text-2xl text-[#2C3E50]">{selectedDay.title}</h3>
                        </div>
                        <p className="text-[#2C3E50]/80 font-serif text-xl leading-relaxed italic text-center">{selectedDay.reflection}</p>
                      </motion.div>
                    )}

                    {/* PASSO 4: Ação Prática */}
                    {activeStep === 3 && (
                      <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8 flex-1 flex flex-col justify-center">
                        <div className="flex flex-col items-center gap-4 text-center">
                          <Sparkles size={40} className="text-[#C2A385] opacity-40" />
                          <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#C2A385]">Passo 4: Ação Prática</h2>
                        </div>
                        <button 
                          onClick={() => setTaskChecked(!taskChecked)}
                          className={`w-full flex items-center gap-6 p-8 rounded-[3rem] border-2 transition-all ${taskChecked ? 'bg-[#C2A385]/5 border-[#C2A385]' : 'bg-white border-dashed border-[#C2A385]/20'}`}
                        >
                          <div className={`shrink-0 w-10 h-10 rounded-2xl border-2 flex items-center justify-center ${taskChecked ? 'bg-[#C2A385] text-white' : 'border-gray-200'}`}>
                            {taskChecked && <Check size={20} strokeWidth={3} />}
                          </div>
                          <p className="text-sm font-bold text-left text-[#2C3E50]">{selectedDay.task_json?.task}</p>
                        </button>
                      </motion.div>
                    )}

                    {/* PASSO 5: Oração Final */}
                    {activeStep === 4 && (
                      <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-8 flex-1 flex flex-col justify-center">
                        <div className="flex flex-col items-center gap-4 text-center">
                          <MessageCircle size={40} className="text-[#C2A385] opacity-40" />
                          <h2 className="text-[10px] font-black uppercase tracking-[0.4em] text-[#C2A385]">Passo 5: Oração Final</h2>
                        </div>
                        <p className="font-serif text-2xl text-[#2C3E50]/80 italic leading-relaxed text-center">"{selectedDay.prayer}"</p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="pt-6 flex gap-3">
                    {activeStep > 0 && (
                      <button onClick={prevStep} className="p-5 border border-[#C2A385]/20 text-[#C2A385] rounded-3xl active:scale-95 transition-all">
                        <ArrowLeft size={24} />
                      </button>
                    )}
                    
                    {activeStep < 4 ? (
                      <button 
                        onClick={nextStep} 
                        className="flex-1 py-5 bg-[#C2A385] text-white rounded-[2rem] font-black uppercase tracking-[0.2em] text-[11px] shadow-lg flex items-center justify-center gap-3 active:scale-95 transition-all"
                      >
                        Próximo <ChevronRight size={18} />
                      </button>
                    ) : (
                      <button 
                        disabled={!taskChecked}
                        onClick={() => handleComplete(selectedDay.id)} 
                        className={`flex-1 py-5 rounded-[2rem] font-black uppercase tracking-[0.2em] text-[11px] shadow-2xl flex items-center justify-center gap-3 active:scale-95 transition-all ${taskChecked ? 'bg-[#2C3E50] text-white' : 'bg-gray-100 text-gray-300'}`}
                      >
                        <Check size={18} /> Concluir Devocional
                      </button>
                    )}
                  </div>

                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default JourneyDetail;
