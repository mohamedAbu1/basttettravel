import { v4 as uuidv4 } from "uuid";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";

// ✅ إضافة إشعار جديد
export async function POST(req) {
  try {
    const db = await connectDB();
    const body = await req.json();

    const id = uuidv4(); // توليد id فريد

await db.execute(
  `INSERT INTO notifications 
   (id, admin_id, event_type, message, user_id, user_name,type, user_email, user_image, trip_id, created_at, is_read) 
   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), 0)`,
  [
    id,
    body.admin_id,
    body.event_type,
    body.message,
    body.user_id,
    body.user_name,
    body.user_email,   // ✅ أضف هذا الحقل
    body.user_image,
    body.trip_id,
    body.type,
  ]
);




    return NextResponse.json({ success: true, id });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// ✅ جلب الإشعارات
export async function GET() {
  try {
    const db = await connectDB();
    const [rows] = await db.execute(
      `SELECT id, admin_id, event_type, user_id, message,type, user_name, user_email, user_image, created_at, is_read, trip_id 
       FROM notifications 
       ORDER BY created_at DESC`
    );

    return NextResponse.json({ success: true, notifications: rows });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
