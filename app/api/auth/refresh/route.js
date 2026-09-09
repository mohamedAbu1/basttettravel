// app/api/auth/refresh/route.js
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";

export async function POST(request) {
  const refreshToken = request.cookies.get("refresh-token")?.value;
  if (!refreshToken) {
    return NextResponse.json({ error: "No refresh token" }, { status: 401 });
  }

  try {
    const payload = jwt.verify(refreshToken, process.env.JWT_SECRET);
    const db = await connectDB();
    const [rows] = await db.query(
      "SELECT id, email, name, role, gender, avatar_url FROM users WHERE id = ? LIMIT 1",
      [payload.id],
    );

    if (!rows.length) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    const user = rows[0];
    const newAccessToken = jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "30d" });

    const response = NextResponse.json({ message: "Token refreshed", user });
    response.cookies.set("access-token", newAccessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 15,
    });

    return response;
  } catch {
    return NextResponse.json({ error: "Invalid refresh token" }, { status: 401 });
  }
}
