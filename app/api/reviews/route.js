import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { v4 as uuidv4 } from "uuid"; // ✅ استدعاء مكتبة uuid

// ✅ جلب التعليقات
export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const tripId = searchParams.get("tripId");

    const db = await connectDB();
    let query = "SELECT * FROM reviews";
    let params = [];

    if (tripId) {
      query += " WHERE trip_id = ?";
      params.push(tripId);
    }

    query += " ORDER BY created_at DESC";

    const [rows] = await db.query(query, params);

    return NextResponse.json({ success: true, reviews: rows }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 400 });
  }
}

// ✅ إضافة تعليق جديد
export async function POST(req) {
  try {
    const body = await req.json();
    const { trip_id, user_id, rating, comment, name, avatar_url, time } = body;

    const db = await connectDB();
    const reviewId = uuidv4(); // ✅ توليد ID فريد للتعليق

    await db.query(
      `INSERT INTO reviews 
       (id, trip_id, user_id, rating, comment, name, avatar_url, time, created_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [reviewId, trip_id, user_id, rating, comment, name, avatar_url, time]
    );

    return NextResponse.json(
      { success: true, review: { id: reviewId, ...body } },
      { status: 201 }
    );
  } catch (err) {
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
