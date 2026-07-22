import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";

// ✅ جلب رسالة واحدة بالـ id
export async function GET(req, { params }) {
  try {
    const { id } = params;
    const db = await connectDB();

    const [rows] = await db.query("SELECT * FROM messages WHERE id = ?", [id]);

    if (rows.length === 0) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    return NextResponse.json(rows[0], { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// ✅ تحديث حالة الرسالة بالـ id
export async function PUT(req, { params }) {
  try {
    const { id } = params;
    const { status = "seen" } = await req.json();

    const db = await connectDB();
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
export async function DELETE(req, { params }) {
  try {
    const { id } = params;
    const db = await connectDB();

    const [result] = await db.query("DELETE FROM messages WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return NextResponse.json({ error: "Message not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Message deleted successfully!" }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
