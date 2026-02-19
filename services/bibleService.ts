import { GoogleGenAI } from "@google/genai";
import { BibleBook } from "../types";

export interface BibleChapter {
  book: string;
  chapter: number;
  verses: { number: number; text: string }[];
}

// "Núcleo de Fé" - Conteúdo Imediato e 100% Offline
const OFFLINE_BIBLE: Record<string, BibleChapter> = {
  'salmos_23': {
    book: 'Salmos',
    chapter: 23,
    verses: [
      { number: 1, text: "O Senhor é o meu pastor; nada me faltará." },
      { number: 2, text: "Deitar-me faz em verdes pastos, guia-me mansamente a águas tranquilas." },
      { number: 3, text: "Refrigera a minha alma; guia-me pelas veredas da justiça por amor do seu nome." },
      { number: 4, text: "Ainda que eu andasse pelo vale da sombra da morte, não temeria mal algum, porque tu estás comigo; a tua vara e o teu cajado me consolam." },
      { number: 5, text: "Preparas uma mesa perante mim na presença dos meus inimigos, unges a minha cabeça com óleo, o meu cálice transborda." },
      { number: 6, text: "Certamente que a bondade e a misericórdia me seguirão todos os dias da minha vida; e habitarei na Casa do Senhor por longos dias." }
    ]
  },
  'salmos_91': {
    book: 'Salmos',
    chapter: 91,
    verses: [
      { number: 1, text: "Aquele que habita no esconderijo do Altíssimo, à sombra do Onipotente descansará." },
      { number: 2, text: "Direi do Senhor: Ele é o meu Deus, o meu refúgio, a minha fortaleza, e nele confiarei." },
      { number: 5, text: "Não terás medo do terror de noite nem da seta que voa de dia." },
      { number: 7, text: "Mil cairão ao teu lado, e dez mil à tua direita, mas não chegará a ti." },
      { number: 11, text: "Porque aos seus anjos dará ordem a teu respeito, para te guardarem em todos os teus caminhos." }
    ]
  },
  'mateus_6': {
    book: 'Mateus',
    chapter: 6,
    verses: [
      { number: 9, text: "Portanto, vós orareis assim: Pai nosso, que estás nos céus, santificado seja o teu nome;" },
      { number: 10, text: "Venha o teu reino, seja feita a tua vontade, assim na terra como no céu;" },
      { number: 33, text: "Mas, buscai primeiro o reino de Deus, e a sua justiça, e todas estas coisas vos serão acrescentadas." }
    ]
  },
  'joão_3': {
    book: 'João',
    chapter: 3,
    verses: [
      { number: 16, text: "Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna." }
    ]
  },
  'gênesis_1': {
    book: 'Gênesis',
    chapter: 1,
    verses: [
      { number: 1, text: "No princípio, criou Deus os céus e a terra." },
      { number: 2, text: "E a terra era sem forma e vazia; e havia trevas sobre a face do abismo." },
      { number: 3, text: "E disse Deus: Haja luz; e houve luz." }
    ]
  }
};

