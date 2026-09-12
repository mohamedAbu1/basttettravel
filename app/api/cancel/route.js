import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { requireUser } from "@/lib/auth/admin";

export async function POST(req) {
  try {
    const auth = requireUser(req);
    if (auth.response) return auth.response;
    const db = await connectDB();
    const { tripId } = await req.json();

    // ✅ تحديث حالة الحجز إلى Cancelled
    const [result] = await db.query(
      `UPDATE purchases 
       SET status = 'Cancelled', updated_at = NOW() 
       WHERE trip_id = ? AND user_id = ?`,
      [tripId, auth.user.id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: "لم يتم العثور على الحجز" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("❌ Error cancelling purchase:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
