import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db"; // الاتصال بقاعدة البيانات
import { requireUser } from "@/lib/auth/admin";

export async function POST(req) {
  try {
    const auth = requireUser(req);
    if (auth.response) return auth.response;
    const { event_type, message } = await req.json();
    const userId = auth.user.id;
    const db = await connectDB();

    // 🟢 1. إدخال الإشعار في جدول notifications
    const [[admin]] = await db.query("SELECT id FROM users WHERE role = 'ADMIN' ORDER BY created_at ASC LIMIT 1");
    const [[user]] = await db.query("SELECT name, email, avatar_url FROM users WHERE id = ? LIMIT 1", [userId]);
    if (!admin || !user) return NextResponse.json({ success: false, error: "User or administrator not found" }, { status: 404 });
    await db.query(
      `INSERT INTO notifications
        (id, admin_id, user_id, event_type, message, user_name, user_email, user_image,
         trip_id, message_id, type, is_read, created_at)
       VALUES (UUID(), ?, ?, ?, ?, ?, ?, ?, NULL, UUID(), 'message', 0, NOW())`,
      [admin.id, userId, event_type || "message", message, user.name, user.email, user.avatar_url || "/default-avatar.png"]
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
