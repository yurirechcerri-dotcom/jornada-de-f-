
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Sparkles, Heart, Anchor, Sun, Zap, Hourglass, Compass, Shield } from 'lucide-react';

interface JourneyDef {
  id: string;
  title: string;
  desc: string;
  days: number;
  color: string;
  icon: React.ElementType;
  tag: string;
}

const JourneyList: React.FC = () => {
  const navigate = useNavigate();

  const journeys: JourneyDef[] = [
    { 
      id: 'gratitude_7', 
      title: '7 Dias de Gratidão', 
      desc: 'Reaprenda a enxergar a mão de Deus nos mínimos detalhes da sua rotina.', 
      days: 7, 
      color: 'from-[#D4AF37] to-[#B19274]', 
      icon: Sun,
      tag: 'Essencial'
    },
    { 
      id: 'pardon_7', 
      title: '7 Dias de Perdão', 
      desc: 'Liberte seu coração de pesos antigos e experimente a cura divina.', 
      days: 7, 
      color: 'from-[#8A9A5B] to-[#556B2F]', 
      icon: Heart,
      tag: 'Cura'
    },
    { 
      id: 'patience_7', 
      title: '7 Dias de Paciência', 
      desc: 'Desenvolva a mansidão necessária para esperar o tempo perfeito do Criador.', 
      days: 7, 
      color: 'from-[#9B59B6] to-[#8E44AD]', 
      icon: Hourglass,
      tag: 'Virtude'
    },
    { 
      id: 'hope_7', 
      title: '7 Dias de Esperança', 
      desc: 'Encontre luz nos dias nublados e âncora para sua alma cansada.', 
      days: 7, 
      color: 'from-[#3498DB] to-[#2980B9]', 
      icon: Compass,
      tag: 'Ânimo'
    },
    { 
      id: 'service_7', 
      title: '7 Dias de Serviço', 
      desc: 'Mãos que servem são o reflexo mais puro do amor de Cristo na terra.', 
      days: 7, 
      color: 'from-[#4A69BD] to-[#1E3799]', 
      icon: Anchor,
      tag: 'Ação'
    },
    { 
      id: 'adversity_21', 
      title: 'Fé na Adversidade', 
      desc: 'Um guia prático de 21 dias para permanecer inabalável durante a tempestade.', 
      days: 21, 
      color: 'from-[#34495E] to-[#2C3E50]', 
      icon: Shield,
      tag: 'Resiliência'
    },
    { 
      id: 'proposito_21', 
      title: '21 Dias de Propósito', 
      desc: 'Uma jornada profunda de renovação para quem busca um novo nível espiritual.', 
      days: 21, 
      color: 'from-[#E67E22] to-[#D35400]', 
      icon: Zap,
      tag: 'Avançado'
    },
  ];

  return (
    <div className="space-y-8 pb-10">
      <header>
        <span className="text-[#C2A385] text-xs font-semibold uppercase tracking-[0.2em]">Caminhos de Transformação</span>
        <h1 className="font-serif text-4xl mt-1 text-[#2C3E50]">Jornadas</h1>
      </header>

      <div className="grid gap-6">
        {journeys.map((j, idx) => (
          <motion.div
            key={j.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            whileHover={{ 
              y: -10,
              scale: 1.02,
              transition: { type: 'spring', stiffness: 400, damping: 15 }
            }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate(`/journey/${j.id}`)}
            className="group cursor-pointer bg-white p-7 rounded-[2.5rem] border border-[#C2A385]/10 shadow-sm hover:shadow-[0_20px_40px_rgba(44,62,80,0.08)] transition-all duration-500 relative overflow-hidden"
          >
            {/* Background Decoration */}
            <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${j.color} opacity-[0.03] group-hover:opacity-[0.08] rounded-full -mr-16 -mt-16 transition-all duration-500`} />

            <div className="flex items-start justify-between relative z-10">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-2xl bg-gradient-to-br ${j.color} text-white shadow-lg shadow-black/5`}>
                    <j.icon size={20} />
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[9px] font-bold text-[#C2A385] uppercase tracking-widest">{j.tag}</span>
                    <div className="flex items-center gap-2">
                       <span className="text-[9px] font-bold text-[#2C3E50]/40 uppercase tracking-widest">{j.days} DIAS</span>
                       <div className="w-1 h-1 rounded-full bg-[#C2A385]/30" />
                       <Sparkles size={10} className="text-[#C2A385]" />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="font-serif text-2xl text-[#2C3E50] group-hover:text-[#C2A385] transition-colors duration-300">{j.title}</h3>
                  <p className="text-sm text-[#2C3E50]/50 leading-relaxed max-w-[90%] mt-2 group-hover:text-[#2C3E50]/70 transition-colors">
                    {j.desc}
                  </p>
                </div>
              </div>

              <div className="mt-1 p-3 bg-[#FDFCF8] rounded-full text-[#C2A385]/40 group-hover:text-[#C2A385] group-hover:bg-[#C2A385]/10 group-hover:rotate-[-45deg] transition-all duration-500 shadow-inner">
                <ChevronRight size={24} />
              </div>
            </div>

            {/* Visual Indicator of Duration */}
            <div className="mt-6 flex gap-1">
              {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className={`h-1 flex-1 rounded-full ${i === 0 ? `bg-gradient-to-r ${j.color}` : 'bg-gray-100'}`} />
              ))}
              {j.days > 7 && <div className="text-[8px] font-bold text-gray-300 ml-1">...</div>}
            </div>
          </motion.div>
        ))}
      </div>

      <div className="bg-[#C2A385]/5 p-8 rounded-[2.5rem] border border-dashed border-[#C2A385]/30 mt-10">
        <p className="text-xs text-[#C2A385] text-center font-medium italic leading-relaxed">
          "Pois onde estiver o seu tesouro, aí também estará o seu coração." — Mateus 6:21
        </p>
      </div>
    </div>
  );
};

export default JourneyList;
