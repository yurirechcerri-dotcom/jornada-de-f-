import { createClient } from '@supabase/supabase-js';

const getEnv = (key: string): string => {
  const env = (import.meta as any).env;
  const proc = (window as any).process?.env;
  return (env?.[`VITE_${key}`] || env?.[key] || proc?.[`VITE_${key}`] || proc?.[key] || '').trim();
};

const rawUrl = getEnv('SUPABASE_URL');
const rawKey = getEnv('SUPABASE_ANON_KEY');

// Só considera configurado se tiverem valores reais (não placeholders)
const isConfigured = rawUrl.startsWith('http') && rawKey.length > 50;

export const supabase = createClient(
  isConfigured ? rawUrl : 'https://placeholder-project.supabase.co',
  isConfigured ? rawKey : 'placeholder-key-long-enough-to-not-throw-immediately'
);

export const isSupabaseConfigured = () => isConfigured;

export const getLocalSession = () => {
  try {
    const session = localStorage.getItem('jdf_local_session');
    return session ? JSON.parse(session) : null;
  } catch {
    return null;
  }
};

export const setLocalSession = (user: any) => {
  localStorage.setItem('jdf_local_session', JSON.stringify({ 
    user, 
    expires_at: Date.now() + 1000 * 60 * 60 * 24 * 30 
  }));
};

export const clearLocalSession = () => {
  localStorage.removeItem('jdf_local_session');
};