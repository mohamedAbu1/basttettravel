import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { requireUser } from "@/lib/auth/admin";

// ✅ جلب رسالة واحدة بالـ id
export async function GET(req, context) {
  try {
    const auth = requireUser(req);
    if (auth.response) return auth.response;
    const { id } = await context.params;
    const db = await connectDB();

    const [rows] = await db.query(
      "SELECT id, content, sender_type, created_at, user_name, user_image, reply_to, admin_id, user_id, status, message_type, attachment_name, attachment_mime, attachment_size FROM messages WHERE id = ?",
      [id],
    );

    if (rows.length === 0) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    const message = rows[0];
    const isAdmin = String(auth.user.role).toUpperCase() === "ADMIN";
    if (!isAdmin && String(message.user_id) !== String(auth.user.id)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    return NextResponse.json(message, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ✅ تحديث حالة الرسالة بالـ id
export async function PUT(req, context) {
  try {
    const auth = requireUser(req);
    if (auth.response) return auth.response;
    const { id } = await context.params;
    const { status = "seen" } = await req.json();
    if (!["sent", "seen"].includes(status)) {
      return NextResponse.json({ error: "Invalid message status" }, { status: 400 });
    }

    const db = await connectDB();
    const [[message]] = await db.query(
      "SELECT user_id, sender_type FROM messages WHERE id = ?",
      [id],
    );
    if (!message) return NextResponse.json({ error: "Message not found" }, { status: 404 });

    const isAdmin = String(auth.user.role).toUpperCase() === "ADMIN";
    const isRecipient = isAdmin
      ? message.sender_type === "user"
      : message.sender_type === "admin" && String(message.user_id) === String(auth.user.id);
    if (!isRecipient) {
      return NextResponse.json({ error: "Only the recipient can mark this message as seen" }, { status: 403 });
    }

    const [result] = await db.query(
      "UPDATE messages SET status = ?, updated_at = NOW() WHERE id = ?",
      [status, id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Message updated successfully!" }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ✅ حذف رسالة بالـ id
export async function DELETE(req, context) {
  try {
    const auth = requireUser(req);
    if (auth.response) return auth.response;
    const { id } = await context.params;
    const db = await connectDB();

    const [[message]] = await db.query("SELECT user_id FROM messages WHERE id = ?", [id]);
    if (!message) return NextResponse.json({ error: "Message not found" }, { status: 404 });
    const canDelete = String(auth.user.role).toUpperCase() === "ADMIN"
      || String(message.user_id) === String(auth.user.id);
    if (!canDelete) return NextResponse.json({ error: "Forbidden" }, { status: 403 });

    const [result] = await db.query("DELETE FROM messages WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Message deleted successfully!" }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
