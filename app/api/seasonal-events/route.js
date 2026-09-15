import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { requireAdmin } from "@/lib/auth/admin";

const defaults = [
  ["newYear", "New Year", "new-year", 1, "2026-01-01", "2026-01-07", 15],
  ["womensDay", "International Women's Day", "womens-day", 1, "2026-03-08", "2026-03-10", 12],
  ["mothersDay", "Mother's Day", "mothers-day", 1, "2026-03-21", "2026-03-24", 12],
  ["ramadan", "Ramadan", "ramadan", 0, "2026-02-18", "2026-03-19", 18],
  ["eidAlFitr", "Eid Al-Fitr", "eid-al-fitr", 0, "2026-03-20", "2026-03-23", 20],
  ["halloween", "Halloween", "halloween", 1, "2026-10-25", "2026-11-01", 10],
];

async function ensureTable(db) {
  await db.query(`CREATE TABLE IF NOT EXISTS seasonal_events (
    id INT AUTO_INCREMENT PRIMARY KEY,
    event_key VARCHAR(40) NOT NULL UNIQUE,
    label VARCHAR(120) NOT NULL,
    theme VARCHAR(40) NOT NULL,
    annual TINYINT(1) NOT NULL DEFAULT 0,
    enabled TINYINT(1) NOT NULL DEFAULT 1,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    discount DECIMAL(5,2) NOT NULL DEFAULT 0,
    updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  )`);
  const [[count]] = await db.query("SELECT COUNT(*) AS total FROM seasonal_events");
  if (!Number(count.total)) {
    await db.query(
      "INSERT INTO seasonal_events (event_key, label, theme, annual, enabled, start_date, end_date, discount) VALUES ?",
      [defaults.map((item) => [item[0], item[1], item[2], item[3], 1, item[4], item[5], item[6]])],
    );
  }
}

export async function GET() {
  try {
    const db = await connectDB();
    await ensureTable(db);
    const [rows] = await db.query("SELECT event_key AS `key`, label, theme, annual, enabled, start_date, end_date, discount FROM seasonal_events ORDER BY id");
    return NextResponse.json(rows);
  } catch (error) {
    console.error("GET /seasonal-events Error:", error);
    return NextResponse.json({ error: "Seasonal settings are unavailable" }, { status: 500 });
  }
}

export async function PUT(request) {
  const authorizationError = requireAdmin(request);
  if (authorizationError) return authorizationError;
  try {
    const body = await request.json();
    const items = Array.isArray(body) ? body : body.events;
    if (!Array.isArray(items) || !items.length) {
      return NextResponse.json({ error: "No seasonal settings supplied" }, { status: 400 });
    }
    const db = await connectDB();
    await ensureTable(db);
    for (const item of items) {
      if (!item.key || !item.start_date || !item.end_date) continue;
      await db.query(
        `UPDATE seasonal_events SET enabled = ?, annual = ?, start_date = ?, end_date = ?, discount = ? WHERE event_key = ?`,
        [item.enabled ? 1 : 0, item.annual ? 1 : 0, item.start_date, item.end_date, Math.max(0, Math.min(100, Number(item.discount) || 0)), item.key],
      );
    }
    const [rows] = await db.query("SELECT event_key AS `key`, label, theme, annual, enabled, start_date, end_date, discount FROM seasonal_events ORDER BY id");
    return NextResponse.json(rows);
  } catch (error) {
    console.error("PUT /seasonal-events Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
