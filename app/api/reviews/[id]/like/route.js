import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
);

export async function POST(req, { params }) {
  console.log("➡️ API POST called with params:", params);

  const authHeader = req.headers.get("authorization");
  console.log("📥 Authorization header:", authHeader);

  const token = authHeader?.split(" ")[1];
  console.log("📥 Extracted token:", token);

  const { data: { user }, error } = await supabase.auth.getUser(token);
  console.log("📥 Supabase getUser result:", user, error);

  if (!user) {
    console.log("⚠️ Unauthorized like attempt");
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const reviewId = params.id;
  console.log("📥 Review ID:", reviewId);

  if (!reviewId) {
    console.log("⚠️ Missing reviewId");
    return NextResponse.json({ ok: false, error: "Missing reviewId" }, { status: 400 });
  }

  const { error: insertError } = await supabase
    .from("review_likes")
    .insert([{ review_id: reviewId, user_id: user.id }]);

  if (insertError) {
    console.error("❌ Supabase error (POST):", insertError.message);
    return NextResponse.json({ ok: false, error: insertError.message }, { status: 400 });
  }

  console.log("✅ Like added successfully by user:", user.id);
  return NextResponse.json({ ok: true, message: "Like added successfully" });
}

// 🔴 إزالة لايك
export async function DELETE(req, { params }) {
  console.log("➡️ API DELETE called with params:", params);

  const authHeader = req.headers.get("authorization");
  console.log("📥 Authorization header:", authHeader);

  const token = authHeader?.split(" ")[1];
  console.log("📥 Extracted token:", token);

  const { data: { user }, error } = await supabase.auth.getUser(token);
  console.log("📥 Supabase getUser result:", user, error);

  if (!user) {
    console.log("⚠️ Unauthorized unlike attempt");
    return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
  }

  const reviewId = params.id;
  console.log("📥 Review ID:", reviewId);

  const { error: deleteError } = await supabase
    .from("review_likes")
    .delete()
    .eq("review_id", reviewId)
    .eq("user_id", user.id);

  if (deleteError) {
    console.error("❌ Supabase error (DELETE):", deleteError.message);
    return NextResponse.json({ ok: false, error: deleteError.message }, { status: 400 });
  }

  console.log("✅ Like removed successfully by user:", user.id);
  return NextResponse.json({ ok: true, message: "Like removed successfully" });
}


// 📊 جلب عدد اللايكات
export async function GET(req, { params }) {
  const reviewId = params.id;
  if (!reviewId) {
    return NextResponse.json({ ok: false, error: "Missing reviewId" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("review_likes")
    .select("user_id")
    .eq("review_id", reviewId);

  if (error) {
    return NextResponse.json({ ok: false, error: error.message }, { status: 400 });
  }

  return NextResponse.json({
    ok: true,
    count: data?.length || 0,
    users: data?.map((d) => d.user_id) || [],
  });
}
