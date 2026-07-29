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

let cleanUrl = typeof rawUrl === 'string' ? rawUrl.trim().replace(/["']/g, '') : '';
const cleanKey = typeof rawKey === 'string' ? rawKey.trim().replace(/["']/g, '') : '';

// Auto-fix URL format if missing https://
if (cleanUrl) {
  if (cleanUrl.startsWith('http://')) {
    cleanUrl = cleanUrl.replace('http://', 'https://');
  } else if (!cleanUrl.startsWith('https://')) {
    cleanUrl = `https://${cleanUrl}`;
  }
}

export const getSupabaseConfigStatus = () => {
  return {
    hasUrl: Boolean(cleanUrl),
    hasKey: Boolean(cleanKey),
    isValidUrl: cleanUrl.startsWith('https://') && !cleanUrl.includes('your-project-id'),
    urlPreview: cleanUrl ? `${cleanUrl.substring(0, 25)}...` : 'Belum Diatur',
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
}

export const supabase = clientInstance;

export const testSupabaseConnection = async () => {
  if (!isSupabaseConfigured() || !supabase) {
    return { success: false, message: 'Kredensial Supabase belum terpasang di Vercel.' };
  }

  try {
    const startTime = Date.now();
    const { data, error, status, statusText } = await supabase
      .from('users')
      .select('id')
      .limit(1);

    const latency = Date.now() - startTime;

    if (error) {
      return {
        success: false,
        message: `HTTP ${status || 'Error'} (${statusText || ''}): ${error.message} ${error.hint ? `(Hint: ${error.hint})` : ''}`,
        details: error
      };
    }

    return {
      success: true,
      message: `🟢 KONEKSI TERHUBUNG! Respon Supabase: HTTP ${status} OK (${latency}ms). Database siap digunakan.`
    };
  } catch (err) {
    return {
      success: false,
      message: `❌ Gagal Terhubung ke Supabase Cloud: ${err.message || 'Network / CORS Error'}`
    };
  }
};
