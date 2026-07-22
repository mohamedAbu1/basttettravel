// file: app/api/auth/logout/route.js
import { NextResponse } from "next/server";

export async function POST() {
  try {
    // ✅ مسح الكوكيز الخاصة بالجلسة
    const response = NextResponse.json({ message: "Logged out successfully" });

    response.cookies.set("access-token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 0,
    });

    response.cookies.set("refresh-token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 0,
    });

    return response;
  } catch (err) {
    console.error("Logout Error:", err);
    return NextResponse.json({ error: "Unexpected error" }, { status: 500 });
  }
}
