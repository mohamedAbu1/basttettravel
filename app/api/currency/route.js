import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";

export async function GET() {
  try {
    const db = await connectDB();
    const [rows] = await db.query("SELECT * FROM currency_rates");
    return NextResponse.json(rows, { status: 200 });
  } catch (error) {
    console.error("GET /currency Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req) {
  try {
    const { id, rate } = await req.json();
    if (!id) {
      return NextResponse.json({ error: "Missing ID" }, { status: 400 });
    }

    const db = await connectDB();
    await db.query(
      `UPDATE currency_rates SET rate = ?, updated_at = NOW() WHERE id = ?`,
      [rate, id]
    );

    return NextResponse.json({ message: "Rate updated successfully!" }, { status: 200 });
  } catch (error) {
    console.error("PUT /currency Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
