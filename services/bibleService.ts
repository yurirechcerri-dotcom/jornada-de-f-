
import { GoogleGenAI } from "@google/genai";
import { BibleBook } from "../types";

export interface BibleChapter {
  book: string;
  chapter: number;
  verses: { number: number; text: string }[];
}

const BIBLE_BOOKS: BibleBook[] = [
  // Antigo Testamento (Amostra - os principais para estrutura)
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
  // Novo Testamento
  { id: 'mat', name: 'Mateus', abbreviation: 'Mt', chapters: 28, testament: 'new' },
  { id: 'mar', name: 'Marcos', abbreviation: 'Mc', chapters: 16, testament: 'new' },
  { id: 'luc', name: 'Lucas', abbreviation: 'Lc', chapters: 24, testament: 'new' },
  { id: 'joa', name: 'João', abbreviation: 'Jo', chapters: 21, testament: 'new' },
  { id: 'act', name: 'Atos', abbreviation: 'At', chapters: 28, testament: 'new' },
  { id: 'rom', name: 'Romanos', abbreviation: 'Rm', chapters: 16, testament: 'new' },
  { id: 'rev', name: 'Apocalipse', abbreviation: 'Ap', chapters: 22, testament: 'new' },
];

export const bibleService = {
  getBooks() {
    return BIBLE_BOOKS;
  },

  async getChapterText(bookName: string, chapter: number): Promise<BibleChapter | null> {
    const cacheKey = `bible_chapter_${bookName}_${chapter}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) return JSON.parse(cached);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Retorne o texto completo do capítulo ${chapter} do livro de ${bookName} (Versão Almeida Revista e Atualizada). 
        Formate como um JSON estruturado: {"book": "${bookName}", "chapter": ${chapter}, "verses": [{"number": 1, "text": "..."}, ...]}. 
        Retorne APENAS o JSON.`,
        config: { responseMimeType: "application/json" }
      });

      const result = JSON.parse(response.text);
      localStorage.setItem(cacheKey, JSON.stringify(result));
      return result;
    } catch (error) {
      console.error("Erro ao carregar capítulo:", error);
      return null;
    }
  },

  async searchVerse(query: string) {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Encontre o versículo para: "${query}". Retorne JSON: {"text": "...", "reference": "...", "context": "..."}`,
        config: { responseMimeType: "application/json" }
      });
      return JSON.parse(response.text);
    } catch (e) { return null; }
  }
};
