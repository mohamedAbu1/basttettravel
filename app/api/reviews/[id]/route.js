// src/app/api/reviews/[id]/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { requireUser } from "@/lib/auth/admin";

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
    const auth = requireUser(req);
    if (auth.response) return auth.response;
    const reviewId = params.id;
    const db = await connectDB();

    // جلب التعليق للتأكد من وجوده
    const [rows] = await db.query("SELECT id, user_id FROM reviews WHERE id = ?", [reviewId]);
    if (rows.length === 0) {
      return NextResponse.json({ ok: false, error: "Review not found" }, { status: 404 });
    }

    // ⚠️ هنا تقدر تضيف تحقق من المستخدم الحالي (role أو id) لو عندك نظام Auth مبني على JWT/MySQL
    const isOwner = String(rows[0].user_id) === String(auth.user.id);
    const isAdmin = String(auth.user.role).toUpperCase() === "ADMIN";
    if (!isOwner && !isAdmin) {
      return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
    }
    await db.query("DELETE FROM reviews WHERE id = ?", [reviewId]);

    return NextResponse.json({ ok: true, message: "Review deleted successfully" }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 400 });
  }
}

// ✅ PUT: تعديل تعليق
export async function PUT(req, { params }) {
  try {
    const auth = requireUser(req);
    if (auth.response) return auth.response;
    const reviewId = params.id;
    const body = await req.json();
    const { comment, rating } = body;
    if (typeof comment !== "string" || comment.trim().length < 2 || comment.length > 2000 || Number(rating) < 1 || Number(rating) > 5) {
      return NextResponse.json({ ok: false, error: "Invalid review data" }, { status: 400 });
    }

    const db = await connectDB();

    // جلب التعليق للتأكد من وجوده
    const [rows] = await db.query("SELECT id, user_id FROM reviews WHERE id = ?", [reviewId]);
    if (rows.length === 0) {
      return NextResponse.json({ ok: false, error: "Review not found" }, { status: 404 });
    }

    const isOwner = String(rows[0].user_id) === String(auth.user.id);
    const isAdmin = String(auth.user.role).toUpperCase() === "ADMIN";
    if (!isOwner && !isAdmin) {
      return NextResponse.json({ ok: false, error: "Forbidden" }, { status: 403 });
    }
    await db.query("UPDATE reviews SET comment = ?, rating = ? WHERE id = ?", [
      comment.trim(),
      Number(rating),
      reviewId,
    ]);

    return NextResponse.json({ ok: true, message: "Review updated successfully" }, { status: 200 });
  } catch (err) {
    return NextResponse.json({ ok: false, error: err.message }, { status: 400 });
  }
}
