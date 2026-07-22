// app/api/auth/confirm/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db"; // دالة الاتصال بقاعدة MySQL

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const token = searchParams.get("sb_access");

    if (!token) {
      return NextResponse.redirect(new URL("/en/login?error=missing_token", req.url));
    }

    const db = await connectDB();

    // ✅ تحقق من التوكين في جدول users
    const [rows] = await db.query(
      "SELECT * FROM users WHERE confirm_token = ? LIMIT 1",
      [token]
    );

    if (rows.length === 0) {
      return NextResponse.redirect(new URL("/en/login?error=invalid_token", req.url));
    }

    const user = rows[0];

    // ✅ تحديث حالة المستخدم
    await db.query("UPDATE users SET confirmed = 1 WHERE id = ?", [user.id]);

    return NextResponse.redirect(new URL("/en/login?confirmed=true", req.url));
  } catch (err) {
    console.error("❌ Error confirming user:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
