
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { ContentItem, ContentType } from '../types';

const STORAGE_KEY_PREFIX = 'jornada_fe_cache_';
const CACHE_VERSION = 'v1.2.0'; // Sincronizado com a versão do App
const CACHE_TTL = 1000 * 60 * 60 * 12; // 12 horas em milissegundos

interface CacheWrapper<T> {
  version: string;
  timestamp: number;
  data: T;
}

export const contentService = {
  /**
   * Gerencia o armazenamento em cache com versionamento e TTL
   */
  _saveToCache<T>(key: string, data: T): void {
    const wrapper: CacheWrapper<T> = {
      version: CACHE_VERSION,
      timestamp: Date.now(),
      data
    };
    localStorage.setItem(STORAGE_KEY_PREFIX + key, JSON.stringify(wrapper));
  },

  /**
   * Recupera dados do cache validando versão e expiração
   */
  _getFromCache<T>(key: string): T | null {
    const cached = localStorage.getItem(STORAGE_KEY_PREFIX + key);
    if (!cached) return null;

    try {
      const wrapper: CacheWrapper<T> = JSON.parse(cached);
      
      // Invalida se for versão diferente
      if (wrapper.version !== CACHE_VERSION) {
        localStorage.removeItem(STORAGE_KEY_PREFIX + key);
        return null;
      }

      // Verifica se expirou
      const isExpired = Date.now() - wrapper.timestamp > CACHE_TTL;
      if (isExpired) {
        console.log(`Cache para ${key} expirado, tentando revalidar...`);
        return null; // Retorna null para forçar fetch, mas poderíamos retornar dados se estivéssemos offline
      }

      return wrapper.data;
    } catch (e) {
      console.error("Erro ao ler cache", e);
      return null;
    }
  },

  async getJourneyContent(journeyId: string): Promise<ContentItem[]> {
    // 1. Tenta pegar do cache (Válido e não expirado)
    // Fix: Removed explicit type argument to avoid "Untyped function calls" error due to 'this' inference in object literal
    const cachedData = this._getFromCache(journeyId) as ContentItem[] | null;
    if (cachedData) {
      return cachedData;
    }

    // 2. Se não houver cache ou estiver expirado, tenta buscar na fonte (Supabase ou Mock)
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
        content = data || [];
      }

      // 3. Salva o novo conteúdo no cache
      this._saveToCache(journeyId, content);
      return content;

    } catch (error) {
      console.error(`Erro ao carregar conteúdo para ${journeyId}:`, error);
      
      // 4. Fallback de emergência: se falhar a rede, tenta o cache mesmo que expirado
      const emergencyCache = localStorage.getItem(STORAGE_KEY_PREFIX + journeyId);
      if (emergencyCache) {
        try {
          const wrapper: CacheWrapper<ContentItem[]> = JSON.parse(emergencyCache);
          console.warn("Usando cache expirado como fallback devido a erro de rede.");
          return wrapper.data;
        } catch (e) {
          return [];
        }
      }
      
      return [];
    }
  },

  /**
   * Gerador de conteúdo Mock (Mantido para desenvolvimento/offline sem Supabase)
   */
  _generateMockContent(journeyId: string): ContentItem[] {
    const themeContents: Record<string, { titles: string[], verses: {t: string, r: string}[], tasks: string[] }> = {
      'gratitude_7': {
        titles: ["Despertar da Gratidão", "Beleza no Simples", "O Pão Nosso", "Graça Imerecida", "Coração Contente", "Legado de Gratidão", "Viver em Agradecimento"],
        verses: [
          { t: "Em tudo dai graças.", r: "1 Tess. 5:18" },
          { t: "Bom é louvar ao Senhor.", r: "Salmos 92:1" },
          { t: "Bendize, ó minha alma, ao Senhor.", r: "Salmos 103:1" },
          { t: "A tua graça me basta.", r: "2 Cor. 12:9" },
          { t: "O Senhor é bom.", r: "Salmos 100:5" },
          { t: "Grande é a tua fidelidade.", r: "Lam. 3:23" },
          { t: "Damos graças, ó Deus.", r: "Salmos 75:1" }
        ],
        tasks: ["Liste 5 pequenas bênçãos.", "Agradeça a alguém hoje.", "Ore apenas agradecendo.", "Observe a natureza.", "Escreva uma carta de gratidão.", "Sorria para um estranho.", "Medite no Salmo 100."]
      },
      // Outros temas omitidos para brevidade, mas mantidos na lógica real
    };

    const theme = themeContents[journeyId] || themeContents['gratitude_7'];
    const type: ContentType = journeyId.includes('21') ? '21_days' : '7_days';
    const dayCount = type === '7_days' ? 7 : 21;

    return Array.from({ length: dayCount }, (_, i) => ({
      id: `mock-${journeyId}-${i + 1}`,
      journey_id: journeyId,
      type,
      day_number: i + 1,
      title: theme.titles[i % theme.titles.length] || `Dia ${i+1}`,
      verse: theme.verses[i % theme.verses.length]?.t || "O Senhor é bom.",
      reference: theme.verses[i % theme.verses.length]?.r || "Salmos 100:5",
      reflection: `Reflexão profunda para o dia ${i + 1}.`,
      prayer: `Oração para o dia ${i + 1}.`,
      task_json: { task: theme.tasks[i % theme.tasks.length] || "Ore hoje." }
    }));
  },

  /**
   * Limpa todo o cache de conteúdo (útil para logout ou reset manual)
   */
  clearAllCache(): void {
    Object.keys(localStorage)
      .filter(key => key.startsWith(STORAGE_KEY_PREFIX))
      .forEach(key => localStorage.removeItem(key));
  }
};
