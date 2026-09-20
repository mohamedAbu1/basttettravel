import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";
import { requireUser } from "@/lib/auth/admin";
import { safeAttachmentName, validateChatFile } from "@/lib/uploads";
import { getChatUploadRoot } from "@/lib/chatAttachments";

async function notifyAdminOfMessage(db, { messageId, userId, message }) {
  const [[admin]] = await db.query("SELECT id FROM users WHERE role = 'ADMIN' ORDER BY created_at ASC LIMIT 1");
  const [[user]] = await db.query("SELECT name, email, avatar_url FROM users WHERE id = ? LIMIT 1", [userId]);
  if (!admin || !user) return;
  await db.query(
    `INSERT INTO notifications
      (id, admin_id, event_type, message, user_id, user_name, user_email, user_image, trip_id, message_id, type, created_at, is_read)
     VALUES (UUID(), ?, 'message', ?, ?, ?, ?, ?, NULL, ?, 'message', NOW(), 0)`,
    [admin.id, message, userId, user.name, user.email, user.avatar_url || "/default-avatar.png", messageId],
  );
}

export async function POST(req) {
  try {
    const auth = requireUser(req);
    if (auth.response) return auth.response;
    const isAdmin = String(auth.user.role).toUpperCase() === "ADMIN";
    const contentType = req.headers.get("content-type") || "";

    // Attachments are stored outside the application directory and are served
    // through the authenticated file endpoint below.
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file");
      if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
      const validationError = validateChatFile(file);
      if (validationError) return NextResponse.json({ error: validationError }, { status: 400 });

      const user_id = isAdmin ? formData.get("user_id") : auth.user.id;
      if (!user_id) return NextResponse.json({ error: "user_id is required" }, { status: 400 });

      const sender_type = isAdmin && formData.get("sender_type") === "admin" ? "admin" : "user";
      const user_name = isAdmin ? formData.get("user_name") || "Admin" : auth.user.name || auth.user.email;
      const user_image = isAdmin ? formData.get("user_image") || "/default-avatar.png" : auth.user.avatar_url || "/default-avatar.png";
      const reply_to = formData.get("reply_to");
      const admin_id = isAdmin ? auth.user.id : null;
      const db = await connectDB();
      const resolvedAdminId = admin_id || (await db.query("SELECT id FROM users WHERE role = 'ADMIN' ORDER BY created_at ASC LIMIT 1"))[0][0]?.id;
      if (!resolvedAdminId) return NextResponse.json({ error: "No administrator is configured" }, { status: 503 });
      const messagesId = uuidv4();

      const storageRoot = getChatUploadRoot();
      const relativePath = path.posix.join(new Date().getUTCFullYear().toString(), String(new Date().getUTCMonth() + 1).padStart(2, "0"), `${messagesId}-${safeAttachmentName(file.name)}`);
      const storedPath = path.join(storageRoot, relativePath);
      await fs.promises.mkdir(path.dirname(storedPath), { recursive: true });
      await fs.promises.writeFile(storedPath, Buffer.from(await file.arrayBuffer()), { flag: "wx" });

      const messageType = file.type.startsWith("image/") ? "image" : "file";
      const attachmentUrl = `/api/messages/files/${messagesId}`;

      await db.query(
        `INSERT INTO messages 
         (id, user_id, content, sender_type, user_name, user_image, reply_to, admin_id, status, message_type, attachment_path, attachment_name, attachment_mime, attachment_size, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'sent', ?, ?, ?, ?, ?, NOW())`,
        [messagesId, user_id, attachmentUrl, sender_type, user_name, user_image, reply_to ?? null, resolvedAdminId, messageType, relativePath, file.name, file.type, file.size],
      );
      if (sender_type === "user") {
        await notifyAdminOfMessage(db, { messageId: messagesId, userId: user_id, message: `تم إرسال ${messageType === "image" ? "صورة" : "ملف"} جديد في المحادثة` });
      }

      const newMessage = {
        id: messagesId,
        user_id,
        content: attachmentUrl,
        sender_type,
        user_name,
        user_image,
        reply_to,
        admin_id: resolvedAdminId,
        status: "sent",
        message_type: messageType,
        attachment_name: file.name,
        attachment_mime: file.type,
        attachment_size: file.size,
        created_at: new Date(),
      };

      return NextResponse.json(newMessage, { status: 201 });
    }

    // 📌 لو الرسالة نصية
    const body = await req.json();
    const user_id = isAdmin && body.user_id ? body.user_id : auth.user.id;
    const content = body.content;
    const sender_type = isAdmin && body.sender_type === "admin" ? "admin" : "user";
    const user_name = isAdmin ? body.user_name || "Admin" : auth.user.name || auth.user.email;
    const user_image = isAdmin ? body.user_image || "/default-avatar.png" : auth.user.avatar_url || "/default-avatar.png";
    const reply_to = body.reply_to || null;
    const admin_id = isAdmin ? auth.user.id : null;

    if (!user_id) return NextResponse.json({ error: "user_id is required" }, { status: 400 });
    if (typeof content !== "string" || !content.trim() || content.length > 5000) {
      return NextResponse.json({ error: "Invalid message content" }, { status: 400 });
    }

    const db = await connectDB();
    const resolvedAdminId = admin_id || (await db.query("SELECT id FROM users WHERE role = 'ADMIN' ORDER BY created_at ASC LIMIT 1"))[0][0]?.id;
    if (!resolvedAdminId) return NextResponse.json({ error: "No administrator is configured" }, { status: 503 });
    const messagesId = uuidv4();

    await db.query(
      `INSERT INTO messages 
       (id, user_id, content, sender_type, user_name, user_image, reply_to, admin_id, status, message_type, created_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'sent', 'chat', NOW())`,
      [messagesId, user_id, content.trim(), sender_type, user_name, user_image, reply_to, resolvedAdminId],
    );
    if (sender_type === "user") {
      await notifyAdminOfMessage(db, { messageId: messagesId, userId: user_id, message: content.trim().slice(0, 500) });
    }

    const newMessage = {
      id: messagesId,
      user_id,
      content,
      sender_type,
      user_name,
      user_image,
      reply_to,
      admin_id: resolvedAdminId,
      status: "sent",
      created_at: new Date(),
    };

    return NextResponse.json(newMessage, { status: 201 });
  } catch (err) {
    console.error("❌ Error inserting message:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

export async function GET(req) {
  try {
    const auth = requireUser(req);
    if (auth.response) return auth.response;
    const isAdmin = String(auth.user.role).toUpperCase() === "ADMIN";
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const messageId = searchParams.get("messageId");

    const db = await connectDB();
    let query = `SELECT id, content, sender_type, created_at, user_name, user_image, reply_to, admin_id,user_id , status, message_type, attachment_name, attachment_mime, attachment_size
                 FROM messages`;
    let params = [];

    if (messageId) {
      query += ` WHERE id = ?`;
      params.push(messageId);
    } else if (isAdmin && userId) {
      query += ` WHERE user_id = ?`;
      params.push(userId);
    } else if (!isAdmin) {
      query += ` WHERE user_id = ?`;
      params.push(auth.user.id);
    }

    query += ` ORDER BY created_at ASC`;

    const [rows] = await db.query(query, params);

    const visibleRows = isAdmin ? rows : rows.filter((row) => String(row.user_id) === String(auth.user.id));
    return NextResponse.json(visibleRows, { status: 200 });
  } catch (err) {
    console.error("❌ Error fetching messages:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ✅ تحديث حالة الرسالة
export async function PUT(req) {
  try {
    const auth = requireUser(req);
    if (auth.response) return auth.response;
    let body = {};
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid or empty JSON body" },
        { status: 400 },
      );
    }

    const { messageId, status = "seen" } = body;
    if (!messageId || !["sent", "seen"].includes(status)) {
      return NextResponse.json({ error: "Invalid message update" }, { status: 400 });
    }

    const db = await connectDB();
    const [messages] = await db.query("SELECT user_id, sender_type FROM messages WHERE id = ?", [messageId]);
    if (!messages.length) return NextResponse.json({ error: "Message not found" }, { status: 404 });
    const isAdmin = String(auth.user.role).toUpperCase() === "ADMIN";
    const isRecipient = isAdmin
      ? messages[0].sender_type === "user"
      : messages[0].sender_type === "admin" && String(messages[0].user_id) === String(auth.user.id);
    if (!isRecipient) return NextResponse.json({ error: "Only the recipient can mark this message as seen" }, { status: 403 });
    const [result] = await db.query(
      `UPDATE messages SET status = ?, updated_at = NOW() WHERE id = ?`,
      [status, messageId],
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Message updated successfully!" },
      { status: 200 },
    );
  } catch (err) {
    console.error("❌ Error updating message:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ✅ حذف رسالة
export async function DELETE(req) {
  try {
    const auth = requireUser(req);
    if (auth.response) return auth.response;
    let body = {};
    try {
      body = await req.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid or empty JSON body" },
        { status: 400 },
      );
    }

    const { messageId } = body;
    if (!messageId) return NextResponse.json({ error: "messageId is required" }, { status: 400 });

    const db = await connectDB();
    const [messages] = await db.query("SELECT user_id FROM messages WHERE id = ?", [messageId]);
    if (!messages.length) return NextResponse.json({ error: "Message not found" }, { status: 404 });
    const canDelete = String(auth.user.role).toUpperCase() === "ADMIN" || String(messages[0].user_id) === String(auth.user.id);
    if (!canDelete) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    const [result] = await db.query(`DELETE FROM messages WHERE id = ?`, [
      messageId,
    ]);

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "Message deleted successfully!" },
      { status: 200 },
    );
  } catch (err) {
    console.error("❌ Error deleting message:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
