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

let supabaseInstance: any = null;

try {
  const finalUrl = isConfigured ? rawUrl : 'https://placeholder-project.supabase.co';
  const finalKey = isConfigured ? rawKey : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBsYWNlaG9sZGVyIiwicm9sZSI6ImFub24iLCJpYXQiOjE2MjY4MDAwMDAsImV4cCI6MTkyNzgwMDAwMH0.signature-placeholder';
  
  supabaseInstance = createClient(finalUrl, finalKey);
} catch (err) {
  console.error("Failed to initialize Supabase client:", err);
  // Fallback mock safe object to prevent app crashes when Supabase is not configured
  supabaseInstance = {
    auth: {
      getSession: async () => ({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
      signUp: async () => ({ data: { session: null }, error: new Error("Supabase is not configured yet.") }),
      signInWithPassword: async () => ({ data: { session: null }, error: new Error("Supabase is not configured yet.") }),
    },
    from: () => ({
      select: () => ({
        eq: () => ({
          single: async () => ({ data: null, error: new Error("Supabase is not configured.") }),
          order: () => ({ data: [], error: null }),
          limit: () => ({ data: [], error: null })
        }),
        order: () => ({
          limit: () => ({ data: [], error: null })
        })
      }),
      insert: () => ({
        select: () => ({
          single: async () => ({ data: null, error: new Error("Supabase is not configured.") })
        })
      }),
      upsert: () => ({
        select: () => ({
          single: async () => ({ data: null, error: new Error("Supabase is not configured.") })
        })
      })
    })
  };
}

export const supabase = supabaseInstance;

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