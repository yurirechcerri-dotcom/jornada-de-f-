import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useSpring, useTransform } from 'framer-motion';
import { Lock, ArrowLeft, X, Trophy, Check, Star } from 'lucide-react';
import { contentService } from '../services/contentService';
import { trackingService } from '../services/trackingService';
import { ContentItem, UserTracking } from '../types';

const JourneyDetail: React.FC = () => {
  const { type: journeyId } = useParams<{ type: string }>();
  const navigate = useNavigate();
  const [content, setContent] = useState<ContentItem[]>([]);
  const [completions, setCompletions] = useState<UserTracking[]>([]);
  const [selectedDay, setSelectedDay] = useState<ContentItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [isCelebrating, setIsCelebrating] = useState(false);
  const [taskChecked, setTaskChecked] = useState(false);

  const mockUserId = "user-123";

  // Hooks de animação devem estar no TOPO absoluto e SEMPRE rodar antes de qualquer 'if'
  const springProgress = useSpring(0, { stiffness: 60, damping: 20 });
  const widthTransform = useTransform(springProgress, (v: number) => `${v}%`);
  const leftTransform = useTransform(springProgress, (v: number) => `${v}%`);

  useEffect(() => {
    let isMounted = true;
    const load = async () => {
      if (!journeyId) return;
      
      try {
        const items = await contentService.getJourneyContent(journeyId);
        const done = await trackingService.getCompletions(mockUserId);
        
        if (isMounted) {
          setContent(items);
          setCompletions(done);
          setLoading(false);
        }
      } catch (e) {
        console.error("Erro ao carregar jornada", e);
        if (isMounted) setLoading(false);
      }
    };
    load();
    return () => { isMounted = false; };
  }, [journeyId]);

  // Sincroniza o progresso visual sempre que os dados mudam
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
    const alreadyDone = completions.some(c => c.content_id === day.id);
    setTaskChecked(alreadyDone);
  };

  const handleComplete = async (contentId: string) => {
    if (!taskChecked) return;
    setIsCelebrating(true);
    await trackingService.completeDay(mockUserId, contentId);
    const done = await trackingService.getCompletions(mockUserId);
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
        <p className="text-[#C2A385] text-xs font-bold uppercase tracking-widest">Preparando sua Caminhada...</p>
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
            <span className="text-[#C2A385] text-[10px] font-black uppercase tracking-[0.4em]">Progresso Vital</span>
            <div className="flex items-baseline gap-2">
              <span className="font-serif text-5xl text-[#2C3E50]">{completedCount}</span>
              <span className="text-xl text-[#2C3E50]/20 font-serif italic">de {content.length} dias</span>
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
                    {done ? 'Semente Plantada' : locked ? 'Aguardando' : 'Próximo Passo'}
                  </p>
                </div>
              </div>
              {!locked && !done && <Star size={24} className="text-[#C2A385]/20" />}
              {locked && <Lock size={20} className="text-[#2C3E50]/20" />}
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {selectedDay && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center bg-[#2C3E50]/80 backdrop-blur-xl p-4">
            <motion.div initial={{ y: 100, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 100, opacity: 0 }} className="bg-[#FDFCF8] w-full max-w-sm rounded-[3.5rem] p-8 max-h-[90vh] overflow-y-auto relative shadow-2xl">
              <button onClick={() => setSelectedDay(null)} className="absolute top-8 right-8 p-3 bg-white/50 rounded-full text-[#2C3E50]/40"><X size={20} /></button>
              {isCelebrating ? (
                <div className="flex flex-col items-center justify-center py-20 space-y-6 text-center">
                  <Trophy size={80} className="text-[#C2A385]" />
                  <h3 className="font-serif text-5xl text-[#2C3E50]">Glória!</h3>
                </div>
              ) : (
                <div className="space-y-10">
                  <div className="text-center pt-4"><h2 className="font-serif text-4xl text-[#2C3E50]">{selectedDay.title}</h2></div>
                  <div className="bg-white p-10 rounded-[3rem] border border-[#C2A385]/10 text-center">
                    <p className="font-serif text-2xl italic text-[#2C3E50]">"{selectedDay.verse}"</p>
                    <p className="text-[10px] font-black text-[#C2A385] uppercase tracking-widest mt-4">{selectedDay.reference}</p>
                  </div>
                  <div className="space-y-6">
                    <p className="text-[#2C3E50]/80 font-serif text-xl leading-relaxed italic">{selectedDay.reflection}</p>
                    <button 
                      onClick={() => setTaskChecked(!taskChecked)}
                      className={`w-full flex items-center gap-6 p-6 rounded-[2.5rem] border-2 transition-all ${taskChecked ? 'bg-green-50 border-green-200' : 'bg-white border-dashed border-[#C2A385]/20'}`}
                    >
                      <div className={`shrink-0 w-8 h-8 rounded-xl border-2 flex items-center justify-center ${taskChecked ? 'bg-green-500 text-white' : 'border-gray-200'}`}>
                        {taskChecked && <Check size={18} strokeWidth={3} />}
                      </div>
                      <p className="text-sm font-bold text-left">{selectedDay.task_json?.task}</p>
                    </button>
                    {!completions.some(c => c.content_id === selectedDay.id) && (
                      <button disabled={!taskChecked} onClick={() => handleComplete(selectedDay.id)} className={`w-full py-6 rounded-[2.5rem] font-black uppercase text-[11px] ${taskChecked ? 'bg-[#2C3E50] text-white shadow-2xl' : 'bg-gray-100 text-gray-300'}`}>
                        Sincronizar com o Pai
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