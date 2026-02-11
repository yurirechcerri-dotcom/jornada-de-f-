
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { ContentItem, ContentType } from '../types';

const STORAGE_KEY_PREFIX = 'jdf_content_cache_';
const APP_VERSION = '1.4.0';
const CACHE_TTL = 1000 * 60 * 60 * 24; 

interface CacheData<T> {
  version: string;
  timestamp: number;
  payload: T;
}

const THEMATIC_CONTENT: Record<string, any> = {
  gratitude_7: [
    { title: "Coração Grato", verse: "Em tudo dai graças, porque esta é a vontade de Deus.", ref: "1 Tessalonicenses 5:18", refl: "A gratidão não depende das circunstâncias, mas da visão do coração." },
    { title: "Lembrando das Bençãos", verse: "Bendize, ó minha alma, ao Senhor, e não te esqueças de nenhum de seus benefícios.", ref: "Salmos 103:2", refl: "Muitas vezes focamos no que falta e esquecemos o que já transborda." },
    { title: "Paz na Gratidão", verse: "A paz de Cristo domine em seus corações... e sejam agradecidos.", ref: "Colossenses 3:15", refl: "A paz é o fruto natural de um espírito que reconhece a bondade divina." },
    { title: "Sacrifício de Louvor", verse: "Ofereça a Deus sacrifício de louvor e paga ao Altíssimo os teus votos.", ref: "Salmos 50:14", refl: "Louve mesmo quando for difícil; o louvor quebra correntes." },
    { title: "Contentamento", verse: "Aprendi a viver contente em toda e qualquer situação.", ref: "Filipenses 4:11", refl: "Contentamento é confiar que Deus supre o necessário para o hoje." },
    { title: "Portas de Louvor", verse: "Entrai pelas portas dele com gratidão e em seus átrios com louvor.", ref: "Salmos 100:4", refl: "A gratidão é a chave que abre os portões da presença de Deus." },
    { title: "Eternidade", verse: "Dêem graças ao Senhor, porque ele é bom; o seu amor dura para sempre.", ref: "Salmos 107:1", refl: "O amor de Deus é a constante em um mundo de variáveis." }
  ],
  pardon_7: [
    { title: "Livre para Amar", verse: "Suportem-se uns aos outros e perdoem-se mutuamente.", ref: "Colossenses 3:13", refl: "O perdão é o selo de quem foi perdoado por Deus." },
    { title: "A Medida do Perdão", verse: "Não te digo até sete, mas até setenta vezes sete.", ref: "Mateus 18:22", refl: "Perdoar é uma decisão, não um sentimento passageiro." },
    { title: "Cura da Alma", verse: "Se confessarmos os nossos pecados, ele é fiel e justo para nos perdoar.", ref: "1 João 1:9", refl: "A confissão abre caminho para a restauração completa." },
    { title: "Amor que Cobre", verse: "O amor cobre multidão de pecados.", ref: "1 Pedro 4:8", refl: "Onde abunda o erro, a graça de perdoar deve superabundar." },
    { title: "Lançando Fora", verse: "Lançará todos os nossos pecados nas profundezas do mar.", ref: "Miquéias 7:19", refl: "Se Deus não se lembra mais, por que você ainda se culpa?" },
    { title: "Misericórdia", verse: "Sede misericordiosos, como também vosso Pai é misericordioso.", ref: "Lucas 6:36", refl: "A misericórdia é o reflexo mais puro do caráter de Cristo em nós." },
    { title: "Reconciliação", verse: "Deus estava em Cristo reconciliando consigo o mundo.", ref: "2 Coríntios 5:19", refl: "Fomos reconciliados para sermos embaixadores da paz." }
  ]
};

export const contentService = {
  _setCache<T>(key: string, data: T): void {
    const cacheObject: CacheData<T> = { version: APP_VERSION, timestamp: Date.now(), payload: data };
    localStorage.setItem(STORAGE_KEY_PREFIX + key, JSON.stringify(cacheObject));
  },

  _getCache<T>(key: string, ignoreTTL = false): T | null {
    const raw = localStorage.getItem(STORAGE_KEY_PREFIX + key);
    if (!raw) return null;
    try {
      const parsed: CacheData<T> = JSON.parse(raw);
      if (parsed.version !== APP_VERSION) return null;
      const isExpired = Date.now() - parsed.timestamp > CACHE_TTL;
      if (isExpired && !ignoreTTL) return null;
      return parsed.payload as T;
    } catch (e) { return null; }
  },

  async getJourneyContent(journeyId: string): Promise<ContentItem[]> {
    const freshCache = (this as any)._getCache(journeyId) as ContentItem[] | null;
    if (freshCache) return freshCache;

    try {
      let content: ContentItem[] = [];
      if (!isSupabaseConfigured()) {
        content = this._generateMockContent(journeyId);
      } else {
        const { data, error } = await supabase
          .from('content_library')
          .select('*')
          .eq('journey_id', journeyId)
          .order('day_number', { ascending: true });
        if (error) throw error;
        content = (data as ContentItem[]) || [];
      }

      if (content.length > 0) this._setCache(journeyId, content);
      return content;
    } catch (error) {
      console.error(`Erro no ContentService para ${journeyId}:`, error);
      return ((this as any)._getCache(journeyId, true) as ContentItem[] | null) || [];
    }
  },

  _generateMockContent(journeyId: string): ContentItem[] {
    const type: ContentType = journeyId.includes('21') ? '21_days' : '7_days';
    const dayCount = type === '7_days' ? 7 : 21;
    const theme = THEMATIC_CONTENT[journeyId] || THEMATIC_CONTENT['gratitude_7'];

    return Array.from({ length: dayCount }, (_, i) => {
      const themeItem = theme[i % theme.length];
      return {
        id: `mock-${journeyId}-${i + 1}`,
        journey_id: journeyId,
        type,
        day_number: i + 1,
        title: themeItem.title,
        verse: themeItem.verse,
        reference: themeItem.ref,
        reflection: themeItem.refl,
        initial_prayer: "Senhor, aquieta minha alma. Abre meus ouvidos e meu coração para o que tens a me dizer hoje através desta jornada.",
        prayer: `Pai, obrigado por falar ao meu coração hoje sobre ${themeItem.title.toLowerCase()}. Que esta semente cresça e dê frutos em minha vida. Amém.`,
        task_json: { task: `Coloque em prática o que aprendeu hoje em uma situação real da sua rotina.` }
      };
    });
  }
};
