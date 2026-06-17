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

// Map de apelidos e abreviações comuns para todos os 66 livros da Bíblia
const BOOK_ALIASES: Record<string, string[]> = {
  '1': ['genesis', 'gn', 'genesis'],
  '2': ['exodo', 'ex', 'exodo'],
  '3': ['levitico', 'lv', 'levitico'],
  '4': ['numeros', 'nm', 'num'],
  '5': ['deuteronomio', 'dt', 'deut'],
  '6': ['josue', 'js', 'jos'],
  '7': ['juizes', 'jz', 'juiz'],
  '8': ['rute', 'rt', 'rut'],
  '9': ['1samuel', '1sm', '1sam'],
  '10': ['2samuel', '2sm', '2sam'],
  '11': ['1reis', '1rs', '1re'],
  '12': ['2reis', '2rs', '2re'],
  '13': ['1cronicas', '1cr', '1cron'],
  '14': ['2cronicas', '2cr', '2cron'],
  '15': ['esdras', 'ed', 'esd'],
  '16': ['neemias', 'ne', 'neem'],
  '17': ['ester', 'et', 'est'],
  '18': ['jo', 'job', 'jo'],
  '19': ['salmos', 'sl', 'salmo', 'psalms', 'ps'],
  '20': ['provérbios', 'prov', 'proverbios', 'pv'],
  '21': ['eclesiastes', 'ec', 'ecl'],
  '22': ['canticos', 'ct', 'cantico', 'cantares', 'canticos'],
  '23': ['isaias', 'is', 'isa'],
  '24': ['jeremias', 'jr', 'jer'],
  '25': ['lamentacoes', 'lm', 'lam'],
  '26': ['ezequiel', 'ez', 'ezeq'],
  '27': ['daniel', 'dn', 'dan'],
  '28': ['oseias', 'os', 'ose'],
  '29': ['joel', 'jl'],
  '30': ['amos', 'am'],
  '31': ['obadias', 'ob'],
  '32': ['jonas', 'jon'],
  '33': ['miqueias', 'mq', 'miq'],
  '34': ['naum', 'na'],
  '35': ['habacuque', 'hb', 'hab'],
  '36': ['sofonias', 'sf', 'sof'],
  '37': ['ageu', 'ag'],
  '38': ['zacarias', 'zac', 'zc'],
  '39': ['malaquias', 'ml', 'mal'],
  '40': ['mateus', 'mt', 'mat'],
  '41': ['marcos', 'mc', 'marc'],
  '42': ['lucas', 'lc', 'luc'],
  '43': ['joao', 'jo', 'john'],
  '44': ['atos', 'at', 'acts'],
  '45': ['romanos', 'rm', 'rom'],
  '46': ['1corintios', '1co', '1cor', '1corintios'],
  '47': ['2corintios', '2co', '2cor', '2corintios'],
  '48': ['galatas', 'gl', 'gal'],
  '49': ['efesios', 'ef', 'efe', 'efesios'],
  '50': ['filipenses', 'fp', 'fil'],
  '51': ['colossenses', 'cl', 'col'],
  '52': ['1tessalonicenses', '1ts', '1tess'],
  '53': ['2tessalonicenses', '2ts', '2tess'],
  '54': ['1timoteo', '1tm', '1tim'],
  '55': ['2timoteo', '2tm', '2tim'],
  '56': ['tito', 'tt', 'tit'],
  '57': ['filemom', 'fm', 'film'],
  '58': ['hebreus', 'hb', 'heb'],
  '59': ['tiago', 'tg', 'tiag', 'james'],
  '60': ['1pedro', '1pe', '1ped'],
  '61': ['2pedro', '2pe', '2ped'],
  '62': ['1joao', '1jo', '1john'],
  '63': ['2joao', '2jo', '2john'],
  '64': ['3joao', '3jo', '3john'],
  '65': ['judas', 'jd', 'jud'],
  '66': ['apocalipse', 'ap', 'apoc', 'revelation', 'rev']
};

export interface SearchVerseResult {
  text: string;
  reference: string;
  bookId: string;
  bookName: string;
  chapter: number;
  verse: number;
}

export function normalizeString(str: string): string {
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // remove acentos
    .replace(/[^a-z0-9]/g, ''); // remove tudo exceto letras e números
}

export function findBookByInput(input: string): BibleBook | undefined {
  const normalizedInput = normalizeString(input);
  if (!normalizedInput) return undefined;

  return BIBLE_BOOKS.find(b => {
    const normName = normalizeString(b.name);
    const normAbbr = normalizeString(b.abbreviation);
    const aliases = BOOK_ALIASES[b.id] || [];
    return normName === normalizedInput || normAbbr === normalizedInput || aliases.includes(normalizedInput);
  });
}

