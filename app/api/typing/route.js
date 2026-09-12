import { NextResponse } from "next/server";
import { requireUser } from "@/lib/auth/admin";

let typingStatus = {}; // تخزين مؤقت في الذاكرة

export async function POST(req) {
  const auth = requireUser(req);
  if (auth.response) return auth.response;
  const { userId: requestedUserId, isTyping, adminTyping } = await req.json();
  const isAdmin = String(auth.user.role).toUpperCase() === "ADMIN";
  const userId = isAdmin && requestedUserId ? requestedUserId : auth.user.id;
  if (!userId) {
    return NextResponse.json({ error: "userId required" }, { status: 400 });
  }

  // تحديث حالة الكتابة للمستخدم أو الأدمن
  typingStatus[userId] = {
    isTyping: isTyping ?? typingStatus[userId]?.isTyping ?? false,
    adminTyping: isAdmin ? adminTyping ?? typingStatus[userId]?.adminTyping ?? false : typingStatus[userId]?.adminTyping ?? false,
  };

  return NextResponse.json({ success: true, userId, ...typingStatus[userId] });
}

export async function GET(req) {
  const auth = requireUser(req);
  if (auth.response) return auth.response;
  const { searchParams } = new URL(req.url);
  const requestedUserId = searchParams.get("userId");
  const isAdmin = String(auth.user.role).toUpperCase() === "ADMIN";
  const userId = isAdmin && requestedUserId ? requestedUserId : auth.user.id;
  if (!userId) {
    return NextResponse.json({ error: "userId required" }, { status: 400 });
  }

  return NextResponse.json({ userId, ...typingStatus[userId] });
}
