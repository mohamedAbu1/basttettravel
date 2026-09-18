import { getAuthenticatedUser } from "@/lib/auth/admin";
import { connectDB } from "@/lib/db";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const unauthorized = (status, error) => NextResponse.json({ success: false, error }, { status });

export async function GET(request) {
  const user = getAuthenticatedUser(request);
  if (!user) return unauthorized(401, "Authentication required");
  if (String(user.role).toUpperCase() !== "ADMIN") return unauthorized(403, "Administrator access required");

  const encoder = new TextEncoder();
  let closed = false;
  let timer;
  let lastCreatedAt = new Date(Date.now() - 2000);
  let lastId = "";

  const closeStream = () => {
    closed = true;
    if (timer) clearInterval(timer);
  };

  const stream = new ReadableStream({
    start(controller) {
      const write = (value) => {
        if (!closed) controller.enqueue(encoder.encode(value));
      };

      const poll = async () => {
        if (closed) return;
        try {
          const db = await connectDB();
          const [rows] = await db.execute(
            `SELECT id, admin_id, event_type, user_id, message, type, user_name, user_email, user_image,
                    created_at, is_read, trip_id, comment_id, message_id
             FROM notifications
             WHERE admin_id = ? AND (created_at > ? OR (created_at = ? AND id > ?))
             ORDER BY created_at ASC, id ASC
             LIMIT 25`,
            [user.id, lastCreatedAt, lastCreatedAt, lastId],
          );

          for (const notification of rows) {
            lastCreatedAt = new Date(notification.created_at);
            lastId = String(notification.id);
            write(`event: notification\ndata: ${JSON.stringify(notification)}\n\n`);
          }
          write(": heartbeat\n\n");
        } catch (error) {
          console.error("Notification stream error:", error.message);
        }
      };

      request.signal.addEventListener("abort", closeStream);
      write("retry: 3000\n\n");
      poll();
      timer = setInterval(poll, 1500);
    },
    cancel: closeStream,
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream; charset=utf-8",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      "X-Accel-Buffering": "no",
    },
  });
}
