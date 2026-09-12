import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { v4 as uuidv4 } from "uuid"; 
import { requireUser } from "@/lib/auth/admin";

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
    const auth = requireUser(req);
    if (auth.response) return auth.response;

    const body = await req.json();

    const { trip_id, rating, comment, time } = body;
    const user_id = auth.user.id;
    if (!trip_id || !Number.isFinite(Number(rating)) || Number(rating) < 1 || Number(rating) > 5) {
      return NextResponse.json({ success: false, error: "Invalid review data" }, { status: 400 });
    }
    if (typeof comment !== "string" || comment.trim().length < 2 || comment.length > 2000) {
      return NextResponse.json({ success: false, error: "Invalid review comment" }, { status: 400 });
    }

    const db = await connectDB();

    const reviewId = uuidv4();

    const query = `
      INSERT INTO reviews 
      (id, trip_id, user_id, rating, comment, name, avatar_url, time, created_at) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;
    const params = [reviewId, trip_id, user_id, Number(rating), comment.trim(), auth.user.name || auth.user.email, auth.user.avatar_url || null, time || null];

    await db.query(query, params);

    return NextResponse.json(
      { success: true, review: { id: reviewId, trip_id, user_id, rating: Number(rating), comment: comment.trim() } },
      { status: 201 }
    );
  } catch (err) {
    console.error("💥 Error in POST /api/reviews:", err.message);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
