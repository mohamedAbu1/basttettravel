import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

export async function POST(req) {
  try {
    const {
      tripId,
      user_name,
      user_email,
      user_image,
      numPersons,
      hasChildren,
      numChildren,
      hasPets,
      petTypes,
      hasGuide,
      selectedLanguages,
      arrivalDate,
      userId,
      status,
      departureDate,
      platform,
    } = await req.json();

    const db = await connectDB();

    // ✅ Check if there is an existing purchase
    const [existing] = await db.query(
      "SELECT * FROM purchases WHERE user_id = ? AND trip_id = ?",
      [userId, tripId],
    );

    if (existing.length > 0) {
      const oldPurchase = existing[0];

      if (oldPurchase.status === "Cancelled") {
        const purchaseId = uuidv4();

        await db.query(
          `INSERT INTO purchases 
            (id, user_id, trip_id, user_name, user_email, user_image, num_persons, has_children, num_children, has_pets, pet_type, 
             has_guide, guide_languages, arrival_date, departure_date, platform, status, created_at) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
          [
            purchaseId,
            userId,
            tripId,
            user_name,                // ✅ correct position
            user_email,               // ✅ correct position
            user_image,               // ✅ correct position
            numPersons,
            hasChildren,
            numChildren,
            hasPets,
            JSON.stringify(petTypes),
            hasGuide,
            JSON.stringify(selectedLanguages),
            arrivalDate,
            departureDate,
            platform,
            status,
          ],
        );

        return NextResponse.json(
          { message: "Trip re-purchased successfully!" },
          { status: 200 },
        );
      }

      return NextResponse.json(
        { error: "You already purchased this trip" },
        { status: 400 },
      );
    }

    // ✅ Add a new purchase if none exists
    const purchaseId = uuidv4();

    await db.query(
      `INSERT INTO purchases 
        (id, user_id, trip_id, user_name, user_email, user_image, num_persons, has_children, num_children, has_pets, pet_type, 
         has_guide, guide_languages, arrival_date, departure_date, platform, status, created_at) 
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
      [
        purchaseId,
        userId,
        tripId,
        user_name,                // ✅ correct position
        user_email,               // ✅ correct position
        user_image,               // ✅ correct position
        numPersons,
        hasChildren,
        numChildren,
        hasPets,
        JSON.stringify(petTypes),
        hasGuide,
        JSON.stringify(selectedLanguages),
        arrivalDate,
        departureDate,
        platform,
        status,
      ],
    );

    return NextResponse.json(
      { message: "Trip purchased successfully!" },
      { status: 200 },
    );
  } catch (err) {
    console.error("❌ Error in purchase:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
