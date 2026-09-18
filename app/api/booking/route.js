import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";
import { requireUser } from "@/lib/auth/admin";

export async function POST(req) {
  try {
    const auth = requireUser(req);
    if (auth.response) return auth.response;
    const body = await req.json();
    const participants = Number(body.participants);
    const childrenCount = Number(body.childrenCount || 0);
    const checkIn = String(body.checkIn || "");
    const checkOut = String(body.checkOut || "");
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    if (!body.trip_id || !checkIn || !checkOut || !Number.isInteger(participants) || participants < 1
      || !Number.isInteger(childrenCount) || childrenCount < 0
      || Number.isNaN(checkInDate.getTime()) || Number.isNaN(checkOutDate.getTime())
      || checkOutDate <= checkInDate) {
      return NextResponse.json({ success: false, error: "Missing booking data" }, { status: 400 });
    }
    const db = await connectDB();
    const [[trip]] = await db.query("SELECT id FROM trips WHERE id = ? LIMIT 1", [body.trip_id]);
    if (!trip) return NextResponse.json({ success: false, error: "Trip not found" }, { status: 404 });

    const bookingId = uuidv4();

    await db.query(
      `INSERT INTO booking (id, trip_id, persons, children, check_in, check_out, status, platform) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        bookingId,
        body.trip_id,
        participants,
        childrenCount,
        checkIn,
        checkOut,
        "pending", // الحالة الافتراضية
        "web"
      ]
    );

    const [[admin]] = await db.query("SELECT id FROM users WHERE role = 'ADMIN' ORDER BY created_at ASC LIMIT 1");
    const [[traveler]] = await db.query("SELECT name, email, avatar_url FROM users WHERE id = ? LIMIT 1", [auth.user.id]);
    if (admin && traveler) {
      await db.query(
        `INSERT INTO notifications
          (id, admin_id, event_type, message, user_id, user_name, user_email, user_image,
           trip_id, message_id, type, created_at, is_read)
         VALUES (UUID(), ?, 'booking', ?, ?, ?, ?, ?, ?, UUID(), 'booking', NOW(), 0)`,
        [
          admin.id,
          `Booking created for trip ${body.trip_id}`,
          auth.user.id,
          traveler.name,
          traveler.email,
          traveler.avatar_url || "/default-avatar.png",
          body.trip_id,
        ],
      );
    }

    return NextResponse.json({ success: true, bookingId }, { status: 201 });
  } catch (err) {
    console.error("❌ [POST Booking] Exception:", err.message);
    return NextResponse.json({ success: false, error: "Unable to create booking" }, { status: 500 });
  }
}
