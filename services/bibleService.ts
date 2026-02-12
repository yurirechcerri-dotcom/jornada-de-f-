
import { GoogleGenAI } from "@google/genai";
import { BibleBook } from "../types";

export interface BibleChapter {
  book: string;
  chapter: number;
  verses: { number: number; text: string }[];
}

// "Núcleo de Fé" - Conteúdo Offline para os capítulos mais lidos
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
  'joão_3': {
    book: 'João',
    chapter: 3,
    verses: [
      { number: 16, text: "Porque Deus amou o mundo de tal maneira que deu o seu Filho unigênito, para que todo aquele que nele crê não pereça, mas tenha a vida eterna." },
      { number: 17, text: "Porque Deus enviou o seu Filho ao mundo, não para que condenasse o mundo, mas para que o mundo fosse salvo por ele." }
    ]
  },
  'gênesis_1': {
    book: 'Gênesis',
    chapter: 1,
    verses: [
      { number: 1, text: "No princípio, criou Deus os céus e a terra." },
      { number: 2, text: "A terra, porém, estava sem forma e vazia; havia trevas sobre a face do abismo, e o Espírito de Deus pairava por sobre as águas." },
      { number: 3, text: "Disse Deus: Haja luz; e houve luz." }
    ]
  }
};

const BIBLE_BOOKS: BibleBook[] = [
  { id: 'gen', name: 'Gênesis', abbreviation: 'Gn', chapters: 50, testament: 'old' },
  { id: 'exo', name: 'Êxodo', abbreviation: 'Ex', chapters: 40, testament: 'old' },
  { id: 'lev', name: 'Levítico', abbreviation: 'Lv', chapters: 27, testament: 'old' },
  { id: 'num', name: 'Números', abbreviation: 'Nm', chapters: 36, testament: 'old' },
  { id: 'deu', name: 'Deuteronômio', abbreviation: 'Dt', chapters: 34, testament: 'old' },
  { id: 'jos', name: 'Josué', abbreviation: 'Js', chapters: 24, testament: 'old' },
  { id: 'jud', name: 'Juízes', abbreviation: 'Jz', chapters: 21, testament: 'old' },
  { id: 'rut', name: 'Rute', abbreviation: 'Ru', chapters: 4, testament: 'old' },
  { id: '1sa', name: '1 Samuel', abbreviation: '1Sm', chapters: 31, testament: 'old' },
  { id: 'psa', name: 'Salmos', abbreviation: 'Sl', chapters: 150, testament: 'old' },
  { id: 'pro', name: 'Provérbios', abbreviation: 'Pv', chapters: 31, testament: 'old' },
  { id: 'mat', name: 'Mateus', abbreviation: 'Mt', chapters: 28, testament: 'new' },
  { id: 'mar', name: 'Marcos', abbreviation: 'Mc', chapters: 16, testament: 'new' },
  { id: 'luc', name: 'Lucas', abbreviation: 'Lc', chapters: 24, testament: 'new' },
  { id: 'joa', name: 'João', abbreviation: 'Jo', chapters: 21, testament: 'new' },
  { id: 'act', name: 'Atos', abbreviation: 'At', chapters: 28, testament: 'new' },
  { id: 'rom', name: 'Romanos', abbreviation: 'Rm', chapters: 16, testament: 'new' },
  { id: 'rev', name: 'Apocalipse', abbreviation: 'Ap', chapters: 22, testament: 'new' },
];

const extractJSON = (text: string | undefined) => {
  if (!text) return null;
  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const cleanJson = jsonMatch ? jsonMatch[0] : text;
    return JSON.parse(cleanJson);
  } catch (e) {
    console.error("Erro ao parsear JSON:", e);
    return null;
  }
};

export const bibleService = {
  getBooks() {
    return BIBLE_BOOKS;
  },

  async getChapterText(bookName: string, chapter: number): Promise<BibleChapter | null> {
    const key = `${bookName.toLowerCase()}_${chapter}`;
    
    // 1. Tenta o conteúdo offline (imediato)
    if (OFFLINE_BIBLE[key]) {
      return OFFLINE_BIBLE[key];
    }

    // 2. Tenta o cache do navegador
    const cacheKey = `bible_cache_${key}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) return JSON.parse(cached);

    // 3. Busca via IA como fallback
    try {
      // Fix: Exclusively use process.env.API_KEY for initialization as required by @google/genai guidelines
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Retorne o texto bíblico do capítulo ${chapter} do livro de ${bookName} (Versão ARA). Retorne APENAS um JSON no formato: {"book": "${bookName}", "chapter": ${chapter}, "verses": [{"number": 1, "text": "..."}]}`,
        config: { responseMimeType: "application/json" }
      });

      const result = extractJSON(response.text);
      if (result && result.verses) {
        localStorage.setItem(cacheKey, JSON.stringify(result));
        return result;
      }
      return null;
    } catch (error) {
      console.error("Erro na busca remota:", error);
      return null;
    }
  },

  async searchVerse(query: string) {
    try {
      // Fix: Exclusively use process.env.API_KEY for initialization as required by @google/genai guidelines
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Busque na Bíblia: "${query}". Retorne um JSON: {"text": "texto", "reference": "Livro Cap:Ver", "context": "breve explicação"}.`,
        config: { responseMimeType: "application/json" }
      });
      return extractJSON(response.text);
    } catch (e) { 
      return null; 
    }
  }
};
