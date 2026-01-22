
export interface PrayerIntent {
  id: string;
  author: string;
  text: string;
  echoes: number;
}

export interface Testimony {
  id: string;
  author: string;
  text: string;
  glories: number;
}

const intentionsPool: PrayerIntent[] = [
  { id: '1', author: 'Irmã Lúcia', text: 'Pela restauração da saúde do meu neto Davi.', echoes: 42 },
  { id: '2', author: 'Marcos Silva', text: 'Pela direção de Deus em uma decisão profissional difícil.', echoes: 15 },
  { id: '3', author: 'Anônimo', text: 'Por força para vencer um vício que me persegue há anos.', echoes: 89 },
  { id: '4', author: 'Helena', text: 'Pelo ministério de jovens da nossa comunidade local.', echoes: 23 },
  { id: '5', author: 'Ricardo', text: 'Pela paz nas famílias que estão passando por luto hoje.', echoes: 56 },
  { id: '6', author: 'Mariana', text: 'Para que eu consiga perdoar quem me feriu no passado.', echoes: 31 },
  { id: '7', author: 'Anônimo', text: 'Pela conversão de um familiar querido.', echoes: 112 },
  { id: '8', author: 'Pedro Araújo', text: 'Pela provisão divina no pagamento das contas este mês.', echoes: 19 }
];

const testimoniesPool: Testimony[] = [
  { id: 't1', author: 'Clara M.', text: 'Minha família foi restaurada após 5 anos de separação. Deus é fiel!', glories: 156 },
  { id: 't2', author: 'Jorge', text: 'Fui curado de uma depressão profunda através da palavra diária.', glories: 89 },
  { id: 't3', author: 'Bia Ribeiro', text: 'Consegui o emprego que tanto orava. A porta se abriu no 7º dia da jornada!', glories: 210 },
  { id: 't4', author: 'Anônimo', text: 'Senti a presença de Deus de forma real durante o ritual matinal hoje.', glories: 67 },
  { id: 't5', author: 'Samuel', text: 'Minha empresa ia fechar, mas uma ideia inspirada mudou tudo em 24h.', glories: 134 }
];

export const communityService = {
  getWeeklyIntentions(): PrayerIntent[] {
    const weekNumber = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
    // Retorna 4 intenções que mudam toda semana
    return intentionsPool.filter((_, idx) => (idx + weekNumber) % 2 === 0).slice(0, 4);
  },

  getWeeklyTestimonies(): Testimony[] {
    const weekNumber = Math.floor(Date.now() / (7 * 24 * 60 * 60 * 1000));
    // Retorna 3 testemunhos que mudam toda semana
    return testimoniesPool.filter((_, idx) => (idx + weekNumber) % 3 === 0).slice(0, 3);
  }
};
