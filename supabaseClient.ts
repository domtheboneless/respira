
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Helper to safely get env vars without crashing in browser
const getEnv = (key: string) => {
  try {
    if (typeof process !== 'undefined' && process.env) {
      return process.env[key];
    }
  } catch (e) {
    // Ignore error
  }
  return undefined;
};

// Use provided credentials or fallback to env vars
// Note: In a real production app, these should be environment variables.
const supabaseUrl = getEnv('SUPABASE_URL') || 'https://qrqoezasisfbsnqlvoef.supabase.co';
const supabaseAnonKey = getEnv('SUPABASE_ANON_KEY') || 'sb_publishable_Udwxh9fPUK2DdY4DzHiAWA_lSvqeM6P';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// Initialize the client
export const supabase: SupabaseClient = createClient(supabaseUrl, supabaseAnonKey);