const BIBLE_BOOKS: BibleBook[] = [
  // Antigo Testamento
  { id: '1', name: 'Gênesis', abbreviation: 'Gn', chapters: 50, testament: 'old' },
  { id: '2', name: 'Êxodo', abbreviation: 'Êx', chapters: 40, testament: 'old' },
  { id: '3', name: 'Levítico', abbreviation: 'Lv', chapters: 27, testament: 'old' },
  { id: '4', name: 'Números', abbreviation: 'Nm', chapters: 36, testament: 'old' },
  { id: '5', name: 'Deuteronômio', abbreviation: 'Dt', chapters: 34, testament: 'old' },
  { id: '6', name: 'Josué', abbreviation: 'Js', chapters: 24, testament: 'old' },
  { id: '7', name: 'Juízes', abbreviation: 'Jz', chapters: 21, testament: 'old' },
  { id: '8', name: 'Rute', abbreviation: 'Rt', chapters: 4, testament: 'old' },
  { id: '9', name: '1 Samuel', abbreviation: '1Sm', chapters: 31, testament: 'old' },
  { id: '10', name: '2 Samuel', abbreviation: '2Sm', chapters: 24, testament: 'old' },
  { id: '11', name: '1 Reis', abbreviation: '1Rs', chapters: 22, testament: 'old' },
  { id: '12', name: '2 Reis', abbreviation: '2Rs', chapters: 25, testament: 'old' },
  { id: '13', name: '1 Crônicas', abbreviation: '1Cr', chapters: 29, testament: 'old' },
  { id: '14', name: '2 Crônicas', abbreviation: '2Cr', chapters: 36, testament: 'old' },
  { id: '15', name: 'Esdras', abbreviation: 'Ed', chapters: 10, testament: 'old' },
  { id: '16', name: 'Neemias', abbreviation: 'Ne', chapters: 13, testament: 'old' },
  { id: '17', name: 'Ester', abbreviation: 'Et', chapters: 10, testament: 'old' },
  { id: '18', name: 'Jó', abbreviation: 'Jó', chapters: 42, testament: 'old' },
  { id: '19', name: 'Salmos', abbreviation: 'Sl', chapters: 150, testament: 'old' },
  { id: '20', name: 'Provérbios', abbreviation: 'Pv', chapters: 31, testament: 'old' },
  { id: '21', name: 'Eclesiastes', abbreviation: 'Ec', chapters: 12, testament: 'old' },
  { id: '22', name: 'Cânticos', abbreviation: 'Ct', chapters: 8, testament: 'old' },
  { id: '23', name: 'Isaías', abbreviation: 'Is', chapters: 66, testament: 'old' },
  { id: '24', name: 'Jeremias', abbreviation: 'Jr', chapters: 52, testament: 'old' },
  { id: '25', name: 'Lamentações', abbreviation: 'Lm', chapters: 5, testament: 'old' },
  { id: '26', name: 'Ezequiel', abbreviation: 'Ez', chapters: 48, testament: 'old' },
  { id: '27', name: 'Daniel', abbreviation: 'Dn', chapters: 12, testament: 'old' },
  { id: '28', name: 'Oseias', abbreviation: 'Os', chapters: 14, testament: 'old' },
  { id: '29', name: 'Joel', abbreviation: 'Jl', chapters: 3, testament: 'old' },
  { id: '30', name: 'Amós', abbreviation: 'Am', chapters: 9, testament: 'old' },
  { id: '31', name: 'Obadias', abbreviation: 'Ob', chapters: 1, testament: 'old' },
  { id: '32', name: 'Jonas', abbreviation: 'Jon', chapters: 4, testament: 'old' },
  { id: '33', name: 'Miqueias', abbreviation: 'Mq', chapters: 7, testament: 'old' },
  { id: '34', name: 'Naum', abbreviation: 'Na', chapters: 3, testament: 'old' },
  { id: '35', name: 'Habacuque', abbreviation: 'Hb', chapters: 3, testament: 'old' },
  { id: '36', name: 'Sofonias', abbreviation: 'Sf', chapters: 3, testament: 'old' },
  { id: '37', name: 'Ageu', abbreviation: 'Ag', chapters: 2, testament: 'old' },
  { id: '38', name: 'Zacarias', abbreviation: 'Zac', chapters: 14, testament: 'old' },
  { id: '39', name: 'Malaquias', abbreviation: 'Ml', chapters: 4, testament: 'old' },
  // Novo Testamento
  { id: '40', name: 'Mateus', abbreviation: 'Mt', chapters: 28, testament: 'new' },
  { id: '41', name: 'Marcos', abbreviation: 'Mc', chapters: 16, testament: 'new' },
  { id: '42', name: 'Lucas', abbreviation: 'Lc', chapters: 24, testament: 'new' },
  { id: '43', name: 'João', abbreviation: 'Jo', chapters: 21, testament: 'new' },
  { id: '44', name: 'Atos', abbreviation: 'At', chapters: 28, testament: 'new' },
  { id: '45', name: 'Romanos', abbreviation: 'Rm', chapters: 16, testament: 'new' },
  { id: '46', name: '1 Coríntios', abbreviation: '1Co', chapters: 16, testament: 'new' },
  { id: '47', name: '2 Coríntios', abbreviation: '2Co', chapters: 13, testament: 'new' },
  { id: '48', name: 'Gálatas', abbreviation: 'Gl', chapters: 6, testament: 'new' },
  { id: '49', name: 'Efésios', abbreviation: 'Ef', chapters: 6, testament: 'new' },
  { id: '50', name: 'Filipenses', abbreviation: 'Fp', chapters: 4, testament: 'new' },
  { id: '51', name: 'Colossenses', abbreviation: 'Cl', chapters: 4, testament: 'new' },
  { id: '52', name: '1 Tessalonicenses', abbreviation: '1Ts', chapters: 5, testament: 'new' },
  { id: '53', name: '2 Tessalonicenses', abbreviation: '2Ts', chapters: 3, testament: 'new' },
  { id: '54', name: '1 Timóteo', abbreviation: '1Tm', chapters: 6, testament: 'new' },
  { id: '55', name: '2 Timóteo', abbreviation: '2Tm', chapters: 4, testament: 'new' },
  { id: '56', name: 'Tito', abbreviation: 'Tt', chapters: 3, testament: 'new' },
  { id: '57', name: 'Filemom', abbreviation: 'Fm', chapters: 1, testament: 'new' },
  { id: '58', name: 'Hebreus', abbreviation: 'Hb', chapters: 13, testament: 'new' },
  { id: '59', name: 'Tiago', abbreviation: 'Tg', chapters: 5, testament: 'new' },
  { id: '60', name: '1 Pedro', abbreviation: '1Pe', chapters: 5, testament: 'new' },
  { id: '61', name: '2 Pedro', abbreviation: '2Pe', chapters: 3, testament: 'new' },
  { id: '62', name: '1 João', abbreviation: '1Jo', chapters: 5, testament: 'new' },
  { id: '63', name: '2 João', abbreviation: '2Jo', chapters: 1, testament: 'new' },
  { id: '64', name: '3 João', abbreviation: '3Jo', chapters: 1, testament: 'new' },
  { id: '65', name: 'Judas', abbreviation: 'Jd', chapters: 1, testament: 'new' },
  { id: '66', name: 'Apocalipse', abbreviation: 'Ap', chapters: 22, testament: 'new' },
];

