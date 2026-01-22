
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, MessageCircle, Book, X, Play, BookOpen, Wind, CheckCircle2, Sun } from 'lucide-react';
import { communityService, PrayerIntent, Testimony } from '../services/communityService';

interface ClassicPrayer {
  id: string;
  title: string;
  text: string;
  category: string;
  duration: string;
}

const classicPrayers: ClassicPrayer[] = [
  { id: 'p1', title: 'Pai Nosso', category: 'Essencial', duration: '1 min', text: 'Pai nosso, que estais nos céus, santificado seja o vosso nome...' },
  { id: 'p2', title: 'Oração de São Francisco', category: 'Paz', duration: '2 min', text: 'Senhor, fazei-me instrumento de vossa paz...' },
  { id: 'p3', title: 'Salmo 23', category: 'Confiança', duration: '1 min', text: 'O Senhor é o meu pastor, nada me faltará...' }
];

const PrayerWall: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'intentions' | 'testimonies' | 'treasury'>('intentions');
  const [intentions, setIntentions] = useState<PrayerIntent[]>([]);
  const [testimonies, setTestimonies] = useState<Testimony[]>([]);
  const [newPostText, setNewPostText] = useState('');
  const [postType, setPostType] = useState<'intention' | 'testimony'>('intention');
  const [showForm, setShowForm] = useState(false);
  const [selectedClassic, setSelectedClassic] = useState<ClassicPrayer | null>(null);

  useEffect(() => {
    // Carrega dados rotativos semanais
    setIntentions(communityService.getWeeklyIntentions());
    setTestimonies(communityService.getWeeklyTestimonies());
  }, []);

  const handleEcho = (id: string) => {
    setIntentions(prev => prev.map(i => i.id === id ? { ...i, echoes: i.echoes + 1 } : i));
  };

  const handleGlory = (id: string) => {
    setTestimonies(prev => prev.map(t => t.id === id ? { ...t, glories: t.glories + 1 } : t));
  };

  const handlePost = () => {
    if (!newPostText.trim()) return;
    alert("Publicação enviada para moderação. Em breve estará no altar!");
    setNewPostText('');
    setShowForm(false);
  };

  return (
    <div className="space-y-8 pb-10">
      <header className="flex justify-between items-end">
        <div>
          <span className="text-[#C2A385] text-xs font-semibold uppercase tracking-[0.2em]">Lugar de Comunhão</span>
          <h1 className="font-serif text-4xl mt-1 text-[#2C3E50]">O Altar</h1>
        </div>
        <button 
          onClick={() => setShowForm(true)}
          className="bg-[#C2A385] text-white p-3.5 rounded-full shadow-xl active:scale-90 transition-transform"
        >
          <Sparkles size={24} />
        </button>
      </header>

      <div className="flex bg-white p-1 rounded-3xl border border-[#C2A385]/10 shadow-sm">
        {(['intentions', 'testimonies', 'treasury'] as const).map((tab) => (
          <button 
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 rounded-2xl text-[8px] font-bold uppercase tracking-widest transition-all ${activeTab === tab ? 'bg-[#C2A385] text-white shadow-lg' : 'text-[#2C3E50]/30 hover:text-[#C2A385]'}`}
          >
            {tab === 'intentions' ? 'Intercessão' : tab === 'testimonies' ? 'Testemunhos' : 'Tesouro'}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        <AnimatePresence mode="wait">
          {activeTab === 'intentions' && (
            <motion.div key="intentions" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
              <p className="text-[10px] text-center font-bold text-[#C2A385]/60 uppercase tracking-widest italic">Conteúdo rotativo semanal</p>
              {intentions.map((item) => (
                <div key={item.id} className="bg-white p-7 rounded-[2.5rem] border border-[#C2A385]/10 shadow-sm space-y-4">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold text-[#C2A385] uppercase tracking-widest">{item.author}</span>
                    <div className="h-px flex-1 bg-gradient-to-r from-[#C2A385]/20 to-transparent" />
                  </div>
                  <p className="text-[#2C3E50] font-serif text-xl italic leading-relaxed">"{item.text}"</p>
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-2 text-[#2C3E50]/30 text-[10px] font-bold uppercase tracking-widest">
                       <Heart size={14} className={item.echoes > 0 ? 'text-[#C2A385] fill-[#C2A385]' : ''} />
                       <span>{item.echoes} orando</span>
                    </div>
                    <button onClick={() => handleEcho(item.id)} className="border border-[#C2A385]/30 text-[#C2A385] px-6 py-2 rounded-full text-[10px] font-bold uppercase tracking-widest hover:bg-[#C2A385] hover:text-white transition-all">Amém</button>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'testimonies' && (
            <motion.div key="testimonies" initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
              <p className="text-[10px] text-center font-bold text-[#C2A385]/60 uppercase tracking-widest italic">Vitórias alcançadas esta semana</p>
              {testimonies.map((item) => (
                <div key={item.id} className="bg-white p-7 rounded-[2.5rem] border-2 border-[#C2A385]/5 shadow-xl space-y-4 relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#C2A385]/10 to-transparent rounded-full -mr-12 -mt-12 blur-xl" />
                  <div className="flex items-center justify-between relative z-10">
                    <span className="text-[9px] font-bold text-[#C2A385] uppercase tracking-widest">Glória por {item.author}</span>
                  </div>
                  <p className="text-[#2C3E50] font-serif text-2xl italic leading-tight relative z-10">"{item.text}"</p>
                  <div className="flex items-center justify-between relative z-10">
                    <div className="flex items-center gap-1.5 text-[#C2A385]">
                      <Sun size={14} className="animate-spin-slow" />
                      <span className="text-[10px] font-black uppercase">{item.glories} Glórias</span>
                    </div>
                    <button onClick={() => handleGlory(item.id)} className="bg-[#C2A385] text-white px-6 py-2 rounded-full text-[10px] font-bold uppercase shadow-lg shadow-[#C2A385]/20">Glória!</button>
                  </div>
                </div>
              ))}
            </motion.div>
          )}

          {activeTab === 'treasury' && (
             <motion.div key="treasury" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
               {classicPrayers.map((prayer) => (
                 <div key={prayer.id} onClick={() => setSelectedClassic(prayer)} className="bg-white p-6 rounded-[2.5rem] border border-[#C2A385]/10 flex items-center justify-between cursor-pointer group hover:border-[#C2A385]/40 transition-all">
                   <div className="flex items-center gap-5">
                     <div className="w-12 h-12 bg-[#FDFCF8] rounded-2xl flex items-center justify-center text-[#C2A385] group-hover:bg-[#C2A385] group-hover:text-white transition-all">
                       <Book size={20} />
                     </div>
                     <div>
                       <span className="text-[9px] font-bold text-[#C2A385] uppercase tracking-widest">{prayer.category}</span>
                       <h4 className="font-serif text-xl text-[#2C3E50]">{prayer.title}</h4>
                     </div>
                   </div>
                   <Play size={16} className="text-[#C2A385]/20 group-hover:text-[#C2A385]" />
                 </div>
               ))}
             </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Modal Novo Post */}
      <AnimatePresence>
        {showForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[110] flex items-center justify-center bg-[#2C3E50]/60 backdrop-blur-sm p-6">
            <div className="bg-white w-full max-w-sm rounded-[3rem] p-8 space-y-6 relative shadow-2xl">
              <button onClick={() => setShowForm(false)} className="absolute top-6 right-6 text-gray-300"><X size={20} /></button>
              <h2 className="font-serif text-2xl text-center text-[#2C3E50]">Novo Registro no Altar</h2>
              <div className="flex bg-[#FDFCF8] p-1 rounded-2xl border">
                <button onClick={() => setPostType('intention')} className={`flex-1 py-3 rounded-xl text-[9px] font-black uppercase ${postType === 'intention' ? 'bg-[#2C3E50] text-white' : 'text-[#2C3E50]/30'}`}>Intercessão</button>
                <button onClick={() => setPostType('testimony')} className={`flex-1 py-3 rounded-xl text-[9px] font-black uppercase ${postType === 'testimony' ? 'bg-[#C2A385] text-white' : 'text-[#C2A385]/30'}`}>Testemunho</button>
              </div>
              <textarea value={newPostText} onChange={(e) => setNewPostText(e.target.value)} placeholder="Escreva aqui..." className="w-full h-32 bg-[#FDFCF8] border rounded-[2rem] p-6 outline-none text-sm" />
              <button onClick={handlePost} className={`w-full py-4 rounded-2xl font-bold uppercase text-[10px] text-white ${postType === 'intention' ? 'bg-[#2C3E50]' : 'bg-[#C2A385]'}`}>Enviar ao Altar</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedClassic && (
          <motion.div initial={{ opacity: 0, y: 100 }} animate={{ opacity: 1, y: 0 }} className="fixed inset-0 z-[150] bg-[#FDFCF8] flex flex-col items-center p-8 overflow-y-auto">
            <button onClick={() => setSelectedClassic(null)} className="absolute top-8 right-8 p-3 bg-white rounded-full text-[#2C3E50]/40 shadow-sm border"><X size={24} /></button>
            <div className="max-w-md w-full mt-24 text-center space-y-12">
              <span className="text-[#C2A385] text-[10px] font-bold uppercase tracking-[0.3em]">{selectedClassic.category}</span>
              <h2 className="font-serif text-5xl text-[#2C3E50]">{selectedClassic.title}</h2>
              <div className="h-px w-24 bg-[#C2A385]/20 mx-auto" />
              <p className="font-serif text-2xl text-[#2C3E50] leading-[1.8] italic px-4">{selectedClassic.text}</p>
              <button onClick={() => setSelectedClassic(null)} className="px-12 py-5 bg-[#2C3E50] text-white rounded-full font-bold uppercase tracking-[0.3em] text-[10px]">Fechar Meditação</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <style>{`@keyframes spin-slow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } } .animate-spin-slow { animation: spin-slow 12s linear infinite; }`}</style>
    </div>
  );
};

export default PrayerWall;
