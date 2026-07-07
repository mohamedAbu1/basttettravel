import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
console.log("Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
console.log("Anon Key:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);


// Frontend client (متاح في المتصفح)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);
// Admin client (backend فقط)
export const supabaseAdmin = () => {
  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseServiceRoleKey) {
    throw new Error("Supabase service role key is required.");
  }
  return createClient(supabaseUrl, supabaseServiceRoleKey);
};
