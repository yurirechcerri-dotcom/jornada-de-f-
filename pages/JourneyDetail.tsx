
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useSpring, useTransform } from 'framer-motion';
import { Lock, ArrowLeft, X, Trophy, Check, Sparkles, Star } from 'lucide-react';
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

  useEffect(() => {
    const load = async () => {
      if (journeyId) {
        try {
          const items = await contentService.getJourneyContent(journeyId);
          const done = await trackingService.getCompletions(mockUserId);
          setContent(items);
          setCompletions(done);
        } catch (e) {
          console.error("Erro ao carregar jornada", e);
        } finally {
          setLoading(false);
        }
      }
    };
    load();
  }, [journeyId]);

  const isCompleted = (contentId: string) => completions.some(c => c.content_id === contentId);
  
  const handleOpenDay = (day: ContentItem) => {
    setSelectedDay(day);
    setTaskChecked(isCompleted(day.id));
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

  const getJourneyTheme = () => {
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
  };

  const theme = getJourneyTheme();
  const completedCount = content.filter(item => isCompleted(item.id)).length;
  const totalCount = content.length;
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  // Spring animation for the progress bar
  const springProgress = useSpring(0, { stiffness: 60, damping: 20 });
  useEffect(() => {
    springProgress.set(progressPercentage);
  }, [progressPercentage, springProgress]);

  if (loading) return <div className="flex justify-center py-20"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#C2A385]"></div></div>;

  return (
    <div className="space-y-6">
      <header className="flex items-center gap-4">
        <button onClick={() => navigate('/journey')} className="p-2 hover:bg-[#C2A385]/10 rounded-full transition-colors text-[#2C3E50]/40">
          <ArrowLeft size={24} />
        </button>
        <h1 className="font-serif text-3xl text-[#2C3E50]">
          {theme.title}
        </h1>
      </header>

      {/* Progresso Card Ultra Refinado */}
      <div className="bg-white p-8 rounded-[3rem] border border-[#C2A385]/10 shadow-xl space-y-6 relative overflow-hidden group">
        <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br ${theme.color} opacity-[0.03] rounded-full -mr-32 -mt-32 blur-3xl`} />
        
        <div className="flex justify-between items-end relative z-10">
          <div className="space-y-1">
            <span className="text-[#C2A385] text-[10px] font-black uppercase tracking-[0.4em]">Progresso Vital</span>
            <div className="flex items-baseline gap-2">
              <motion.span 
                key={completedCount}
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                className="font-serif text-5xl text-[#2C3E50]"
              >
                {completedCount}
              </motion.span>
              <span className="text-xl text-[#2C3E50]/20 font-serif italic">de {totalCount} dias</span>
            </div>
          </div>
          
          <div className="text-right">
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 4 }}
              className="font-serif text-4xl text-[#C2A385] leading-none mb-1"
            >
              {Math.round(progressPercentage)}%
            </motion.div>
            <div className="flex items-center gap-1 justify-end">
               <div className="w-1 h-1 rounded-full bg-green-400 animate-pulse" />
               <span className="text-[8px] font-black text-[#C2A385]/40 uppercase tracking-[0.2em]">Caminhada Ativa</span>
            </div>
          </div>
        </div>

        {/* Barra de Progresso Fluida */}
        <div className="relative h-4 w-full bg-[#FDFCF8] rounded-full overflow-hidden shadow-inner border border-[#C2A385]/5">
          <motion.div 
            style={{ width: useTransform(springProgress, (v) => `${v}%`) }}
            className={`absolute top-0 left-0 h-full bg-gradient-to-r ${theme.color} relative overflow-hidden rounded-full shadow-lg shadow-[#C2A385]/20`}
          >
            {/* Efeito Liquid/Wave */}
            <motion.div 
              animate={{ x: ['-100%', '100%'] }}
              transition={{ repeat: Infinity, duration: 3, ease: "linear" }}
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent skew-x-[-20deg]"
            />
            
            {/* Partícula na Ponta */}
            <div className="absolute right-0 top-0 bottom-0 w-1 bg-white/50 blur-[2px]" />
          </motion.div>
          
          {/* Brilho que segue o progresso */}
          <motion.div
             style={{ left: useTransform(springProgress, (v) => `${v}%`) }}
             className="absolute top-1/2 -translate-y-1/2 -ml-2"
          >
            <motion.div
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              <Star size={12} fill={theme.accent} className="text-white shadow-sm" />
            </motion.div>
          </motion.div>
        </div>
        
        <div className="flex justify-between items-center text-[8px] font-black text-[#2C3E50]/30 uppercase tracking-[0.2em] px-1">
          <span>Início</span>
          <span>Consagração</span>
        </div>
      </div>

      {/* Timeline de Cards */}
      <div className="space-y-4 pt-2">
        {content.map((item, idx) => {
          const done = isCompleted(item.id);
          const locked = item.day_number > 1 && !isCompleted(content[idx-1]?.id);
          
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              whileTap={!locked ? { scale: 0.97 } : {}}
              transition={{ delay: idx * 0.05 }}
              onClick={() => !locked && handleOpenDay(item)}
              className={`p-6 rounded-[2.5rem] border-2 transition-all cursor-pointer flex items-center justify-between relative overflow-hidden group ${
                locked ? 'opacity-30 grayscale bg-gray-50 border-transparent' : 
                done ? 'bg-white border-[#C2A385]/10 shadow-sm' : `bg-white border-[#C2A385]/40 shadow-xl shadow-[#C2A385]/5`
              }`}
            >
              <div className="flex items-center gap-5 relative z-10">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-serif text-2xl transition-all shadow-md ${
                  done 
                    ? `bg-gradient-to-br ${theme.color} text-white` 
                    : `bg-[#FDFCF8] text-[#C2A385] border border-[#C2A385]/20 group-hover:scale-110`
                }`}>
                  {done ? <Check size={24} strokeWidth={3} /> : item.day_number}
                </div>
                <div>
                  <h4 className="font-serif text-xl text-[#2C3E50]">{item.title}</h4>
                  <div className="flex items-center gap-2">
                    <p className={`text-[9px] font-bold uppercase tracking-widest ${done ? 'text-[#C2A385]' : 'text-[#2C3E50]/40'}`}>
                      {done ? 'Semente Plantada' : locked ? 'Aguardando' : 'Próximo Passo'}
                    </p>
                    {done && <Sparkles size={10} className="text-[#C2A385]" />}
                  </div>
                </div>
              </div>

              <div className="relative z-10">
                {!locked && !done && (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
                    className="text-[#C2A385]/20"
                  >
                    <Star size={24} />
                  </motion.div>
                )}
                {locked && <Lock size={20} className="text-[#2C3E50]/20" />}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Modal - Devocional */}
      <AnimatePresence>
        {selectedDay && (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-[#2C3E50]/80 backdrop-blur-xl p-4"
          >
            <motion.div 
              initial={{ y: 100, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 100, opacity: 0 }}
              className="bg-[#FDFCF8] w-full max-w-sm rounded-[3.5rem] p-8 max-h-[90vh] overflow-y-auto relative shadow-2xl border border-white/20"
            >
              <button 
                onClick={() => setSelectedDay(null)}
                className="absolute top-8 right-8 p-3 bg-white/50 hover:bg-white rounded-full transition-colors text-[#2C3E50]/40 z-10 shadow-sm"
              >
                <X size={20} />
              </button>

              <AnimatePresence>
                {isCelebrating ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}
                    className="absolute inset-0 z-50 bg-[#FDFCF8] flex flex-col items-center justify-center p-10 text-center space-y-6"
                  >
                    <motion.div 
                      animate={{ 
                        scale: [1, 1.3, 1],
                        rotate: [0, 5, -5, 0]
                      }}
                      transition={{ repeat: Infinity, duration: 1.5 }}
                      className="bg-[#C2A385]/10 p-8 rounded-full"
                    >
                      <Trophy size={80} className="text-[#C2A385]" />
                    </motion.div>
                    <div className="space-y-2">
                      <h3 className="font-serif text-5xl text-[#2C3E50]">Glória!</h3>
                      <p className="text-[#C2A385] italic font-medium uppercase tracking-[0.2em] text-[10px]">Caminhada do Dia {selectedDay.day_number} Concluída</p>
                    </div>
                  </motion.div>
                ) : (
                  <div className="space-y-10 pb-6">
                    <div className="text-center space-y-3 pt-4">
                      <span className={`bg-gradient-to-r ${theme.color} text-white text-[9px] font-black px-6 py-2 rounded-full uppercase tracking-[0.3em] shadow-lg`}>
                        MOMENTO {selectedDay.day_number}
                      </span>
                      <h2 className="font-serif text-4xl text-[#2C3E50] leading-tight">{selectedDay.title}</h2>
                    </div>

                    <div className="bg-white p-10 rounded-[3rem] border border-[#C2A385]/10 shadow-xl text-center relative group">
                      <p className="font-serif text-3xl italic text-[#2C3E50] leading-relaxed mb-8 relative z-10">
                        "{selectedDay.verse}"
                      </p>
                      <div className="h-px w-16 bg-[#C2A385]/20 mx-auto mb-4" />
                      <p className="text-[10px] font-black text-[#C2A385] uppercase tracking-[0.4em] relative z-10">{selectedDay.reference}</p>
                    </div>

                    <div className="space-y-10">
                      <section className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-1.5 h-1.5 rounded-full bg-[#C2A385]" />
                          <h5 className="text-[10px] font-black text-[#C2A385] uppercase tracking-[0.4em]">A Palavra Revelada</h5>
                        </div>
                        <p className="text-[#2C3E50]/80 font-serif text-2xl leading-relaxed italic px-2">
                          {selectedDay.reflection}
                        </p>
                      </section>

                      <section className="bg-white p-8 rounded-[2.5rem] border border-[#C2A385]/5 shadow-inner">
                        <h5 className="text-[9px] font-black text-[#C2A385] uppercase tracking-[0.3em] mb-4 text-center">Clamor de Hoje</h5>
                        <p className="text-[#2C3E50] text-base leading-relaxed font-serif italic text-center">
                          "{selectedDay.prayer}"
                        </p>
                      </section>

                      <section className="space-y-5">
                        <h5 className="text-[10px] font-black text-[#C2A385] uppercase tracking-[0.4em]">Fé em Ação</h5>
                        <button 
                          onClick={() => setTaskChecked(!taskChecked)}
                          className={`w-full flex items-center gap-6 p-6 rounded-[2.5rem] border-2 transition-all duration-500 ${
                            taskChecked 
                              ? 'bg-green-50 border-green-200' 
                              : 'bg-white border-dashed border-[#C2A385]/20 hover:border-[#C2A385]'
                          }`}
                        >
                          <div className={`shrink-0 w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all ${
                            taskChecked ? `bg-green-500 border-transparent text-white scale-110 shadow-lg` : 'border-gray-200'
                          }`}>
                            {taskChecked && <Check size={18} strokeWidth={3} />}
                          </div>
                          <p className={`text-sm font-bold text-left leading-snug transition-colors ${taskChecked ? 'text-green-800' : 'text-[#2C3E50]/50'}`}>
                            {selectedDay.task_json?.task}
                          </p>
                        </button>
                      </section>
                    </div>

                    {!isCompleted(selectedDay.id) && (
                      <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        disabled={!taskChecked}
                        onClick={() => handleComplete(selectedDay.id)}
                        className={`w-full py-6 rounded-[2.5rem] font-black uppercase tracking-[0.3em] text-[11px] shadow-2xl transition-all relative overflow-hidden ${
                          taskChecked 
                            ? `bg-[#2C3E50] text-white` 
                            : 'bg-gray-100 text-gray-300 cursor-not-allowed'
                        }`}
                      >
                        Sincronizar com o Pai
                        {taskChecked && (
                          <motion.div 
                            animate={{ x: ['-100%', '200%'] }}
                            transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent skew-x-12"
                          />
                        )}
                      </motion.button>
                    )}
                  </div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default JourneyDetail;
