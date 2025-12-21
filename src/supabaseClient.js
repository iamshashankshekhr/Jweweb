import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Only initialize if we have a valid URL (basic check)
const isConfigured = supabaseUrl && supabaseUrl.startsWith('http');

export const supabase = isConfigured
    ? createClient(supabaseUrl, supabaseKey)
    : null;

if (!isConfigured) {
    console.warn('Supabase is not configured. Authentication features will be disabled.');
}
