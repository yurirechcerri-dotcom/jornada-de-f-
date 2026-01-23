
import { createClient } from '@supabase/supabase-js';

// Função para obter env de forma segura sem quebrar o build do Vite ou o Vercel
const getEnv = (key: string): string => {
  try {
    // No Vercel/Node, process.env está disponível. No Vite, import.meta.env.
    // Usamos cast para any para o TypeScript não reclamar durante o build
    const val = (process as any)?.env?.[key] || (import.meta as any).env?.[key];
    return val || '';
  } catch {
    return '';
  }
};

const supabaseUrl = getEnv('SUPABASE_URL') || 'https://placeholder-project.supabase.co';
const supabaseKey = getEnv('SUPABASE_ANON_KEY') || 'placeholder-anon-key';

export const supabase = createClient(supabaseUrl, supabaseKey);

export const isSupabaseConfigured = () => {
  return supabaseUrl !== 'https://placeholder-project.supabase.co' && 
         supabaseKey !== 'placeholder-anon-key' &&
         supabaseUrl.length > 20;
};
