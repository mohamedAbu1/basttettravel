import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { requireUser } from "@/lib/auth/admin";

// ✅ جلب اللايكات
export async function GET(req, context) {
  try {
    const { id: reviewId } = await context.params;
    if (!reviewId) return NextResponse.json({ ok: false, error: "Missing review id" }, { status: 400 });
    const db = await connectDB();
    const [rows] = await db.query(
      "SELECT user_id FROM review_likes WHERE review_id = ?",
      [reviewId]
    );

    return NextResponse.json({
      ok: true,
      count: rows.length,
      users: rows.map((r) => r.user_id),
    });
  } catch (err) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 400 });
  }
}


// ✅ إضافة لايك
export async function POST(req, context) {
  try {
    const auth = requireUser(req);
    if (auth.response) return auth.response;
    const { id: reviewId } = await context.params;
    if (!reviewId) return NextResponse.json({ ok: false, error: "Missing review id" }, { status: 400 });

    const user_id = auth.user.id;
    const db = await connectDB();
    const [reviewRows] = await db.query(
      "SELECT trip_id FROM reviews WHERE id = ? LIMIT 1",
      [reviewId]
    );

    if (!reviewRows.length || !reviewRows[0].trip_id) {
      return NextResponse.json({ ok: false, error: "Review not found" }, { status: 404 });
    }

    const trip_id = reviewRows[0].trip_id;
    const [existingLikes] = await db.query(
      "SELECT id FROM review_likes WHERE review_id = ? AND user_id = ? LIMIT 1",
      [reviewId, user_id]
    );

    if (existingLikes.length) {
      return NextResponse.json({ ok: true, liked: true, alreadyLiked: true }, { status: 200 });
    }

    await db.query(
      "INSERT INTO review_likes (id, review_id, trip_id, user_id, created_at) VALUES (UUID(), ?, ?, ?, NOW()) ON DUPLICATE KEY UPDATE trip_id = ?",
      [reviewId, trip_id, user_id, trip_id]
    );

    return NextResponse.json({ ok: true, liked: true }, { status: 200 });
  } catch (err) {
    console.error("❌ Error adding like:", err);
    return NextResponse.json({ ok: false, error: "Unable to save like" }, { status: 500 });
  }
}



// ✅ إزالة لايك
export async function DELETE(req, context) {
  try {
    const auth = requireUser(req);
    if (auth.response) return auth.response;
    const { id: reviewId } = await context.params;
    if (!reviewId) return NextResponse.json({ ok: false, error: "Missing review id" }, { status: 400 });
    const user_id = auth.user.id;

    const db = await connectDB();
    await db.query(
      "DELETE FROM review_likes WHERE review_id = ? AND user_id = ?",
      [reviewId, user_id]
    );

    return NextResponse.json({ ok: true, liked: false }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 400 });
  }
}

