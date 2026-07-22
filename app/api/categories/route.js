import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";

export async function GET() {
  try {

    const db = await connectDB();

    const [rows] = await db.execute("SELECT * FROM categories ORDER BY name ASC");

    return NextResponse.json({ success: true, categories: rows });
  } catch (error) {
    console.error("❌ Database error:", error.message);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
