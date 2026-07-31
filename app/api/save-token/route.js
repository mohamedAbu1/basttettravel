import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";

export async function POST(req) {
  try {
    const { userId, token } = await req.json();
      const db = await connectDB();

    // لو عمود في users
    // await db.query("UPDATE users SET push_token = ? WHERE id = ?", [token, userId]);

    // أو لو جدول مستقل
    await db.query("INSERT INTO push_tokens (id, user_id, token) VALUES (UUID(), ?, ?)", [userId, token]);

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
