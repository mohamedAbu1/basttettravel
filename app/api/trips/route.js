import { connectDB } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

// دالة آمنة لتحويل أي قيمة إلى JSON نصي
const safeStringify = (value) => {
  try {
    return JSON.stringify(value ?? []);
  } catch {
    return "[]";
  }
};

export async function POST(req) {
  try {
    const body = await req.json();
    const tripId = uuidv4();

    const db = await connectDB();

    // ✅ إدخال بيانات الرحلة الأساسية
    await db.execute(
      `INSERT INTO trips 
       (id, title, description, currency, duration, duration_unit, cover_image, gallery_images, priceLevel, group_price, solo_price, discount_percent)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        tripId,
        JSON.stringify(body.title),
        JSON.stringify(body.description),
        body.currency,
        body.duration,
        body.duration_unit,
        body.cover_image,
        JSON.stringify(body.gallery_images),
        body.priceLevel,
        body.group_price,
        body.solo_price,
        String(body.discountPercent ?? "0"),
      ]
    );

    // ✅ إدخال includes
    if (body.includes?.length > 0) {
      const includesData = body.includes.map((inc) => [
        uuidv4(),
        tripId,
        safeStringify(inc),
      ]);
      await db.query(
        "INSERT INTO includes (id, trip_id, include_translations) VALUES ?",
        [includesData]
      );
    }

    // ✅ إدخال exclusions
    if (body.exclusions?.length > 0) {
      const exclusionsData = body.exclusions.map((exc) => [
        uuidv4(),
        tripId,
        safeStringify(exc),
      ]);
      await db.query(
        "INSERT INTO exclusions (id, trip_id, exclusions_translations) VALUES ?",
        [exclusionsData]
      );
    }

    // ✅ إدخال المدن
    if (body.cities?.length > 0) {
      const citiesData = body.cities.map((cityId) => [
        uuidv4(),
        tripId,
        cityId,
      ]);
      await db.query(
        "INSERT INTO trip_cities (id, trip_id, city_id) VALUES ?",
        [citiesData]
      );
    }

    // ✅ إدخال التصنيفات
    if (body.categories?.length > 0) {
      const categoriesData = body.categories.map((catId) => [
        uuidv4(),
        tripId,
        catId,
      ]);
      await db.query(
        "INSERT INTO trip_categories (id, trip_id, category_id) VALUES ?",
        [categoriesData]
      );
    }

    // ✅ إدخال الأيام والأنشطة
    if (body.itinerary?.length > 0) {
      for (const [index, day] of body.itinerary.entries()) {
        const dayId = uuidv4();
        await db.execute(
          "INSERT INTO trip_days (id, trip_id, day_number) VALUES (?, ?, ?)",
          [dayId, tripId, day.day_number || index + 1]
        );

        if (day.activities?.length > 0) {
          const activitiesData = day.activities.map((act) => [
            uuidv4(),
            dayId,
            act.time,
            safeStringify(act.activity_translations || act.activity),
          ]);
          await db.query(
            "INSERT INTO day_activities (id, day_id, time, activity_translations) VALUES ?",
            [activitiesData]
          );
        }
      }
    }

    return new Response(JSON.stringify({ success: true, tripId }), {
      status: 201,
    });
  } catch (err) {
    console.error("❌ API Error:", err);
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const db = await connectDB();
    const [trips] = await db.query(`
      SELECT 
        t.*,
        COALESCE(
          CAST(
            (SELECT JSON_ARRAYAGG(JSON_OBJECT('id', c.id, 'name', c.name, 'images', c.images)) 
             FROM trip_cities tc 
             JOIN cities c ON tc.city_id = c.id 
             WHERE tc.trip_id = t.id)
          AS CHAR
        ), '[]'
        ) AS cities,
        COALESCE(
          CAST(
            (SELECT JSON_ARRAYAGG(JSON_OBJECT('id', cat.id, 'name', cat.name, 'images', cat.images)) 
             FROM trip_categories tc 
             JOIN categories cat ON tc.category_id = cat.id 
             WHERE tc.trip_id = t.id)
          AS CHAR
        ), '[]'
        ) AS categories,
        COALESCE(
          CAST(
            (SELECT JSON_ARRAYAGG(JSON_OBJECT('id', inc.id, 'include_translations', inc.include_translations)) 
             FROM includes inc WHERE inc.trip_id = t.id)
          AS CHAR
        ), '[]'
        ) AS includes,
        COALESCE(
          CAST(
            (SELECT JSON_ARRAYAGG(JSON_OBJECT('id', exc.id, 'exclusions_translations', exc.exclusions_translations)) 
             FROM exclusions exc WHERE exc.trip_id = t.id)
          AS CHAR
        ), '[]'
        ) AS exclusions,
        COALESCE(
          CAST(
            (SELECT JSON_ARRAYAGG(
                JSON_OBJECT(
                  'id', td.id, 
                  'day_number', td.day_number,
                  'activities', (
                    SELECT JSON_ARRAYAGG(
                      JSON_OBJECT(
                        'id', da.id,
                        'time', da.time,
                        'activity_translations', da.activity_translations
                      )
                    )
                    FROM day_activities da WHERE da.day_id = td.id
                  )
                )
             ) 
             FROM trip_days td WHERE td.trip_id = t.id)
          AS CHAR
        ), '[]'
        ) AS days,
        COALESCE(
          CAST(
            (SELECT JSON_ARRAYAGG(
              JSON_OBJECT(
                'id', r.id,
                'user_id', r.user_id,
                'name', r.name,
                'comment', r.comment,
                'rating', r.rating,
                'avatar_url', r.avatar_url,
                'created_at', r.created_at
              )
            )
            FROM reviews r WHERE r.trip_id = t.id)
          AS CHAR
        ), '[]'
        ) AS reviews
      FROM trips t
    `);

    const safeParse = (value) => {
      try {
        return value ? JSON.parse(value) : [];
      } catch {
        return [];
      }
    };

    const parsedTrips = trips.map((trip) => ({
      ...trip,
      title: trip.title ? JSON.parse(trip.title) : {},
      description: trip.description ? JSON.parse(trip.description) : {},
      cover_image: trip.cover_image,
      solo_price: Number(trip.solo_price),
      group_price: Number(trip.group_price),
      currency: trip.currency,
      duration: Number(trip.duration),
      priceLevel: trip.priceLevel,
      duration_unit: trip.duration_unit || "",
      gallery_images: safeParse(trip.gallery_images),
      cities: safeParse(trip.cities),
      categories: safeParse(trip.categories),
      includes: safeParse(trip.includes),
      exclusions: safeParse(trip.exclusions),
      itinerary: safeParse(trip.days),
      reviews: safeParse(trip.reviews),
      discountPercent: safeParse(trip.discount_percent),
    }));

    return new Response(JSON.stringify({ success: true, trips: parsedTrips }), {
      status: 200,
      headers: { "Cache-Control": "public, max-age=3600" },
    });
  } catch (err) {
    console.error("GET /api/trips error:", err);
    return new Response(
      JSON.stringify({ success: false, error: err.message }),
      { status: 500 }
    );
  }
}
