import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseClient";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    // تسجيل الدخول عبر Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 401 });
    }

    const user = data.user;
    const session = data.session;

    // حفظ التوكينات في الكوكيز
    const response = NextResponse.json({
      message: "تم تسجيل الدخول بنجاح",
      user,
      session, // نرجع الـ session للـ client
    });

    response.cookies.set("sb_access", session.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 15, // 15 دقيقة
    });

    response.cookies.set("sb_refresh", session.refresh_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 يوم
    });

    return response;
  } catch (e) {
    return NextResponse.json({ error: "خطأ داخلي" }, { status: 500 });
  }
}
