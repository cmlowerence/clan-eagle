import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Client for fetching data (Public)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Client for writing data (Admin Only - Server Side)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
