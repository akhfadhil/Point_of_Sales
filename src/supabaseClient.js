import { createClient } from '@supabase/supabase-js';

const rawUrl =
  import.meta.env.VITE_SUPABASE_URL ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_URL ||
  import.meta.env.SUPABASE_URL ||
  '';

const rawKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY ||
  import.meta.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  import.meta.env.SUPABASE_ANON_KEY ||
  import.meta.env.SUPABASE_KEY ||
  '';

const cleanUrl = typeof rawUrl === 'string' ? rawUrl.trim().replace(/["']/g, '') : '';
const cleanKey = typeof rawKey === 'string' ? rawKey.trim().replace(/["']/g, '') : '';

export const getSupabaseConfigStatus = () => {
  return {
    hasUrl: Boolean(cleanUrl),
    hasKey: Boolean(cleanKey),
    isValidUrl: cleanUrl.startsWith('https://') && !cleanUrl.includes('your-project-id'),
    urlPreview: cleanUrl ? `${cleanUrl.substring(0, 20)}...` : 'Belum Diatur',
    keyPreview: cleanKey ? `${cleanKey.substring(0, 10)}...` : 'Belum Diatur'
  };
};

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
  console.warn('⚠️ Supabase credentials missing/invalid. Running in Local Storage fallback mode.');
}

export const supabase = clientInstance;
