
export interface ReadingPlan {
  id: string;
  title: string;
  duration: string;
  progress: number;
  image: string;
}

export interface InspiringMedia {
  id: string;
  type: 'image' | 'video';
  url: string;
  title: string;
  category: string;
  verse?: string;
}

const mediaPool: InspiringMedia[] = [
  { id: 'm1', type: 'image', url: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80', title: 'Luz no Caminho', category: 'Esperança', verse: 'O Senhor é a minha luz e a minha salvação; a quem temerei?' },
  { id: 'm2', type: 'image', url: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=600&q=80', title: 'A Quietude da Alma', category: 'Meditação', verse: 'Aquietai-vos, e sabei que eu sou Deus.' },
  { id: 'm3', type: 'image', url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=600&q=80', title: 'Raízes Fortes', category: 'Fé', verse: 'Sendo enraizados e fundados em amor.' },
  { id: 'm4', type: 'image', url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=600&q=80', title: 'O Despertar', category: 'Gratidão', verse: 'Este é o dia que fez o Senhor; regozijemo-nos!' },
  { id: 'm5', type: 'image', url: 'https://images.unsplash.com/photo-1501854140801-50d01698950b?auto=format&fit=crop&w=600&q=80', title: 'Horizontes de Fé', category: 'Visão', verse: 'Pois vivemos por fé, e não pelo que vemos.' },
  { id: 'm6', type: 'image', url: 'https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=600&q=80', title: 'O Rio da Vida', category: 'Paz', verse: 'Quem crer em mim, do seu interior fluirão rios de água viva.' },
  { id: 'm7', type: 'image', url: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&w=600&q=80', title: 'Criação Divina', category: 'Adoração', verse: 'Os céus declaram a glória de Deus.' },
  { id: 'm8', type: 'image', url: 'https://images.unsplash.com/photo-1475924156734-496f6cac6ec1?auto=format&fit=crop&w=600&q=80', title: 'Refúgio Seguro', category: 'Proteção', verse: 'Deus é o nosso refúgio e fortaleza.' }
];

export const inspirationService = {
  getReadingPlans(): ReadingPlan[] {
    return [
      { id: 'nt-90', title: 'Novo Testamento', duration: '90 dias', progress: 12, image: 'https://images.unsplash.com/photo-1504052434569-70ad5836ab65?auto=format&fit=crop&w=600&q=80' },
      { id: 'psalms-30', title: 'Sabedoria nos Salmos', duration: '30 dias', progress: 45, image: 'https://images.unsplash.com/photo-1507434965515-61970f2bd7c6?auto=format&fit=crop&w=600&q=80' },
      { id: 'proverbs-31', title: 'Provérbios Diários', duration: '31 dias', progress: 0, image: 'https://images.unsplash.com/photo-1473186578172-c141e6798ee4?auto=format&fit=crop&w=600&q=80' }
    ];
  },

  getMedia(): InspiringMedia[] {
    const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / (1000 * 60 * 60 * 24));
    // Rotaciona as imagens diariamente selecionando 4 do pool
    const startIndex = dayOfYear % mediaPool.length;
    const selection = [];
    for(let i = 0; i < 4; i++) {
      selection.push(mediaPool[(startIndex + i) % mediaPool.length]);
    }
    return selection;
  },

  getMotivationalMessages(): string[] {
    return [
      "Deus tem um plano maior do que qualquer medo seu.",
      "A sua jornada é única, não se compare com os outros.",
      "Onde houver fé, haverá milagres no silêncio.",
      "A graça de hoje é suficiente para os desafios de hoje.",
      "Sua persistência na oração é o início da sua vitória."
    ];
  }
};
