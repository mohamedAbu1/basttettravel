import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";

export async function POST(req) {
  try {
    const db = await connectDB();
    const { tripId, userId } = await req.json();

    // ✅ تحديث حالة الحجز إلى Cancelled
    const [result] = await db.query(
      `UPDATE purchases 
       SET status = 'Cancelled', updated_at = NOW() 
       WHERE trip_id = ? AND user_id = ?`,
      [tripId, userId]
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
