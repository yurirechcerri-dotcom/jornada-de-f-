
import React from 'react';

interface HeatmapProps {
  completions: string[]; // ISO strings
}

const Heatmap: React.FC<HeatmapProps> = ({ completions }) => {
  // Simplificação: Mostrar os últimos 28 dias (4 semanas)
  const days = Array.from({ length: 28 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (27 - i));
    return d.toISOString().split('T')[0];
  });

  const completionDates = completions.map(c => c.split('T')[0]);

  return (
    <div className="mt-8 bg-white p-6 rounded-2xl border border-[#C2A385]/10 shadow-sm">
      <h3 className="text-[#2C3E50] text-sm font-semibold mb-4 uppercase tracking-widest">
        Constância de Oração
      </h3>
      <div className="grid grid-cols-7 gap-2">
        {days.map((day) => {
          const isCompleted = completionDates.includes(day);
          return (
            <div
              key={day}
              title={day}
              className={`aspect-square rounded-sm transition-all duration-500 ${
                isCompleted 
                  ? 'bg-[#C2A385] shadow-[0_0_8px_rgba(194,163,133,0.3)]' 
                  : 'bg-[#C2A385]/10'
              }`}
            />
          );
        })}
      </div>
      <p className="text-[10px] text-[#2C3E50]/40 mt-4 text-center italic">
        "Orai sem cessar." — 1 Tessalonicenses 5:17
      </p>
    </div>
  );
};

export default Heatmap;
