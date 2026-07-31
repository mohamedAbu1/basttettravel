import { NextResponse } from "next/server";
import db from "@/lib/db"; // الاتصال بقاعدة البيانات

export async function POST(req) {
  try {
    const { userId, event_type, message } = await req.json();

    // 🟢 1. إدخال الإشعار في جدول notifications
    await db.query(
      "INSERT INTO notifications (id, user_id, event_type, message, is_read, created_at) VALUES (UUID(), ?, ?, ?, 0, NOW())",
      [userId, event_type, message]
    );

    // 🟢 2. جلب كل الـ tokens الخاصة بالمستخدم من جدول push_tokens
    const [rows] = await db.query("SELECT token FROM push_tokens WHERE user_id = ?", [userId]);

    // 🟢 3. إرسال Push Notification لكل الأجهزة المرتبطة بالمستخدم
    for (const row of rows) {
      const expoPushToken = row.token;
      const notificationPayload = {
        to: expoPushToken,
        sound: "default",
        title: `إشعار جديد (${event_type})`,
        body: message,
        data: { screen: "notifications", userId },
      };

      await fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify(notificationPayload),
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
