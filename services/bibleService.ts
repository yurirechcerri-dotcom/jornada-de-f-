import { GoogleGenAI } from "@google/genai";
import { BibleBook } from "../types";

export interface BibleChapter {
  book: string;
  chapter: number;
  verses: { number: number; text: string }[];
}

// "Núcleo de Fé" - Conteúdo Imediato (Offline)
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
      { number: 11, text: "O pão nosso de cada dia nos dá hoje;" },
      { number: 12, text: "E perdoa-nos as nossas dívidas, assim como nós perdoamos aos nossos devedores;" },
      { number: 13, text: "E não nos conduzas à tentação; mas livra-nos do mal; porque teu é o reino, e o poder, e a glória, para sempre. Amém." },
      { number: 33, text: "Mas, buscai primeiro o reino de Deus, e a sua justiça, e todas estas coisas vos serão acrescentadas." }
    ]
  },
  'filipenses_4': {
    book: 'Filipenses',
    chapter: 4,
    verses: [
      { number: 4, text: "Alegrai-vos sempre no Senhor; outra vez digo, alegrai-vos." },
      { number: 6, text: "Não estejais inquietos por coisa alguma; antes as vossas petições sejam em tudo conhecidas diante de Deus pela oração e súplica, com ação de graças." },
      { number: 7, text: "E a paz de Deus, que excede todo o entendimento, guardará os vossos corações e os vossos pensamentos em Cristo Jesus." },
      { number: 13, text: "Posso todas as coisas naquele que me fortalece." }
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
      { number: 3, text: "Disse Deus: Haja luz; e houve luz." }
    ]
  }
};

const BIBLE_BOOKS: BibleBook[] = [
  { id: 'gen', name: 'Gênesis', abbreviation: 'Gn', chapters: 50, testament: 'old' },
  { id: 'exo', name: 'Êxodo', abbreviation: 'Ex', chapters: 40, testament: 'old' },
  { id: 'psa', name: 'Salmos', abbreviation: 'Sl', chapters: 150, testament: 'old' },
  { id: 'mat', name: 'Mateus', abbreviation: 'Mt', chapters: 28, testament: 'new' },
  { id: 'joa', name: 'João', abbreviation: 'Jo', chapters: 21, testament: 'new' },
  { id: 'phi', name: 'Filipenses', abbreviation: 'Fp', chapters: 4, testament: 'new' },
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
    
    // 1. Prioridade Máxima: Conteúdo Offline
    if (OFFLINE_BIBLE[key]) return OFFLINE_BIBLE[key];

    // 2. Cache Local
    const cacheKey = `bible_v2_${key}`;
    const cached = localStorage.getItem(cacheKey);
    if (cached) return JSON.parse(cached);

    // 3. Fallback IA
    try {
      const apiKey = process.env.API_KEY;
      if (!apiKey || apiKey === "undefined" || apiKey.length < 10) {
        console.error("BibleService: API_KEY inválida ou ausente.");
        return null;
      }

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
      console.error("BibleService: Erro ao carregar IA:", error);
      return null;
    }
  },

  async searchVerse(query: string) {
    try {
      const apiKey = process.env.API_KEY;
      if (!apiKey || apiKey === "undefined") return null;

      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Encontre um versículo sobre: "${query}". Retorne JSON: {"text": "...", "reference": "...", "context": "..."}`,
        config: { responseMimeType: "application/json" }
      });
      return extractJSON(response.text);
    } catch (e) { 
      return null; 
    }
  }
};