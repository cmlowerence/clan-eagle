import { createClient } from '@supabase/supabase-js';

// 1. Get Environment Variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

// 2. Debugging (Visible in Eruda Console)
if (!supabaseUrl || !supabaseAnonKey) {
  console.error("CRITICAL: Supabase Environment Variables are missing!");
  console.log("NEXT_PUBLIC_SUPABASE_URL:", supabaseUrl ? "Set" : "Missing");
  console.log("NEXT_PUBLIC_SUPABASE_ANON_KEY:", supabaseAnonKey ? "Set" : "Missing");
}

// 3. Safe Client Creation (Prevents app crash if keys missing)
// We provide dummy values so the app renders, but data fetching will just fail gracefully
export const supabase = createClient(
  supabaseUrl || "https://placeholder.supabase.co", 
  supabaseAnonKey || "placeholder-key"
);

// 4. Admin Client (Server-Side Only)
// Only initialize this if the key exists to avoid server crashes
export const supabaseAdmin = supabaseServiceKey 
  ? createClient(supabaseUrl || "", supabaseServiceKey) 
  : null as any;
