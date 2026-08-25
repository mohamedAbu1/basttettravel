import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

export async function POST(req) {
  try {
    const body = await req.json();
    const db = await connectDB();

    const bookingId = uuidv4();

    await db.query(
      `INSERT INTO booking (id, trip_id, persons, children, check_in, check_out, status, platform) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        bookingId,
        body.trip_id,
        body.participants,
        body.childrenCount,
        body.checkIn,
        body.checkOut,
        "pending", // الحالة الافتراضية
        "web"      // المنصة
      ]
    );

    return NextResponse.json({ success: true, bookingId }, { status: 201 });
  } catch (err) {
    console.error("❌ [POST Booking] Exception:", err.message);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
