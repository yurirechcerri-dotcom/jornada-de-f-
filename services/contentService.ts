
import { supabase, isSupabaseConfigured } from '../lib/supabase';
import { ContentItem, ContentType } from '../types';

const STORAGE_KEY_PREFIX = 'jdf_content_cache_';
const APP_VERSION = '1.2.0';
const CACHE_TTL = 1000 * 60 * 60 * 12; // 12 Horas

interface CacheData<T> {
  version: string;
  timestamp: number;
  payload: T;
}

export const contentService = {
  /**
   * Helper para salvar dados com envelope de metadados
   */
  _setCache<T>(key: string, data: T): void {
    const cacheObject: CacheData<T> = {
      version: APP_VERSION,
      timestamp: Date.now(),
      payload: data
    };
    localStorage.setItem(STORAGE_KEY_PREFIX + key, JSON.stringify(cacheObject));
  },

  /**
   * Helper para recuperar dados validando TTL e Versão
   */
  _getCache<T>(key: string, ignoreTTL = false): T | null {
    const raw = localStorage.getItem(STORAGE_KEY_PREFIX + key);
    if (!raw) return null;

    try {
      const parsed: CacheData<T> = JSON.parse(raw);
      
      // Invalida se for versão diferente do App
      if (parsed.version !== APP_VERSION) return null;

      // Verifica expiração
      const isExpired = Date.now() - parsed.timestamp > CACHE_TTL;
      if (isExpired && !ignoreTTL) return null;

      return parsed.payload;
    } catch (e) {
      return null;
    }
  },

  async getJourneyContent(journeyId: string): Promise<ContentItem[]> {
    // Usamos 'contentService' em vez de 'this' para evitar erros de tipagem do TS em objetos literais
    const freshCache = contentService._getCache<ContentItem[]>(journeyId);
    if (freshCache) return freshCache;

    try {
      let content: ContentItem[] = [];

      if (!isSupabaseConfigured()) {
        content = contentService._generateMockContent(journeyId);
      } else {
        const { data, error } = await supabase
          .from('content_library')
          .select('*')
          .eq('journey_id', journeyId)
          .order('day_number', { ascending: true });

        if (error) throw error;
        content = data || [];
      }

      if (content.length > 0) {
        contentService._setCache(journeyId, content);
      }
      return content;

    } catch (error) {
      console.error(`Erro no ContentService para ${journeyId}:`, error);
      
      // Fallback offline (mesmo que expirado)
      const staleCache = contentService._getCache<ContentItem[]>(journeyId, true);
      if (staleCache) return staleCache;
      
      return [];
    }
  },

  _generateMockContent(journeyId: string): ContentItem[] {
    const type: ContentType = journeyId.includes('21') ? '21_days' : '7_days';
    const dayCount = type === '7_days' ? 7 : 21;

    return Array.from({ length: dayCount }, (_, i) => ({
      id: `mock-${journeyId}-${i + 1}`,
      journey_id: journeyId,
      type,
      day_number: i + 1,
      title: `Dia ${i + 1}`,
      verse: "O Senhor é o meu pastor, nada me faltará.",
      reference: "Salmos 23:1",
      reflection: "Uma palavra de encorajamento para fortalecer sua alma nesta caminhada.",
      prayer: "Senhor, guia meus passos hoje e enche meu coração com Tua paz.",
      task_json: { task: "Dedique 5 minutos ao silêncio hoje e ouça a voz do Espírito." }
    }));
  },

  clearContentCache(): void {
    Object.keys(localStorage)
      .filter(key => key.startsWith(STORAGE_KEY_PREFIX))
      .forEach(key => localStorage.removeItem(key));
  }
};
