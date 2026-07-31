import { v4 as uuidv4 } from "uuid";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getUserToken } from "@/lib/notifications"; // 🟢 الدالة اللي تجيب التوكن

// ✅ إضافة إشعار جديد + إرسال إشعار للموبايل
export async function POST(req) {
  try {
    const db = await connectDB();
    const body = await req.json();

    const id = uuidv4(); // توليد id فريد

    await db.execute(
      `INSERT INTO notifications 
       (id, admin_id, event_type, message, user_id, user_name, user_email, user_image, trip_id, type, created_at, is_read) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), 0)`,
      [
        id,
        body.admin_id,
        body.event_type,
        body.message,
        body.user_id,
        body.user_name,
        body.user_email,
        body.user_image,
        body.trip_id,
        body.type,
      ]
    );

    // 🟢 اجلب الـ token من جدول push_tokens
    const expoPushToken = await getUserToken(body.user_id);
    if (expoPushToken) {
      // 🟢 استدعاء API Route send-notification
      await fetch("https://basttettravel.com/api/send-notification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          expoPushToken,
          title: `إشعار جديد (${body.event_type})`,
          bodyText: body.message,
        }),
      });
    }

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
      `SELECT id, admin_id, event_type, user_id, message, type, user_name, user_email, user_image, created_at, is_read, trip_id 
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
