"use server";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";

export async function POST(req) {
  try {
    const { userId, token } = await req.json();
    const db = await connectDB();

    // 🟢 إدخال أو تحديث الـ token (UPSERT)
    await db.query(
      `INSERT INTO push_tokens (id, user_id, token, created_at)
       VALUES (UUID(), ?, ?, NOW())
       ON DUPLICATE KEY UPDATE 
         token = VALUES(token),
         created_at = NOW()`,
      [userId, token]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
