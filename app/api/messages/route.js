import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";
import fs from "fs";
import path from "path";

export async function POST(req) {
  try {
    const contentType = req.headers.get("content-type") || "";

    // 📌 لو الرسالة صورة
    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const file = formData.get("file");
      if (!file) return NextResponse.json({ error: "No file uploaded" }, { status: 400 });

      // اسم فريد للصورة
      const fileName = `${Date.now()}-${file.name}`;
      const baseUrl = `https://basttettravel.com/iamges/${fileName}`; // صححت iamges → iamges

      // مسار المشروع المحلي
      const projectPath = path.join(process.cwd(), "public/iamges", fileName);

      // مسار الاستضافة
      const hostingPath = `/home/u984684626/public_html/iamges/${fileName}`;

      // تجهيز المجلدات
      await fs.promises.mkdir(path.dirname(projectPath), { recursive: true });
      await fs.promises.mkdir(path.dirname(hostingPath), { recursive: true });

      // تحويل الملف إلى buffer
      const buffer = Buffer.from(await file.arrayBuffer());

      // حفظ نسخة في المشروع
      await fs.promises.writeFile(projectPath, buffer);

      // حفظ نسخة في الاستضافة
      await fs.promises.writeFile(hostingPath, buffer);

      // باقي البيانات
      const user_id = formData.get("user_id");
      if (!user_id) return NextResponse.json({ error: "user_id is required" }, { status: 400 });

      const sender_type = formData.get("sender_type") || "admin";
      const user_name = formData.get("user_name") || "Admin";
      const user_image = formData.get("user_image") || "/default-avatar.png";
      const reply_to = formData.get("reply_to");
      const admin_id = formData.get("admin_id") || null;

      const db = await connectDB();
      const messagesId = uuidv4();

      await db.query(
        `INSERT INTO messages 
         (id, user_id, content, sender_type, user_name, user_image, reply_to, admin_id, status, created_at) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'sent', NOW())`,
        [messagesId, user_id, baseUrl, sender_type, user_name, user_image, reply_to ?? null, admin_id],
      );

      const newMessage = {
        id: messagesId,
        user_id,
        content: baseUrl,
        sender_type,
        user_name,
        user_image,
        reply_to,
        admin_id,
        status: "sent",
        created_at: new Date(),
      };

      return NextResponse.json(newMessage, { status: 201 });
    }

    // 📌 لو الرسالة نصية
    const body = await req.json();
    const { user_id, content, sender_type = "user", user_name = "Unknown User", user_image = "/default-avatar.png", reply_to = null, admin_id = null } = body;

    if (!user_id) return NextResponse.json({ error: "user_id is required" }, { status: 400 });
    if (!content) return NextResponse.json({ error: "Content cannot be null" }, { status: 400 });

    const db = await connectDB();
    const messagesId = uuidv4();

    await db.query(
      `INSERT INTO messages 
       (id, user_id, content, sender_type, user_name, user_image, reply_to, admin_id, status, created_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'sent', NOW())`,
      [messagesId, user_id, content, sender_type, user_name, user_image, reply_to, admin_id],
    );

    const newMessage = {
      id: messagesId,
      user_id,
      content,
      sender_type,
      user_name,
      user_image,
      reply_to,
      admin_id,
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
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const messageId = searchParams.get("messageId");

    const db = await connectDB();
    let query = `SELECT id, content, sender_type, created_at, user_name, user_image, reply_to, admin_id,user_id , status 
                 FROM messages`;
    let params = [];

    if (messageId) {
      query += ` WHERE id = ?`;
      params.push(messageId);
    } else if (userId) {
      query += ` WHERE user_id = ?`;
      params.push(userId);
    }

    query += ` ORDER BY created_at ASC`;

    const [rows] = await db.query(query, params);

    return NextResponse.json(rows, { status: 200 });
  } catch (err) {
    console.error("❌ Error fetching messages:", err.message);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ✅ تحديث حالة الرسالة
export async function PUT(req) {
  try {
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

    const db = await connectDB();
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

    const db = await connectDB();
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
