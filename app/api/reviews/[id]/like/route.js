// src/app/api/reviews/[id]/likes/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";

// ✅ إضافة لايك
export async function POST(req, { params }) {
  try {
    const body = await req.json();
    const { user_id } = body; // ⚠️ هنا لازم تجيب user_id من نظام الـ Auth عندك
    const reviewId = params.id;

    if (!user_id) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const db = await connectDB();
    await db.query(
      `INSERT INTO review_likes (review_id, user_id, created_at) VALUES (?, ?, NOW())`,
      [reviewId, user_id]
    );

    return NextResponse.json({ ok: true, message: "Like added successfully" }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 400 });
  }
}

// ✅ إزالة لايك
export async function DELETE(req, { params }) {
  try {
    const body = await req.json();
    const { user_id } = body; // ⚠️ نفس الشيء: لازم تجيب user_id من الـ Auth
    const reviewId = params.id;

    if (!user_id) {
      return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
    }

    const db = await connectDB();
    await db.query(
      `DELETE FROM review_likes WHERE review_id = ? AND user_id = ?`,
      [reviewId, user_id]
    );

    return NextResponse.json({ ok: true, message: "Like removed successfully" }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 400 });
  }
}

// ✅ جلب عدد اللايكات
export async function GET(req, { params }) {
  try {
    const reviewId = params.id;
    const db = await connectDB();

    const [rows] = await db.query(
      `SELECT user_id FROM review_likes WHERE review_id = ?`,
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
