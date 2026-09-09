// /app/api/update-status/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db"; // ملف الاتصال بقاعدة بيانات MySQL
import { requireAdmin } from "@/lib/auth/admin";

export async function POST(req) {
  const authorizationError = requireAdmin(req);
  if (authorizationError) return authorizationError;

  try {
    const { purchaseId, status } = await req.json();
    const allowedStatuses = ["pending", "confirmed", "cancelled", "completed", "rejected"];

    if (!purchaseId || !allowedStatuses.includes(String(status).toLowerCase())) {
      return NextResponse.json({ error: "Invalid purchase ID or status" }, { status: 400 });
    }

    const db = await connectDB();

    // ✅ تحديث حالة الحجز
    const [result] = await db.query(
      `UPDATE purchases 
       SET status = ?, updated_at = NOW() 
       WHERE id = ?`,
      [status, purchaseId]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "Purchase not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 400 });
  }
}