const extractJSON = (text: string | undefined) => {
  if (!text) return null;
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    return JSON.parse(jsonMatch ? jsonMatch[0] : text);
  } catch {
    return null;
  }
};

export const bibleService = {
  getBooks() {
    return BIBLE_BOOKS;
  },

  async getChapterText(bookName: string, chapter: number): Promise<BibleChapter | null> {
    const book = BIBLE_BOOKS.find(b => b.name === bookName);
    if (!book) return null;

    const key = `${bookName.toLowerCase()}_${chapter}`;
    
    // 1. Prioridade: Conteúdo Offline
    if (OFFLINE_BIBLE[key]) return OFFLINE_BIBLE[key];

    // 2. Cache Local
    const cacheKey = `bible_cache_${key}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) return JSON.parse(cached);

    // 3. API Pública Gratuita (bolls.life) - Não requer API_KEY
    try {
      // Usamos ARA (Almeida Revista e Atualizada)
      const response = await fetch(`https://bolls.life/get-chapter/ARA/${book.id}/${chapter}/`);
      if (response.ok) {
        const data = await response.json();
        const result: BibleChapter = {
          book: bookName,
          chapter: chapter,
          verses: data.map((v: any) => ({
            number: v.verse,
            text: v.text
          }))
        };
        localStorage.setItem(cacheKey, JSON.stringify(result));
        return result;
      }
    } catch (error) {
      console.error("Erro ao carregar da API Pública:", error);
    }

    // 4. Fallback: IA (Se configurada)
    const apiKey = process.env.API_KEY;
    if (!apiKey || apiKey === "" || apiKey === "undefined") {
      return null;
    }

    try {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Retorne o capítulo ${chapter} de ${bookName} (Versão ARA). Retorne APENAS um JSON: {"book": "${bookName}", "chapter": ${chapter}, "verses": [{"number": 1, "text": "..."}]}`,
        config: { responseMimeType: "application/json" }
      });

      const result = extractJSON(response.text);
      if (result && result.verses) {
        localStorage.setItem(cacheKey, JSON.stringify(result));
        return result;
      }
      return null;
    } catch (error) {
      console.error("Erro ao carregar da IA:", error);
      return null;
    }
  },

  async searchVerse(query: string) {
    // 1. Tenta usar a API Pública Gratuita primeiro (Mais rápido e sem custo)
    try {
      const response = await fetch(`https://bolls.life/search/ARA/?search=${encodeURIComponent(query)}`);
      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) {
          // Pegamos um resultado aleatório dos primeiros 5 para dar uma sensação de "inspiração" diferente a cada busca
          const topResults = data.slice(0, 5);
          const result = topResults[Math.floor(Math.random() * topResults.length)];
          
          const book = BIBLE_BOOKS.find(b => b.id === String(result.book));
          
          return {
            text: result.text,
            reference: `${book ? book.name : 'Bíblia'} ${result.chapter}:${result.verse}`,
            context: "Encontrado via busca nas Escrituras."
          };
        }
      }
    } catch (error) {
      console.error("Erro na busca pública:", error);
    }

    // 2. Fallback: IA (Se configurada e a busca pública falhar)
    const apiKey = process.env.API_KEY;
    if (!apiKey || apiKey === "" || apiKey === "undefined") {
      return null;
    }

    try {
      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Encontre um versículo bíblico sobre: "${query}". Retorne JSON: {"text": "...", "reference": "...", "context": "..."}`,
        config: { responseMimeType: "application/json" }
      });
      return extractJSON(response.text);
    } catch {
      return null;
    }
  }
};