
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { trackingService } from '../services/trackingService';
import { getVerseOfTheDay, DailyVerse } from '../services/verseService';
import { inspirationService, InspiringMedia, ReadingPlan } from '../services/inspirationService';
import { Play, Image as ImageIcon, BookOpen, ChevronRight, Sparkles, Sun, Flame } from 'lucide-react';
import { UserTracking } from '../types';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [completions, setCompletions] = useState<UserTracking[]>([]);
  const [dailyVerse, setDailyVerse] = useState<DailyVerse | null>(null);
  const [motivationalMessage, setMotivationalMessage] = useState('');
  const [readingPlans, setReadingPlans] = useState<ReadingPlan[]>([]);
  const [media, setMedia] = useState<InspiringMedia[]>([]);
  const [selectedMedia, setSelectedMedia] = useState<InspiringMedia | null>(null);
  const [loadedImages, setLoadedImages] = useState<Record<string, boolean>>({});
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});
  
  const mockUserId = "user-123";

  useEffect(() => {
    const loadData = async () => {
      const tracking = await trackingService.getCompletions(mockUserId);
      setCompletions(tracking);
      setDailyVerse(getVerseOfTheDay());
      
      const messages = inspirationService.getMotivationalMessages();
      setMotivationalMessage(messages[Math.floor(Math.random() * messages.length)]);
      
      setReadingPlans(inspirationService.getReadingPlans());
      setMedia(inspirationService.getMedia());
    };
    loadData();
  }, []);

  const handleImageLoad = (id: string) => {
    setLoadedImages(prev => ({ ...prev, [id]: true }));
  };

  const handleImageError = (id: string) => {
    setFailedImages(prev => ({ ...prev, [id]: true }));
    setLoadedImages(prev => ({ ...prev, [id]: true }));
  };

  const totalPrayers = completions.length;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-10 pb-40"
    >
      <header className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-[#C2A385] text-xs font-bold uppercase tracking-[0.2em]">Paz seja convosco</p>
          <h1 className="font-serif text-3xl text-[#2C3E50]">Jornada de Fé</h1>
        </div>
        <div className="bg-white border border-[#C2A385]/20 px-4 py-2 rounded-2xl flex items-center gap-2 shadow-sm">
          <Flame size={14} className="text-[#C2A385]" fill="currentColor" />
          <span className="text-xs font-black text-[#2C3E50]">{totalPrayers}</span>
        </div>
      </header>

      <motion.section 
        whileTap={{ scale: 0.98 }}
        onClick={() => navigate('/prayer')}
        className="relative cursor-pointer group"
      >
        <div className="bg-[#C2A385] p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
          <div className="relative z-10 space-y-6">
            <div className="flex justify-between items-center opacity-60">
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">Semente Diária</span>
              <Sparkles size={16} />
            </div>
            <p className="font-serif text-3xl italic leading-tight">
              "{dailyVerse?.text}"
            </p>
            <div className="flex items-center gap-3">
              <div className="h-px w-8 bg-white/30" />
              <span className="text-xs font-serif italic opacity-80">{dailyVerse?.reference}</span>
            </div>
          </div>
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
        </div>
      </motion.section>

      <section 
        onClick={() => navigate('/morning')}
        className="bg-white p-6 rounded-[2.5rem] border border-[#C2A385]/10 shadow-sm flex items-center justify-between group cursor-pointer active:scale-[0.98] transition-all"
      >
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-[#FDFCF8] rounded-2xl flex items-center justify-center text-[#C2A385] border border-[#C2A385]/10 group-hover:bg-[#C2A385] group-hover:text-white transition-all">
            <Sun size={24} />
          </div>
          <div>
            <h3 className="font-serif text-xl text-[#2C3E50]">Ritual Matinal</h3>
            <p className="text-[9px] font-bold text-[#C2A385] uppercase tracking-widest">Foco e conexão</p>
          </div>
        </div>
        <ChevronRight size={18} className="text-gray-300 group-hover:text-[#C2A385] transition-colors" />
      </section>

      <section className="space-y-5">
        <h2 className="font-serif text-2xl text-[#2C3E50] flex items-center gap-2">
          <BookOpen size={20} className="text-[#C2A385]" />
          Planos de Leitura
        </h2>
        <div className="flex gap-5 overflow-x-auto pb-4 no-scrollbar -mx-2 px-2">
          {readingPlans.map((plan) => (
            <motion.div 
              key={plan.id} 
              whileTap={{ scale: 0.96 }}
              onClick={() => navigate('/journey')}
              className="min-w-[220px] bg-white rounded-[2.5rem] border border-[#C2A385]/10 p-4 shadow-sm space-y-4 cursor-pointer"
            >
              <div className="h-32 rounded-[2rem] overflow-hidden relative bg-[#C2A385]/5">
                {failedImages[plan.id] ? (
                  <div className="absolute inset-0 bg-gradient-to-br from-[#C2A385]/20 to-[#C2A385]/40 flex items-center justify-center">
                    <BookOpen className="text-[#C2A385]/40" size={32} />
                  </div>
                ) : (
                  <>
                    {!loadedImages[plan.id] && (
                      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 to-gray-100 animate-pulse" />
                    )}
                    <img 
                      src={plan.image} 
                      className={`w-full h-full object-cover transition-opacity duration-500 ${loadedImages[plan.id] ? 'opacity-100' : 'opacity-0'}`} 
                      alt={plan.title} 
                      onLoad={() => handleImageLoad(plan.id)}
                      onError={() => handleImageError(plan.id)}
                    />
                  </>
                )}
              </div>
              <div>
                <h4 className="font-serif text-lg text-[#2C3E50]">{plan.title}</h4>
                <div className="mt-3 flex items-center gap-3">
                  <div className="h-1 flex-1 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-[#C2A385]" style={{ width: `${plan.progress}%` }} />
                  </div>
                  <span className="text-[8px] font-black text-[#2C3E50]/40">{plan.progress}%</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="space-y-5">
        <h2 className="font-serif text-2xl text-[#2C3E50] flex items-center gap-2">
          <ImageIcon size={20} className="text-[#C2A385]" />
          Galeria Inspiradora
        </h2>
        <div className="grid grid-cols-2 gap-4">
          {media.map((item) => (
            <motion.div 
              key={item.id}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSelectedMedia(item)}
              className="relative aspect-[3/4] rounded-[2.5rem] overflow-hidden group shadow-md cursor-pointer bg-[#C2A385]/10 border border-[#C2A385]/5"
            >
              {failedImages[item.id] ? (
                <div className="absolute inset-0 bg-gradient-to-t from-[#C2A385]/40 to-[#C2A385]/10 flex items-center justify-center">
                  <ImageIcon className="text-white/40" size={24} />
                </div>
              ) : (
                <>
                  {!loadedImages[item.id] && (
                    <div className="absolute inset-0 bg-gradient-to-br from-[#C2A385]/10 to-[#C2A385]/20 animate-pulse" />
                  )}
                  <img 
                    src={item.url} 
                    className={`w-full h-full object-cover transition-all duration-700 group-hover:scale-110 ${loadedImages[item.id] ? 'opacity-100' : 'opacity-0'}`} 
                    alt={item.title}
                    onLoad={() => handleImageLoad(item.id)}
                    onError={() => handleImageError(item.id)}
                  />
                </>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-60" />
              
              <div className="absolute top-4 right-4 p-2 bg-white/20 backdrop-blur-md rounded-xl text-white">
                {item.type === 'video' ? <Play size={12} fill="currentColor" /> : <ImageIcon size={12} />}
              </div>

              <div className="absolute bottom-5 left-5 right-5 space-y-1">
                <span className="text-[8px] font-bold text-[#C2A385] uppercase tracking-widest">{item.category}</span>
                <h5 className="text-white text-[10px] font-bold uppercase tracking-tight leading-tight">{item.title}</h5>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <AnimatePresence>
        {selectedMedia && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-[#2C3E50]/90 backdrop-blur-xl flex items-center justify-center p-6"
            onClick={() => setSelectedMedia(null)}
          >
            <motion.div 
              initial={{ scale: 0.9, y: 30 }}
              animate={{ scale: 1, y: 0 }}
              className="w-full max-w-sm aspect-[3/4] rounded-[3rem] overflow-hidden shadow-2xl relative bg-white"
              onClick={(e) => e.stopPropagation()}
            >
              {failedImages[selectedMedia.id] ? (
                <div className="w-full h-full bg-gradient-to-br from-[#C2A385] to-[#B19274] flex items-center justify-center">
                   <Sparkles className="text-white/20" size={64} />
                </div>
              ) : (
                <img src={selectedMedia.url} className="w-full h-full object-cover" alt={selectedMedia.title} />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-transparent to-transparent flex flex-col justify-end p-10 space-y-4">
                <span className="text-[#C2A385] text-[10px] font-black uppercase tracking-[0.4em]">{selectedMedia.category}</span>
                <h3 className="text-white font-serif text-3xl">{selectedMedia.title}</h3>
                <p className="text-white/70 italic text-sm font-serif border-t border-white/10 pt-4">
                  "{selectedMedia.verse}"
                </p>
                <button 
                  onClick={() => setSelectedMedia(null)}
                  className="mt-6 py-4 bg-white text-[#2C3E50] rounded-2xl font-bold uppercase tracking-widest text-[10px] shadow-xl"
                >
                  Fechar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <footer className="text-center py-10 opacity-30">
        <p className="font-serif italic text-sm">"{motivationalMessage}"</p>
      </footer>
    </motion.div>
  );
};

export default Home;
