
import { createClient } from '@supabase/supabase-js';

// No Vite, variáveis de ambiente devem começar com VITE_
const getEnv = (key: string): string => {
  const env = (import.meta as any).env;
  const proc = (window as any).process?.env;
  
  return env?.[`VITE_${key}`] || env?.[key] || proc?.[`VITE_${key}`] || proc?.[key] || '';
};

const supabaseUrl = getEnv('SUPABASE_URL') || 'https://fttsxnetcgqqnnotuori.supabase.co';

/**
 * IMPORTANTE: O erro "supabaseKey is required" ocorre quando esta variável é uma string vazia.
 * Se você não configurou a variável de ambiente VITE_SUPABASE_ANON_KEY, 
 * a aplicação usará o valor abaixo como fallback para evitar o crash inicial.
 */
const supabaseKey = getEnv('SUPABASE_ANON_KEY') || 'd0c48b5f-5a3e-4a5f-bd15-e6c1214f30f7';

// Inicializa o cliente. Se a chave acima não for um JWT válido, 
// as chamadas de API retornarão 401 (Unauthorized), que tratamos na tela de Login.
export const supabase = createClient(supabaseUrl, supabaseKey);

export const isSupabaseConfigured = () => {
  // Uma chave anon válida do Supabase (JWT) é muito longa (geralmente > 100 caracteres).
  // A chave 'd0c48b5f...' é apenas o ID do projeto e não serve para autenticação.
  return supabaseKey.length > 50;
};
