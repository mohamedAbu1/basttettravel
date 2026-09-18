import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";
import { requireUser } from "@/lib/auth/admin";

export async function POST(req) {
  try {
    const auth = requireUser(req);
    if (auth.response) return auth.response;
    const {
      tripId,
      numPersons,
      hasChildren,
      numChildren,
      hasPets,
      petTypes,
      hasGuide,
      selectedLanguages,
      arrivalDate,
      departureDate,
    } = await req.json();

    const userId = auth.user.id;
    const persons = Number(numPersons);
    const children = Number(numChildren || 0);
    if (!tripId || !Number.isInteger(persons) || persons < 1 || !Number.isInteger(children) || children < 0) {
      return NextResponse.json({ error: "Invalid purchase data" }, { status: 400 });
    }
    const db = await connectDB();
    const [[trip]] = await db.query("SELECT id FROM trips WHERE id = ? LIMIT 1", [tripId]);
    if (!trip) return NextResponse.json({ error: "Trip not found" }, { status: 404 });
    const userName = auth.user.name || auth.user.email || "Traveler";
    const userEmail = auth.user.email || "";
    const userImage = auth.user.avatar_url || null;
    const purchaseStatus = "pending";
    const purchasePlatform = "web";

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
            userName,
            userEmail,
            userImage,
            persons,
            hasChildren,
            children,
            hasPets,
            JSON.stringify(petTypes),
            hasGuide,
            JSON.stringify(selectedLanguages),
            arrivalDate,
            departureDate,
            purchasePlatform,
            purchaseStatus,
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
        userName,
        userEmail,
        userImage,
        persons,
        hasChildren,
        children,
        hasPets,
        JSON.stringify(petTypes),
        hasGuide,
        JSON.stringify(selectedLanguages),
        arrivalDate,
        departureDate,
        purchasePlatform,
        purchaseStatus,
      ],
    );

    return NextResponse.json(
      { message: "Trip purchased successfully!" },
      { status: 200 },
    );
  } catch (err) {
    console.error("❌ Error in purchase:", err);
    return NextResponse.json({ error: "Unable to create purchase" }, { status: 500 });
  }
}
