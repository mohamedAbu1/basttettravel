// app/api/auth/logout/route.js
import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.json({ message: "تم تسجيل الخروج بنجاح" });

  // ✅ حذف الكوكيز
  response.cookies.set("sb_access", "", {
    httpOnly: true,
    secure: true,
    path: "/",
    maxAge: 0, // ينتهي فورًا
  });

  return response;
}
