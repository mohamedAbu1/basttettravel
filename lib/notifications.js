import { connectDB } from "@/lib/db";

export async function getUserToken(userId) {
  const db = await connectDB();
  const [rows] = await db.query(
    "SELECT token FROM push_tokens WHERE user_id = ?",
    [userId]
  );
  if (rows.length === 0) return null;
  return rows[0].token;
}
