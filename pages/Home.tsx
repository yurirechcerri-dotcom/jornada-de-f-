
import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { trackingService } from '../services/trackingService';
import { getVerseOfTheDay } from '../services/verseService';
import { inspirationService } from '../services/inspirationService';
import { Play, Image as ImageIcon, BookOpen, ChevronRight, Sparkles, Sun, Flame } from 'lucide-react';
import OptimizedImage from '../components/OptimizedImage';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [completions, setCompletions] = useState([]);
  const [selectedMedia, setSelectedMedia] = useState(null);
  
  const dailyVerse = useMemo(() => getVerseOfTheDay(), []);
  const readingPlans = useMemo(() => inspirationService.getReadingPlans(), []);
  const media = useMemo(() => inspirationService.getMedia(), []);
  const userData = useMemo(() => JSON.parse(localStorage.getItem('user_data') || '{}'), []);
  const userId = userData.id || userData.email;

  useEffect(() => {
    if (!userId) return;
    trackingService.getCompletions(userId).then(setCompletions).catch(console.error);
  }, [userId]);

  return (
    <div className="space-y-10 pb-40">
      <header className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-[#C2A385] text-xs font-bold uppercase tracking-[0.2em]">Paz seja convosco, {userData.display_name?.split(' ')[0] || 'Viajante'}</p>
          <h1 className="font-serif text-3xl text-[#2C3E50]">Jornada de Fé</h1>
        </div>
        <div className="bg-white border border-[#C2A385]/20 px-4 py-2 rounded-2xl flex items-center gap-2 shadow-sm">
          <Flame size={14} className="text-[#C2A385]" fill="currentColor" />
          <span className="text-xs font-black text-[#2C3E50]">{completions.length}</span>
        </div>
      </header>

      <motion.section 
        whileTap={{ scale: 0.98 }}
        onClick={() => navigate('/prayer')}
        className="relative cursor-pointer"
      >
        <div className="bg-[#C2A385] p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden">
          <div className="relative z-10 space-y-6">
            <div className="flex justify-between items-center opacity-60">
              <span className="text-[10px] font-black uppercase tracking-[0.4em]">Semente Diária</span>
              <Sparkles size={16} />
            </div>
            <p className="font-serif text-3xl italic leading-tight">"{dailyVerse.text}"</p>
            <span className="text-xs font-serif italic opacity-80">— {dailyVerse.reference}</span>
          </div>
        </div>
      </motion.section>

      <section onClick={() => navigate('/morning')} className="bg-white p-6 rounded-[2.5rem] border border-[#C2A385]/10 shadow-sm flex items-center justify-between cursor-pointer active:scale-[0.98] transition-all">
        <div className="flex items-center gap-5">
          <div className="w-14 h-14 bg-[#FDFCF8] rounded-2xl flex items-center justify-center text-[#C2A385] border border-[#C2A385]/10"><Sun size={24} /></div>
          <div><h3 className="font-serif text-xl text-[#2C3E50]">Ritual Matinal</h3><p className="text-[9px] font-bold text-[#C2A385] uppercase tracking-widest">Foco e conexão</p></div>
        </div>
        <ChevronRight size={18} className="text-gray-300" />
      </section>

      <section className="space-y-5">
        <h2 className="font-serif text-2xl text-[#2C3E50] flex items-center gap-2"><BookOpen size={20} className="text-[#C2A385]" /> Planos de Leitura</h2>
        <div className="flex gap-5 overflow-x-auto pb-4 no-scrollbar -mx-2 px-2">
          {readingPlans.map((plan) => (
            <div key={plan.id} onClick={() => navigate('/journey')} className="min-w-[220px] bg-white rounded-[2.5rem] border border-[#C2A385]/10 p-4 shadow-sm space-y-4 cursor-pointer">
              <OptimizedImage src={plan.image} alt={plan.title} className="h-32 rounded-[2rem]" />
              <h4 className="font-serif text-lg text-[#2C3E50] truncate px-1">{plan.title}</h4>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-5">
        <h2 className="font-serif text-2xl text-[#2C3E50] flex items-center gap-2"><ImageIcon size={20} className="text-[#C2A385]" /> Galeria Inspiradora</h2>
        <div className="grid grid-cols-2 gap-4">
          {media.map((item) => (
            <motion.div key={item.id} whileTap={{ scale: 0.95 }} onClick={() => setSelectedMedia(item)} className="relative aspect-[3/4] rounded-[2.5rem] overflow-hidden shadow-md cursor-pointer">
              <OptimizedImage src={item.url} alt={item.title} className="w-full h-full" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5"><h5 className="text-white text-[10px] font-bold uppercase tracking-tight">{item.title}</h5></div>
            </motion.div>
          ))}
        </div>
      </section>

      <AnimatePresence>
        {selectedMedia && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-[#2C3E50]/90 backdrop-blur-xl flex items-center justify-center p-6" onClick={() => setSelectedMedia(null)}>
            <div className="w-full max-w-sm aspect-[3/4] rounded-[3rem] overflow-hidden bg-white relative">
              <OptimizedImage src={selectedMedia.url} alt={selectedMedia.title} className="w-full h-full" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-10">
                <h3 className="text-white font-serif text-3xl">{selectedMedia.title}</h3>
                <p className="text-white/70 italic text-sm mt-2">"{selectedMedia.verse}"</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Home;
