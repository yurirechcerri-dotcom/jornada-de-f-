
import { createClient } from '@supabase/supabase-js';

// Função para obter env de forma segura
const getEnv = (key: string): string => {
  try {
    const val = (process as any)?.env?.[key] || (import.meta as any).env?.[key];
    return val || '';
  } catch {
    return '';
  }
};

// URL fornecida pelo usuário: https://fttsxnetcgqqnnotuori.supabase.co
const supabaseUrl = getEnv('SUPABASE_URL') || 'https://fttsxnetcgqqnnotuori.supabase.co';
// Chave anon fornecida: d0c48b5f-5a3e-4a5f-bd15-e6c1214f30f7
const supabaseKey = getEnv('SUPABASE_ANON_KEY') || 'd0c48b5f-5a3e-4a5f-bd15-e6c1214f30f7';

export const supabase = createClient(supabaseUrl, supabaseKey);

export const isSupabaseConfigured = () => {
  return supabaseUrl.includes('fttsxnetcgqqnnotuori') && 
         supabaseKey !== 'placeholder-anon-key' &&
         supabaseKey !== '';
};
