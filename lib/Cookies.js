// src/lib/cookies.ts
import { cookies } from "next/headers";

export async function setSessionCookies(accessToken, refreshToken) {
  const c = await cookies();

  // ✅ أسماء الكوكيز الصحيحة اللي Supabase بيتوقعها
  c.set("access-token", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 يوم
  });

  if (refreshToken) {
    c.set("refresh-token", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 30, // 30 يوم
    });
  }
}

export async function clearSessionCookies() {
  const c = await cookies();

  // ✅ امسح الاثنين بشكل صحيح
  c.set("access-token", "", {
    path: "/",
    httpOnly: true,
    maxAge: 0,
  });

  c.set("refresh-token", "", {
    path: "/",
    httpOnly: true,
    maxAge: 0,
  });
}
