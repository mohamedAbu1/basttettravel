import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/admin";

export async function POST(req) {
  const authorizationError = requireAdmin(req);
  if (authorizationError) return authorizationError;

  try {
    const { userId, newRole } = await req.json();
    const normalizedRole = String(newRole || "").toUpperCase();

    if (!userId || !["ADMIN", "USER"].includes(normalizedRole)) {
      return NextResponse.json(
        { success: false, error: "Invalid user ID or role" },
        { status: 400 },
      );
    }

    const db = await connectDB();

    // ✅ تحديث الدور في قاعدة البيانات
    await db.query("UPDATE users SET role = ? WHERE id = ?", [normalizedRole, userId]);

    // ✅ رجع استجابة واضحة
    return NextResponse.json(
      { success: true, role: normalizedRole, userId },
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
