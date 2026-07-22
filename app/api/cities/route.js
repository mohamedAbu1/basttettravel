import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";

export async function GET() {
  try {
    const db = await connectDB();
    const [rows] = await db.execute("SELECT id, name, images FROM cities ORDER BY id ASC");
    return NextResponse.json({ success: true, cities: rows });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
