import { supabase } from "@/lib/supabaseClient";

export async function GET() {
  try {
   const { data, error } = await supabase
  .from("categories")
  .select("id, name, images")
  .order("name->>en", { ascending: true })

    // اطبع في السيرفر logs
    console.log("Supabase categories result:", data);

    if (error) {
      console.error("Supabase error:", error);
      throw error;
    }

    // اطبع في الـ response نفسه عشان يظهر في المتصفح
    return new Response(
      JSON.stringify({
        success: true,
        categories: data,
        debug: {
          length: data?.length || 0,
          sample: data?.[0] || null,
        },
      }),
      {
        status: 200,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "public, max-age=3600",
        },
      },
    );
  } catch (err) {
    console.error("API error:", err.message);

    return new Response(
      JSON.stringify({
        success: false,
        error: err.message,
        debug: "Check Supabase policies or column names",
      }),
      {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-store",
        },
      },
    );
  }
}
