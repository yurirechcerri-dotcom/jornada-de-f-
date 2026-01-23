
import { createClient } from '@supabase/supabase-js';

const getEnv = (key: string): string => {
  const env = (import.meta as any).env;
  const proc = (window as any).process?.env;
  return (env?.[`VITE_${key}`] || env?.[key] || proc?.[`VITE_${key}`] || proc?.[key] || '').trim();
};

const rawUrl = getEnv('SUPABASE_URL');
const rawKey = getEnv('SUPABASE_ANON_KEY');

// Só tenta configurar se as chaves parecerem reais
const isConfigured = rawUrl.startsWith('http') && rawKey.length > 60;

export const supabase = createClient(
  isConfigured ? rawUrl : 'https://placeholder.supabase.co',
  isConfigured ? rawKey : 'placeholder-key'
);

export const isSupabaseConfigured = () => isConfigured;

// Helper para gerenciar sessão local quando o Supabase falha
export const getLocalSession = () => {
  const session = localStorage.getItem('jdf_local_session');
  return session ? JSON.parse(session) : null;
};

export const setLocalSession = (user: any) => {
  localStorage.setItem('jdf_local_session', JSON.stringify({ user, expires_at: Date.now() + 1000 * 60 * 60 * 24 * 30 }));
};

export const clearLocalSession = () => {
  localStorage.removeItem('jdf_local_session');
};
