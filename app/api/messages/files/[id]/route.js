import { NextResponse } from "next/server";
import fs from "fs/promises";
import path from "path";
import { connectDB } from "@/lib/db";
import { getAuthenticatedUser } from "@/lib/auth/admin";

export const dynamic = "force-dynamic";

export async function GET(request, { params }) {
  const user = getAuthenticatedUser(request);
  if (!user) return NextResponse.json({ error: "Authentication required" }, { status: 401 });

  const { id } = await params;
  const db = await connectDB();
  const [[attachment]] = await db.query(
    "SELECT user_id, attachment_path, attachment_name, attachment_mime FROM messages WHERE id = ? AND attachment_path IS NOT NULL LIMIT 1",
    [id],
  );
  if (!attachment) return NextResponse.json({ error: "Attachment not found" }, { status: 404 });

  const isAdmin = String(user.role).toUpperCase() === "ADMIN";
  if (!isAdmin && String(attachment.user_id) !== String(user.id)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const root = path.resolve(process.env.CHAT_UPLOAD_DIR || path.resolve(process.cwd(), "..", "basttettravel-chat-storage"));
  const filePath = path.resolve(root, attachment.attachment_path);
  if (filePath !== root && !filePath.startsWith(`${root}${path.sep}`)) {
    return NextResponse.json({ error: "Invalid attachment path" }, { status: 400 });
  }

  try {
    const file = await fs.readFile(filePath);
    return new Response(file, {
      headers: {
        "Content-Type": attachment.attachment_mime || "application/octet-stream",
        "Content-Disposition": `inline; filename*=UTF-8''${encodeURIComponent(attachment.attachment_name || "attachment")}`,
        "Cache-Control": "private, max-age=3600",
      },
    });
  } catch {
    return NextResponse.json({ error: "Attachment file is unavailable" }, { status: 404 });
  }
}
