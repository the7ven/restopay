import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// On utilise createBrowserClient pour que les cookies de session 
// soient partagés entre le navigateur et le Middleware
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey);