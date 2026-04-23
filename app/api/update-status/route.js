// /app/api/update-status/route.js
import { createClient } from "@supabase/supabase-js";

export async function POST(req) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY // ✅ استخدم Service Role Key
  );

  const { purchaseId, status } = await req.json();

  const { error } = await supabase
    .from("purchases")
    .update({ status, updated_at: new Date() })
    .eq("id", purchaseId);

  if (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 400 });
  }

  return new Response(JSON.stringify({ success: true }), { status: 200 });
}
