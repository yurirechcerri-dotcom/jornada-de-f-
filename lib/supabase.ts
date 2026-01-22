
import { createClient } from '@supabase/supabase-js';

// No ambiente de demonstração, essas variáveis seriam injetadas.
// Se não houver chaves reais, o app deve lidar com isso graciosamente.
const supabaseUrl = (process.env.SUPABASE_URL || 'https://placeholder.supabase.co') as string;
const supabaseKey = (process.env.SUPABASE_ANON_KEY || 'placeholder-key') as string;

export const supabase = createClient(supabaseUrl, supabaseKey);

// Helper para verificar se o Supabase está configurado corretamente
export const isSupabaseConfigured = () => {
  return supabaseUrl !== 'https://placeholder.supabase.co' && supabaseKey !== 'placeholder-key';
};
