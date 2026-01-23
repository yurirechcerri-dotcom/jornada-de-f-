
import { createClient } from '@supabase/supabase-js';

// Função ultra-segura para ler variáveis de ambiente sem quebrar o runtime
const safeGetEnv = (key: string): string | undefined => {
  try {
    return (window as any).process?.env?.[key] || (process as any)?.env?.[key];
  } catch (e) {
    return undefined;
  }
};

const supabaseUrl = safeGetEnv('SUPABASE_URL') || 'https://placeholder.supabase.co';
const supabaseKey = safeGetEnv('SUPABASE_ANON_KEY') || 'placeholder-key';

// O cliente é criado. Se as chaves forem as de placeholder, as chamadas falharão graciosamente,
// mas o aplicativo (UI) continuará funcionando e carregando.
export const supabase = createClient(supabaseUrl, supabaseKey);

export const isSupabaseConfigured = () => {
  return supabaseUrl !== 'https://placeholder.supabase.co' && supabaseKey !== 'placeholder-key';
};
