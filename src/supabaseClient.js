import { createClient } from '@supabase/supabase-js';

const rawUrl = import.meta.env.VITE_SUPABASE_URL || '';
const rawKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

const cleanUrl = typeof rawUrl === 'string' ? rawUrl.trim().replace(/["']/g, '') : '';
const cleanKey = typeof rawKey === 'string' ? rawKey.trim().replace(/["']/g, '') : '';

export const isSupabaseConfigured = () => {
  return Boolean(
    cleanUrl &&
    cleanKey &&
    cleanUrl.startsWith('https://') &&
    !cleanUrl.includes('your-project-id')
  );
};

let clientInstance = null;

if (isSupabaseConfigured()) {
  try {
    clientInstance = createClient(cleanUrl, cleanKey);
  } catch (err) {
    console.error('⚠️ Supabase client creation error:', err);
    clientInstance = null;
  }
} else {
  console.warn('⚠️ Supabase credentials not set or invalid. Running in Local Storage fallback mode.');
}

export const supabase = clientInstance;
