
export interface DailyVerse {
  text: string;
  reference: string;
}

const verses: DailyVerse[] = [
  { text: "Porque eu bem sei os pensamentos que tenho a vosso respeito, diz o Senhor; pensamentos de paz, e não de mal.", reference: "Jeremias 29:11" },
  { text: "O Senhor é o meu pastor, nada me faltará.", reference: "Salmos 23:1" },
  { text: "Tudo posso naquele que me fortalece.", reference: "Filipenses 4:13" },
  { text: "Lâmpada para os meus pés é tua palavra, e luz para o meu caminho.", reference: "Salmos 119:105" },
  { text: "Buscai primeiro o reino de Deus, e a sua justiça, e todas estas coisas vos serão acrescentadas.", reference: "Mateus 6:33" },
  { text: "O meu socorro vem do Senhor, que fez o céu e a terra.", reference: "Salmos 121:2" },
  { text: "Deixo-vos a paz, a minha paz vos dou; não vo-la dou como o mundo a dá.", reference: "João 14:27" },
  { text: "Alegrai-vos na esperança, sedes pacientes na tribulação, perseverai na oração.", reference: "Romanos 12:12" },
  { text: "O Senhor te abençoe e te guarde; o Senhor faça resplandecer o seu rosto sobre ti.", reference: "Números 6:24-25" },
  { text: "Mas os que esperam no Senhor renovarão as suas forças; subirão com asas como águias.", reference: "Isaías 40:31" }
];

export const getVerseOfTheDay = (): DailyVerse => {
  const now = new Date();
  const start = new Date(now.getFullYear(), 0, 0);
  const diff = now.getTime() - start.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay);
  
  // Seleciona baseado no dia do ano para ser consistente para todos
  return verses[dayOfYear % verses.length];
};
