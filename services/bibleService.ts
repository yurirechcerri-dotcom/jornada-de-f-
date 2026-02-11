
import { GoogleGenAI } from "@google/genai";
import { BibleBook } from "../types";

export interface BibleChapter {
  book: string;
  chapter: number;
  verses: { number: number; text: string }[];
}

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

/**
 * Função utilitária para extrair e validar JSON de respostas da IA
 */
const extractJSON = (text: string | undefined) => {
  if (!text) return null;
  try {
    // Tenta encontrar o conteúdo entre chaves caso a IA mande markdown
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    const cleanJson = jsonMatch ? jsonMatch[0] : text;
    return JSON.parse(cleanJson);
  } catch (e) {
    console.error("Erro ao parsear JSON da Bíblia:", e, text);
    return null;
  }
};

export const bibleService = {
  getBooks() {
    return BIBLE_BOOKS;
  },

  async getChapterText(bookName: string, chapter: number): Promise<BibleChapter | null> {
    const cacheKey = `bible_chapter_${bookName.toLowerCase()}_${chapter}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) return JSON.parse(cached);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Aja como uma API de Bíblia. Forneça o texto completo do capítulo ${chapter} de ${bookName} na versão Almeida Revista e Atualizada. 
        Retorne estritamente um JSON neste formato: {"book": "${bookName}", "chapter": ${chapter}, "verses": [{"number": 1, "text": "..."}]}.
        Certifique-se de incluir todos os versículos do capítulo.`,
        config: { 
          responseMimeType: "application/json"
        }
      });

      const result = extractJSON(response.text);
      if (result && result.verses) {
        localStorage.setItem(cacheKey, JSON.stringify(result));
        return result;
      }
      return null;
    } catch (error) {
      console.error("Erro crítico ao carregar capítulo:", error);
      return null;
    }
  },

  async searchVerse(query: string) {
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Busque na Bíblia por: "${query}". Retorne um JSON com o versículo mais relevante: {"text": "texto do versículo", "reference": "Livro Cap:Ver", "context": "breve explicação"}. 
        Se não encontrar, retorne null.`,
        config: { responseMimeType: "application/json" }
      });
      return extractJSON(response.text);
    } catch (e) { 
      return null; 
    }
  }
};
