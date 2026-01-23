
import { createClient } from '@supabase/supabase-js';

const getEnv = (key: string): string => {
  try {
    // Tenta pegar do process.env (Vercel) ou do import.meta.env (Vite local)
    return (process.env[key] || (import.meta as any).env?.[key] || '');
  } catch {
    return '';
  }
};

const supabaseUrl = getEnv('SUPABASE_URL') || 'https://placeholder.supabase.co';
const supabaseKey = getEnv('SUPABASE_ANON_KEY') || 'placeholder-key';

// O app não vai dar tela branca mesmo se o Supabase estiver desconfigurado
export const supabase = createClient(supabaseUrl, supabaseKey);

export const isSupabaseConfigured = () => {
  return supabaseUrl !== 'https://placeholder.supabase.co' && 
         supabaseKey !== 'placeholder-key' &&
         supabaseUrl.length > 10;
};
