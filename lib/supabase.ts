
import { createClient } from '@supabase/supabase-js';

// Função auxiliar para obter variáveis de ambiente com segurança no navegador
const getEnv = (key: string): string | undefined => {
  try {
    return (process as any).env[key];
  } catch (e) {
    return undefined;
  }
};

const supabaseUrl = (getEnv('SUPABASE_URL') || 'https://placeholder.supabase.co') as string;
const supabaseKey = (getEnv('SUPABASE_ANON_KEY') || 'placeholder-key') as string;

export const supabase = createClient(supabaseUrl, supabaseKey);

export const isSupabaseConfigured = () => {
  return supabaseUrl !== 'https://placeholder.supabase.co' && supabaseKey !== 'placeholder-key';
};
