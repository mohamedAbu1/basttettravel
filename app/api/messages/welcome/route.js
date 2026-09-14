import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { requireUser } from "@/lib/auth/admin";
import { v4 as uuidv4 } from "uuid";

const WELCOME_MESSAGE = "👋 Hello and welcome! The Basttet Travel team is excited to help you plan your next unforgettable journey. How can we assist you today?";

export async function POST(req) {
  try {
    const auth = requireUser(req);
    if (auth.response) return auth.response;
    if (String(auth.user.role).toUpperCase() === "ADMIN") {
      return NextResponse.json({ success: false, error: "Welcome messages are for travelers only" }, { status: 403 });
    }

    const db = await connectDB();
    const [[existing]] = await db.query(
      "SELECT id, user_id, content, sender_type, user_name, user_image, admin_id, status, message_type, created_at FROM messages WHERE user_id = ? AND message_type = 'welcome' LIMIT 1",
      [auth.user.id],
    );
    if (existing) return NextResponse.json({ success: true, created: false, message: existing });

    const [[admin]] = await db.query("SELECT id FROM users WHERE role = 'ADMIN' ORDER BY created_at ASC LIMIT 1");
    if (!admin) return NextResponse.json({ success: false, error: "No administrator is configured" }, { status: 503 });

    const id = uuidv4();
    await db.query(
      `INSERT INTO messages
        (id, user_id, content, sender_type, user_name, user_image, reply_to, admin_id, status, message_type, created_at)
       VALUES (?, ?, ?, 'admin', 'Basttet Travel', '/brand/basttet-travel-mark-dark.svg', NULL, ?, 'sent', 'welcome', NOW())`,
      [id, auth.user.id, WELCOME_MESSAGE, admin.id],
    );

    const [[message]] = await db.query(
      "SELECT id, user_id, content, sender_type, user_name, user_image, admin_id, status, message_type, created_at FROM messages WHERE id = ?",
      [id],
    );
    return NextResponse.json({ success: true, created: true, message }, { status: 201 });
  } catch (error) {
    console.error("Welcome message failed:", error.message);
    return NextResponse.json({ success: false, error: "Unable to create welcome message" }, { status: 500 });
  }
}
