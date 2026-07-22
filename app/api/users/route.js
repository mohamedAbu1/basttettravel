import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";

export async function GET() {
  try {
    const db = await connectDB();

    // ✅ استعلام كل المستخدمين
    const [rows] = await db.query(
      "SELECT id, name, email, role,avatar_url, created_at FROM users",
    );

    return NextResponse.json({ success: true, users: rows }, { status: 200 });
  } catch (err) {
    console.error("❌ Error fetching users:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 },
    );
  }
}
