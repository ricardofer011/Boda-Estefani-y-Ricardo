import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    supabaseUrl &&
    supabaseAnonKey &&
    supabaseUrl.startsWith('https://') &&
    !supabaseUrl.includes('tu-proyecto') &&
    !supabaseUrl.includes('xyzcompany')
  );
};

let clientInstance: SupabaseClient | null = null;

/**
 * Cliente anónimo de Supabase para operaciones del navegador y públicas
 */
export function getSupabaseClient(): SupabaseClient | null {
  if (!isSupabaseConfigured()) {
    return null;
  }
  if (!clientInstance && supabaseUrl && supabaseAnonKey) {
    clientInstance = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false },
    });
  }
  return clientInstance;
}

/**
 * Cliente de administración (Server-side únicamente)
 * Utiliza la clave service_role para operaciones administrativas en API routes
 */
export function getSupabaseAdmin(): SupabaseClient | null {
  if (!isSupabaseConfigured()) {
    return null;
  }
  const keyToUse = supabaseServiceKey || supabaseAnonKey;
  if (!keyToUse || !supabaseUrl) return null;
  
  return createClient(supabaseUrl, keyToUse, {
    auth: { persistSession: false },
  });
}
