import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

// ================== GET ==================
export async function GET(req, context) {
  try {
    const { id } = context.params;
    const db = await connectDB();

    const [rows] = await db.query(`SELECT * FROM trips WHERE id = ? LIMIT 1`, [id]);
    if (!rows.length) {
      return NextResponse.json({ success: false, error: "Trip not found" }, { status: 404 });
    }
    const trip = rows[0];

    // ✅ جلب المدن
    const [cities] = await db.query(
      `SELECT tc.id, tc.city_id, c.name 
       FROM trip_cities tc 
       JOIN cities c ON tc.city_id = c.id 
       WHERE tc.trip_id = ?`,
      [id]
    );
    const parsedCities = cities.map((c) => ({
      ...c,
      name: typeof c.name === "string" ? JSON.parse(c.name) : c.name,
    }));

    // ✅ جلب الفئات
    const [categories] = await db.query(
      `SELECT tc.id, tc.category_id, cat.name 
       FROM trip_categories tc 
       JOIN categories cat ON tc.category_id = cat.id 
       WHERE tc.trip_id = ?`,
      [id]
    );
    const parsedCategories = categories.map((cat) => ({
      ...cat,
      name: typeof cat.name === "string" ? JSON.parse(cat.name) : cat.name,
    }));

    // ✅ جلب الـ includes
    const [includes] = await db.query(
      `SELECT id, include_translations 
       FROM includes WHERE trip_id = ?`,
      [id]
    );
    const parsedIncludes = includes.map((inc) => ({
      ...inc,
      include_translations:
        typeof inc.include_translations === "string"
          ? JSON.parse(inc.include_translations)
          : inc.include_translations,
    }));

    // ✅ جلب الـ exclusions
    const [exclusions] = await db.query(
      `SELECT id, exclusions_translations 
       FROM exclusions WHERE trip_id = ?`,
      [id]
    );
    const parsedExclusions = exclusions.map((exc) => ({
      ...exc,
      exclusions_translations:
        typeof exc.exclusions_translations === "string"
          ? JSON.parse(exc.exclusions_translations)
          : exc.exclusions_translations,
    }));

    // ✅ جلب الأيام والأنشطة
    const [days] = await db.query(
      `SELECT id, day_number 
       FROM trip_days WHERE trip_id = ?`,
      [id]
    );
    for (const day of days) {
      const [activities] = await db.query(
        `SELECT id, time, activity_translations 
         FROM day_activities WHERE day_id = ?`,
        [day.id]
      );
      day.activities = activities.map((act) => ({
        ...act,
        activity_translations:
          typeof act.activity_translations === "string"
            ? JSON.parse(act.activity_translations)
            : act.activity_translations,
      }));
    }

    return NextResponse.json(
      {
        success: true,
        trip: {
          ...trip,
          cities: parsedCities,
          categories: parsedCategories,
          includes: parsedIncludes,
          exclusions: parsedExclusions,
          itinerary: days,
        },
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("❌ [GET] Exception:", err.message);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// ================== PUT ==================
export async function PUT(req, context) {
  try {
    const { id } = context.params;
    const body = await req.json();
    const db = await connectDB();

    // ✅ تحديث بيانات الرحلة الأساسية
    await db.query(
      `UPDATE trips SET 
        title = ?, description = ?, solo_price = ?, group_price = ?, 
        duration = ?, priceLevel = ?, cover_image = ?, gallery_images = ?, discount_percent = ?
       WHERE id = ?`,
      [
        JSON.stringify(body.title),
        JSON.stringify(body.description),
        Number(body.solo_price),
        Number(body.group_price),
        body.duration,
        body.priceLevel,
        body.cover_image,
        JSON.stringify(body.gallery_images),
        String(body.discountPercent ?? "0"),
        id,
      ]
    );

    // ✅ تحديث الفئات
    if (Array.isArray(body.categories)) {
      await db.query("DELETE FROM trip_categories WHERE trip_id = ?", [id]);
      for (const catId of body.categories) {
        await db.query(
          "INSERT INTO trip_categories (id, trip_id, category_id) VALUES (?, ?, ?)",
          [uuidv4(), id, catId]
        );
      }
    }

    // ✅ تحديث المدن
    if (Array.isArray(body.cities)) {
      await db.query("DELETE FROM trip_cities WHERE trip_id = ?", [id]);
      for (const cityId of body.cities) {
        await db.query(
          "INSERT INTO trip_cities (id, trip_id, city_id) VALUES (?, ?, ?)",
          [uuidv4(), id, cityId]
        );
      }
    }

    // ✅ تحديث الـ includes
    if (Array.isArray(body.includes)) {
      await db.query("DELETE FROM includes WHERE trip_id = ?", [id]);
      for (const inc of body.includes) {
        await db.query(
          "INSERT INTO includes (id, trip_id, include_translations) VALUES (?, ?, ?)",
          [uuidv4(), id, JSON.stringify(inc.include_translations)]
        );
      }
    }

    // ✅ تحديث الـ exclusions
    if (Array.isArray(body.exclusions)) {
      await db.query("DELETE FROM exclusions WHERE trip_id = ?", [id]);
      for (const exc of body.exclusions) {
        await db.query(
          "INSERT INTO exclusions (id, trip_id, exclusions_translations) VALUES (?, ?, ?)",
          [uuidv4(), id, JSON.stringify(exc.exclusions_translations)]
        );
      }
    }

    // ✅ تحديث الأيام والأنشطة
    if (Array.isArray(body.itinerary)) {
      for (const day of body.itinerary) {
        if (day.id) {
          await db.query(
            "UPDATE trip_days SET day_number = ? WHERE id = ? AND trip_id = ?",
            [day.day_number, day.id, id]
          );
        } else {
          const newDayId = uuidv4();
          await db.query(
            "INSERT INTO trip_days (id, trip_id, day_number) VALUES (?, ?, ?)",
            [newDayId, id, day.day_number]
          );
          day.id = newDayId;
        }

        if (Array.isArray(day.activities)) {
          for (const act of day.activities) {
            if (act.id) {
              await db.query(
                "UPDATE day_activities SET time = ?, activity_translations = ? WHERE id = ? AND day_id = ?",
                [act.time, JSON.stringify(act.activity_translations), act.id, day.id]
              );
            } else {
              const newActId = uuidv4();
              await db.query(
                "INSERT INTO day_activities (id, day_id, time, activity_translations) VALUES (?, ?, ?, ?)",
                [newActId, day.id, act.time, JSON.stringify(act.activity_translations)]
              );
            }
          }
        }
      }
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (err) {
    console.error("❌ [PUT] Exception:", err.message);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}

// ================== DELETE ==================
export async function DELETE(req, context) {
  try {
    const { id } = context.params;
    const db = await connectDB();

    const [days] = await db.query("SELECT id FROM trip_days WHERE trip_id = ?", [id]);
    for (const day of days) {
      await db.query("DELETE FROM day_activities WHERE day_id = ?", [day.id]);
    }

    await db.query("DELETE FROM trip_cities WHERE trip_id = ?", [id]);
    await db.query("DELETE FROM trip_categories WHERE trip_id = ?", [id]);
    await db.query("DELETE FROM includes WHERE trip_id = ?", [id]);
    await db.query("DELETE FROM exclusions WHERE trip_id = ?", [id]);
    await db.query("DELETE FROM trip_days WHERE trip_id = ?", [id]);
    await db.query("DELETE FROM trips WHERE id = ?", [id]);

    return NextResponse.json(
      { success: true, message: "Trip deleted successfully" },
      { status: 200 }
    );
  } catch (err) {
    console.error("❌ [DELETE] Exception:", err.message);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
