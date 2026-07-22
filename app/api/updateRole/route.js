import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";

export async function POST(req) {
  try {
    const { userId, newRole } = await req.json();
    const db = await connectDB();

    // ✅ تحديث الدور في قاعدة البيانات
    await db.query("UPDATE users SET role = ? WHERE id = ?", [newRole, userId]);

    // ✅ رجع استجابة واضحة
    return NextResponse.json(
      { success: true, role: newRole, userId },
      { status: 200 }
    );
  } catch (err) {
    console.error("❌ Error updating role:", err);
    return NextResponse.json(
      { success: false, error: err.message },
      { status: 500 }
    );
  }
}
