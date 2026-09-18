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
    let query = `
      SELECT reviews.*, COUNT(review_likes.id) AS likes_count
      FROM reviews
      LEFT JOIN review_likes ON review_likes.review_id = reviews.id
    `;
    let params = [];

    if (tripId) {
      query += " WHERE reviews.trip_id = ?";
      params.push(tripId);
    }

    query += " GROUP BY reviews.id ORDER BY reviews.created_at DESC";

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

    const [[admin]] = await db.query("SELECT id FROM users WHERE role = 'ADMIN' ORDER BY created_at ASC LIMIT 1");
    if (admin) {
      await db.query(
        `INSERT INTO notifications
          (id, admin_id, event_type, message, user_id, user_name, user_email, user_image, trip_id, message_id, type, created_at, is_read)
         VALUES (UUID(), ?, 'review', ?, ?, ?, ?, ?, ?, ?, 'review', NOW(), 0)`,
        [admin.id, comment.trim().slice(0, 500), user_id, auth.user.name || "Traveler", auth.user.email || "", auth.user.avatar_url || "/default-avatar.png", trip_id, reviewId],
      );
    }

    return NextResponse.json(
      { success: true, review: { id: reviewId, trip_id, user_id, rating: Number(rating), comment: comment.trim() } },
      { status: 201 }
    );
  } catch (err) {
    console.error("💥 Error in POST /api/reviews:", err.message);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
