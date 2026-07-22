import { connectDB } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";
import { NextResponse } from "next/server";

export async function POST(req) {
  const { email, name } = await req.json();
  const db = await connectDB();

  const [rows] = await db.query("SELECT id FROM users WHERE email = ?", [email]);

  if (rows.length === 0) {
    const newUserId = uuidv4();
    await db.query(
      "INSERT INTO users (id, email, name, gender, created_at) VALUES (?, ?, ?, ?, NOW())",
      [newUserId, email, name || email.split("@")[0], "unspecified"]
    );
    return NextResponse.json({ id: newUserId, email, name });
  }

  return NextResponse.json({ id: rows[0].id, email, name });
}
