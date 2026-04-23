// src/app/oauth/callback/page.tsx
"use client";
import { useEffect } from "react";
import { createClient } from "@supabase/supabase-js";

export default function OAuthCallback() {
  useEffect(() => {
    const supa = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
    supa.auth.getSession().then(async ({ data }) => {
      const access = data.session?.access_token;
      const refresh = data.session?.refresh_token;
      if (access) {
        await fetch("/api/oauth/callback", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ access, refresh }),
        });
        window.location.replace("/"); // رجّع المستخدم للواجهة
      } else {
        window.location.replace("/login");
      }
    });
  }, []);
  return null;
}
