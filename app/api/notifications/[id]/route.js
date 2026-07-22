import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";


export async function DELETE(req, { params }) {
  try {
    const db = await connectDB();
    const { id } = params; // نأخذ id من الرابط مثل /api/notifications/[id]

    await db.execute("DELETE FROM notifications WHERE id = ?", [id]);

    return NextResponse.json({ success: true, message: "تم حذف الإشعار بنجاح" });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}