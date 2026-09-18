import { v4 as uuidv4 } from "uuid";
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { getUserToken } from "@/lib/notifications"; // 🟢 الدالة اللي تجيب التوكن
import { requireAdmin } from "@/lib/auth/admin";

// ✅ إضافة إشعار جديد + إرسال إشعار للموبايل
export async function POST(req) {
  try {
    const authorizationError = requireAdmin(req);
    if (authorizationError) return authorizationError;
    const db = await connectDB();
    const body = await req.json();
    const [[defaultAdmin]] = await db.query("SELECT id FROM users WHERE role = 'ADMIN' ORDER BY created_at ASC LIMIT 1");
    const adminId = body.admin_id || defaultAdmin?.id;
    if (!adminId) return NextResponse.json({ success: false, error: "No administrator is configured" }, { status: 503 });
    const supportedTypes = new Set(["purchase", "cancel", "rebook", "booking", "message", "review", "like", "signup"]);
    const notificationType = supportedTypes.has(body.type) ? body.type : "purchase";

    const id = uuidv4(); // توليد id فريد

    await db.execute(
      `INSERT INTO notifications 
       (id, admin_id, event_type, message, user_id, user_name, user_email, user_image, trip_id, message_id, type, created_at, is_read)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), 0)`,
      [
        id,
        adminId,
        body.event_type,
        body.message,
        body.user_id || adminId,
        body.user_name || "Basttet Travel",
        body.user_email || "",
        body.user_image || "/default-avatar.png",
        body.trip_id || null,
        body.message_id || id,
        notificationType,
      ]
    );

    // 🟢 اجلب الـ token من جدول push_tokens
    const expoPushToken = await getUserToken(body.user_id);
    if (expoPushToken) {
      // Call Expo directly. Calling our own protected route without forwarding
      // the admin cookie would always result in a 401 response.
      const pushResponse = await fetch("https://exp.host/--/api/v2/push/send", {
        method: "POST",
        headers: { Accept: "application/json", "Content-Type": "application/json" },
        body: JSON.stringify({
          to: expoPushToken,
          sound: "default",
          title: `إشعار جديد (${body.event_type || notificationType})`,
          body: body.message,
          data: { screen: "notifications", userId: body.user_id },
        }),
      });
      if (!pushResponse.ok) console.warn("Push notification was rejected by Expo");
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
export async function GET(req) {
  try {
    const authorizationError = requireAdmin(req);
    if (authorizationError) return authorizationError;
    const db = await connectDB();
    const [rows] = await db.execute(
      `SELECT id, admin_id, event_type, user_id, message, type, user_name, user_email, user_image, created_at, is_read, trip_id, comment_id, message_id
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
