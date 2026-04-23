// app/api/auth/confirm/route.js
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const token = searchParams.get("sb_access");

  if (!token) {
    return NextResponse.redirect(new URL("/en/login?error=missing_token", req.url));
  }

  // تحقق من التوكين في قاعدة البيانات
  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("confirm_token", token)
    .single();

  if (error || !data) {
    return NextResponse.redirect(new URL("/en/login?error=invalid_token", req.url));
  }

  // تحديث حالة المستخدم
  await supabase
    .from("users")
    .update({ confirmed: true })
    .eq("id", data.id);

  return NextResponse.redirect(new URL("/en/login?confirmed=true", req.url));
}
