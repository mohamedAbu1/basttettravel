import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/admin";

// ✅ تحديث حالة الإشعار إلى مقروء
export async function PUT(req, { params }) {
  try {
    const authorizationError = requireAdmin(req);
    if (authorizationError) return authorizationError;
    const db = await connectDB();
    const { id } = params; // نأخذ id من الرابط

    await db.execute("UPDATE notifications SET is_read = 1 WHERE id = ?", [id]);

    return NextResponse.json({ success: true, message: "تم تحديث الإشعار إلى مقروء" });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
