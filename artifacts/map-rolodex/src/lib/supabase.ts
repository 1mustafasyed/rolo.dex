import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const configurationError = !url || !key
  ? 'Supabase is not configured. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY for this frontend.'
  : null;

export const supabase = createClient(
  url || 'https://missing-configuration.supabase.co',
  key || 'missing-configuration',
  { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } },
);