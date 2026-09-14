import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { requireUser } from "@/lib/auth/admin";

export async function POST(req) {
  try {
    const auth = requireUser(req);
    if (auth.response) return auth.response;
    const { userId: requestedUserId, isTyping, adminTyping } = await req.json();
    const isAdmin = String(auth.user.role).toUpperCase() === "ADMIN";
    const userId = isAdmin && requestedUserId ? requestedUserId : auth.user.id;
    if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });
    const db = await connectDB();
    if (isAdmin) {
      await db.query(`INSERT INTO conversation_typing (user_id, user_typing, admin_typing, user_updated_at, admin_updated_at, updated_at) VALUES (?, 0, ?, NULL, NOW(), NOW()) ON DUPLICATE KEY UPDATE admin_typing = VALUES(admin_typing), admin_updated_at = NOW(), updated_at = NOW()`, [userId, adminTyping ?? false]);
    } else {
      await db.query(`INSERT INTO conversation_typing (user_id, user_typing, admin_typing, user_updated_at, admin_updated_at, updated_at) VALUES (?, ?, 0, NOW(), NULL, NOW()) ON DUPLICATE KEY UPDATE user_typing = VALUES(user_typing), user_updated_at = NOW(), updated_at = NOW()`, [userId, Boolean(isTyping)]);
    }
    return NextResponse.json({ success: true, userId });
  } catch (error) {
    console.error("Typing status update failed:", error.message);
    return NextResponse.json({ error: "Unable to update typing status" }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const auth = requireUser(req);
    if (auth.response) return auth.response;
    const { searchParams } = new URL(req.url);
    const requestedUserId = searchParams.get("userId");
    const isAdmin = String(auth.user.role).toUpperCase() === "ADMIN";
    const userId = isAdmin && requestedUserId ? requestedUserId : auth.user.id;
    if (!userId) return NextResponse.json({ error: "userId required" }, { status: 400 });
    const db = await connectDB();
    const [[row]] = await db.query("SELECT user_typing, admin_typing, user_updated_at, admin_updated_at, user_updated_at >= DATE_SUB(NOW(), INTERVAL 8 SECOND) AS user_active, admin_updated_at >= DATE_SUB(NOW(), INTERVAL 8 SECOND) AS admin_active FROM conversation_typing WHERE user_id = ? LIMIT 1", [userId]);
    if (!row) return NextResponse.json({ userId, isTyping: false, adminTyping: false });
    return NextResponse.json({ userId, isTyping: Boolean(row.user_typing && row.user_active), adminTyping: Boolean(row.admin_typing && row.admin_active) });
  } catch (error) {
    console.error("Typing status read failed:", error.message);
    return NextResponse.json({ error: "Unable to read typing status" }, { status: 500 });
  }
}
