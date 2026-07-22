import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db"; // ملف الاتصال بقاعدة البيانات MySQL

export async function GET() {
  try {
    const db = await connectDB();

    // 1️⃣ جلب الحجوزات
    const [purchases] = await db.query(`
      SELECT 
        id, created_at, arrival_date, departure_date, guide_languages, 
        num_children, num_persons, pet_type, platform, has_children, 
        has_guide, status, has_pets, user_id, trip_id
      FROM purchases
    `);

    // 2️⃣ جلب الرحلات المرتبطة
    const tripIds = purchases.map((p) => p.trip_id);
    let trips = [];
    if (tripIds.length > 0) {
      const [tripRows] = await db.query(
        `SELECT id, title FROM trips WHERE id IN (?)`,
        [tripIds],
      );

      // ✅ تحويل النص JSON إلى كائن
      trips = tripRows.map((t) => {
        let parsedTitle;
        try {
          parsedTitle = JSON.parse(t.title); // لو النص عبارة عن JSON متعدد اللغات
        } catch {
          parsedTitle = { en: t.title }; // fallback لو مش JSON
        }
        return { ...t, title: parsedTitle };
      });

    }

    // 3️⃣ جلب المستخدمين المرتبطين
    const userIds = purchases.map((p) => p.user_id);
    let users = [];
    if (userIds.length > 0) {
      const [userRows] = await db.query(
        `SELECT id, name, email FROM users WHERE id IN (?)`,
        [userIds],
      );
      users = userRows;
    }

    // 4️⃣ دمج البيانات
    const enrichedPurchases = purchases.map((p) => {
      const user = users.find((u) => u.id === p.user_id);
      const trip = trips.find((t) => t.id === p.trip_id);

      return {
        ...p,
        userName: user?.name || user?.email || "Unknown User",
        userEmail: user?.email || "No Email",
        tripTitle: trip?.title || { en: "Unknown Trip" }, // ✅ الآن كائن وليس نص
      };
    });


    return NextResponse.json(enrichedPurchases, { status: 200 });
  } catch (err) {
    console.error("❌ Error fetching purchases:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