export interface ParsedQuery {
  type: 'reference' | 'book' | 'keyword';
  book?: BibleBook;
  chapter?: number;
  verse?: number;
}

let localBibleData: any[] | null = null;

async function loadLocalBible(): Promise<any[]> {
  if (localBibleData) return localBibleData;
  try {
    const res = await fetch('/bible-pt.json');
    if (!res.ok) {
      throw new Error(`Failed to load local Bible file: ${res.statusText}`);
    }
    localBibleData = await res.json();
    return localBibleData || [];
  } catch (err) {
    console.error("Failed to load local bible JSON:", err);
    return [];
  }
}

export const bibleService = {
  getBooks() {
    return BIBLE_BOOKS;
  },

  parseQuery(query: string): ParsedQuery {
    const clean = query.trim().replace(/\s+/g, ' ');
    if (!clean) return { type: 'keyword' };

    // Regex para capturar: (Opcional número seguido de espaço ou não) (Nome do livro) (Capítulo) (Opcional separador e Versículo)
    // Suporta "João 3:16", "1 João 5:1", "Gênesis 1", "Sl 23", "Efésios 6 10"
    const refRegex = /^([123]\s*[a-zA-ZáéíóúÁÉÍÓÚçÇ]+|[a-zA-ZáéíóúÁÉÍÓÚçÇ\s+]+?)\s+(\d+)(?:\s*[:\s-]\s*(\d+))?$/i;
    const match = clean.match(refRegex);

    if (match) {
      const bookInput = match[1].trim();
      const chapter = parseInt(match[2], 10);
      const verse = match[3] ? parseInt(match[3], 10) : undefined;

      const book = findBookByInput(bookInput);
      if (book && chapter >= 1 && chapter <= book.chapters) {
        return {
          type: 'reference',
          book,
          chapter,
          verse
        };
      }
    }

    // Tenta encontrar apenas pelo nome do livro (ex: "Efésios", "Gênesis")
    const bookOnly = findBookByInput(clean);
    if (bookOnly) {
      return {
        type: 'book',
        book: bookOnly
      };
    }

    return { type: 'keyword' };
  },

  async getChapterText(bookName: string, chapter: number): Promise<BibleChapter | null> {
    const book = BIBLE_BOOKS.find(b => b.name === bookName);
    if (!book) return null;

    // 1. Tenta carregar do JSON Local (Offline total)
    try {
      const bible = await loadLocalBible();
      if (bible && bible.length > 0) {
        const bookIndex = BIBLE_BOOKS.findIndex(b => b.name === bookName);
        const bookData = bible[bookIndex];
        if (bookData && bookData.chapters && bookData.chapters[chapter - 1]) {
          const chapterVerses = bookData.chapters[chapter - 1];
          return {
            book: bookName,
            chapter: chapter,
            verses: chapterVerses.map((vText: string, vIdx: number) => ({
              number: vIdx + 1,
              text: vText
            }))
          };
        }
      }
    } catch (error) {
      console.error("Erro ao carregar do JSON local:", error);
    }

    // 2. Fallback: Conteúdo pré-definido offline do "Núcleo de Fé"
    const key = `${bookName.toLowerCase()}_${chapter}`;
    if (OFFLINE_BIBLE[key]) return OFFLINE_BIBLE[key];

    return null;
  },

  async searchVerse(query: string): Promise<SearchVerseResult[]> {
    const bible = await loadLocalBible();
    if (!bible || bible.length === 0) {
      return [];
    }

    const normalizedQuery = normalizeString(query);
    if (!normalizedQuery) return [];

    const results: SearchVerseResult[] = [];
    
    // Varre todos os livros da Bíblia de forma ultra rápida em memória offline
    for (let bookIndex = 0; bookIndex < bible.length; bookIndex++) {
      const bookData = bible[bookIndex];
      const bookObj = BIBLE_BOOKS[bookIndex];
      if (!bookObj) continue;

      for (let chapterIndex = 0; chapterIndex < bookData.chapters.length; chapterIndex++) {
        const chapterArr = bookData.chapters[chapterIndex];
        for (let verseIndex = 0; verseIndex < chapterArr.length; verseIndex++) {
          const verseText = chapterArr[verseIndex];
          const normalizedVerse = normalizeString(verseText);
          
          if (normalizedVerse.includes(normalizedQuery)) {
            results.push({
              text: verseText,
              reference: `${bookObj.name} ${chapterIndex + 1}:${verseIndex + 1}`,
              bookId: bookObj.id,
              bookName: bookObj.name,
              chapter: chapterIndex + 1,
              verse: verseIndex + 1
            });
            
            // Limita a 50 resultados para excelente performance e legibilidade
            if (results.length >= 50) {
              return results;
            }
          }
        }
      }
    }

    return results;
  }
};
