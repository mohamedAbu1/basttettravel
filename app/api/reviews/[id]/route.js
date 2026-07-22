// src/app/api/reviews/[id]/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";

// ✅ GET: جلب تعليق واحد
export async function GET(req, { params }) {
  try {
    const reviewId = params.id;
    const db = await connectDB();

    const [rows] = await db.query("SELECT * FROM reviews WHERE id = ?", [reviewId]);

    if (rows.length === 0) {
      return NextResponse.json({ ok: false, error: "Review not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, review: rows[0] }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 400 });
  }
}

// ✅ DELETE: حذف تعليق
export async function DELETE(req, { params }) {
  try {
    const reviewId = params.id;
    const db = await connectDB();

    // جلب التعليق للتأكد من وجوده
    const [rows] = await db.query("SELECT id, user_id FROM reviews WHERE id = ?", [reviewId]);
    if (rows.length === 0) {
      return NextResponse.json({ ok: false, error: "Review not found" }, { status: 404 });
    }

    // ⚠️ هنا تقدر تضيف تحقق من المستخدم الحالي (role أو id) لو عندك نظام Auth مبني على JWT/MySQL
    await db.query("DELETE FROM reviews WHERE id = ?", [reviewId]);

    return NextResponse.json({ ok: true, message: "Review deleted successfully" }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 400 });
  }
}

// ✅ PUT: تعديل تعليق
export async function PUT(req, { params }) {
  try {
    const reviewId = params.id;
    const body = await req.json();
    const { comment, rating } = body;

    const db = await connectDB();

    // جلب التعليق للتأكد من وجوده
    const [rows] = await db.query("SELECT id, user_id FROM reviews WHERE id = ?", [reviewId]);
    if (rows.length === 0) {
      return NextResponse.json({ ok: false, error: "Review not found" }, { status: 404 });
    }

    // ⚠️ تحقق من صلاحيات المستخدم قبل التعديل (مثلاً لو عندك user_id من JWT)
    await db.query("UPDATE reviews SET comment = ?, rating = ? WHERE id = ?", [
      comment,
      rating,
      reviewId,
    ]);

    return NextResponse.json({ ok: true, message: "Review updated successfully" }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 400 });
  }
}
