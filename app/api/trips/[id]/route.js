import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
);

// ================== GET ==================
export async function GET(req, context) {
  try {
    const { id } = await context.params;
    console.log("➡️ [GET] Trip ID:", id);

    const { data, error } = await supabase
      .from("trips")
      .select(
        `
        id,
        title,
        description,
        price,
        currency,
        duration,
        duration_unit,
        priceLevel,
        cover_image,
        gallery_images,
        trip_cities (
          id,
          city_id,
          cities ( id, name )
        ),
        trip_categories (
          id,
          category_id,
          categories ( id, name )
        ),
        includes (
          id,
          include_translations
        ),
        trip_days (
          id,
          day_number,
          day_activities (
            id,
            time,
            activity_translations
          )
        )
      `,
      )
      .eq("id", id)
      .single();

    console.log("➡️ [GET] Raw data:", data);

    if (error) {
      console.error("❌ [GET] Error:", error.message);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 },
      );
    }
    if (!data) {
      console.warn("⚠️ [GET] Trip not found");
      return NextResponse.json(
        { success: false, error: "Trip not found" },
        { status: 404 },
      );
    }

    // ✅ رجّع العلاقات كاملة بدل تحويلها لأسماء فقط
    const trip = {
      ...data,
      cities:
        data.trip_cities?.map((c) => ({
          id: c.city_id,
          name: c.cities?.name, // هترجع كل الترجمات لو مخزنة كـ JSON
        })) || [],
      categories:
        data.trip_categories?.map((c) => ({
          id: c.category_id,
          name: c.categories?.name,
        })) || [],
      includes: data.includes || [],
      itinerary:
        data.trip_days?.map((day) => ({
          id: day.id,
          day_number: day.day_number,
          activities: day.day_activities || [],
        })) || [],
    };

    console.log("✅ [GET] Final trip object:", trip);

    return NextResponse.json({ success: true, trip }, { status: 200 });
  } catch (error) {
    console.error("❌ [GET] Exception:", error.message);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}

// ================== PUT ==================
export async function PUT(req, context) {
  try {
    const { id } = await context.params;
    const body = await req.json();

    console.log("➡️ [PUT] Trip ID:", id);
    console.log("➡️ [PUT] Request body:", JSON.stringify(body, null, 2));

    const tripPayload = {
      title: body.title,
      description: body.description,
      price: Number(body.price),
      duration: body.duration,
      priceLevel: body.priceLevel,
      cover_image: body.cover_image,
      gallery_images: body.gallery_images,
    };

    console.log("➡️ [PUT] Trip payload:", tripPayload);

    // ✅ تحديث بيانات الرحلة الأساسية
    const { data, error } = await supabase
      .from("trips")
      .update(tripPayload)
      .eq("id", id)
      .select()
      .single();

    console.log("➡️ [PUT] Updated trip:", data);

    if (error) {
      console.error("❌ [PUT] Error updating trip:", error.message);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 },
      );
    }

    // ✅ تحديث الفئات
    if (Array.isArray(body.categories)) {
      console.log("➡️ [PUT] Updating categories:", body.categories);
      await supabase.from("trip_categories").delete().eq("trip_id", id);
      const categoriesData = body.categories.map((catId) => ({
        trip_id: id,
        category_id: catId,
      }));
      console.log("➡️ [PUT] Categories payload:", categoriesData);
      if (categoriesData.length > 0) {
        await supabase.from("trip_categories").insert(categoriesData);
      }
    }

    // ✅ تحديث المدن
    if (Array.isArray(body.cities)) {
      console.log("➡️ [PUT] Updating cities:", body.cities);
      await supabase.from("trip_cities").delete().eq("trip_id", id);
      const citiesData = body.cities.map((cityId) => ({
        trip_id: id,
        city_id: cityId,
      }));
      console.log("➡️ [PUT] Cities payload:", citiesData);
      if (citiesData.length > 0) {
        await supabase.from("trip_cities").insert(citiesData);
      }
    }

    // ✅ تحديث الـ includes
    if (Array.isArray(body.includes)) {
      console.log("➡️ [PUT] Updating includes:", body.includes);
      await supabase.from("includes").delete().eq("trip_id", id);
      const includesData = body.includes.map((inc) => ({
        trip_id: id,
        include_translations: inc.include_translations, // ✅ استخدم البنية الصحيحة
      }));
      console.log("➡️ [PUT] Includes payload:", includesData);
      if (includesData.length > 0) {
        await supabase.from("includes").insert(includesData);
      }
    }

    // ✅ تحديث الأيام والأنشطة اليومية
    if (Array.isArray(body.itinerary)) {
      console.log("➡️ [PUT] Updating itinerary:", body.itinerary);
      await supabase.from("trip_days").delete().eq("trip_id", id);

      const daysData = body.itinerary.map((day, index) => ({
        trip_id: id,
        day_number: day.day_number || index + 1,
      }));
      console.log("➡️ [PUT] Days payload:", daysData);

      const { data: insertedDays, error: daysError } = await supabase
        .from("trip_days")
        .insert(daysData)
        .select();

      if (daysError) throw daysError;
      console.log("✅ [PUT] Inserted days:", insertedDays);

      const activitiesData = [];
      insertedDays.forEach((dayRow, index) => {
        const activities = body.itinerary[index].activities || [];
        console.log(
          `➡️ [PUT] Activities for day ${dayRow.day_number}:`,
          activities,
        );
        activities.forEach((act) => {
          activitiesData.push({
            day_id: dayRow.id,
            time: act.time,
            activity_translations: act.activity_translations, // ✅ استخدم البنية الصحيحة
          });
        });
      });

      console.log("➡️ [PUT] Activities payload:", activitiesData);

      if (activitiesData.length > 0) {
        await supabase.from("day_activities").insert(activitiesData);
      }
    }

    console.log("✅ [PUT] Trip update complete");

    return NextResponse.json(
      { success: true, updatedTrip: data },
      { status: 200 },
    );
  } catch (error) {
    console.error("❌ [PUT] Exception:", error.message);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 },
    );
  }
}
// ================== DELETE ==================
export async function DELETE(req, context) {
  try {
    const { id } = await context.params;
    console.log("➡️ [DELETE] Trip ID:", id);

    // ✅ احذف العلاقات المرتبطة أولاً لو محتاج (مدن، فئات، أيام، أنشطة، إلخ)
    await supabase.from("trip_cities").delete().eq("trip_id", id);
    await supabase.from("trip_categories").delete().eq("trip_id", id);
    await supabase.from("includes").delete().eq("trip_id", id);
    await supabase.from("trip_days").delete().eq("trip_id", id);
    await supabase.from("day_activities").delete().eq("day_id", id);

    // ✅ احذف الرحلة نفسها
    const { error } = await supabase.from("trips").delete().eq("id", id);

    if (error) {
      console.error("❌ [DELETE] Error:", error.message);
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }

    console.log("✅ [DELETE] Trip deleted successfully");
    return NextResponse.json(
      { success: true, message: "Trip deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ [DELETE] Exception:", error.message);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
