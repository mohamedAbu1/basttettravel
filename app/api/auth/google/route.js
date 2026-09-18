import { connectDB } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import jwt from "jsonwebtoken";
import { authOptions } from "../[...nextauth]/route";
import { setAuthCookies } from "@/lib/auth/admin";

export async function POST() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Google authentication required" }, { status: 401 });
  }

  const email = session.user.email.trim().toLowerCase();
  const name = session.user.name;
  if (!process.env.JWT_SECRET) {
    return NextResponse.json({ error: "Authentication is not configured" }, { status: 500 });
  }

  const db = await connectDB();

  const [rows] = await db.query("SELECT id, email, name, role, gender, avatar_url FROM users WHERE LOWER(email) = ? LIMIT 1", [email]);

  if (rows.length === 0) {
    const newUserId = uuidv4();
    await db.query(
      "INSERT INTO users (id, email, name, gender, role, avatar_url, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())",
      [newUserId, email, name || email.split("@")[0], "other", "USER", session.user.image || null]
    );
    rows.push({ id: newUserId, email, name: name || email.split("@")[0], role: "USER", gender: "other", avatar_url: session.user.image || null });
  }

  const user = rows[0];
  const accessToken = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "15m" });
  const refreshToken = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "30d" });
  const response = NextResponse.json({ user }, { status: 200 });
  return setAuthCookies(response, accessToken, refreshToken);
}
