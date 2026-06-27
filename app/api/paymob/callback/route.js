import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    console.log("📦 Paymob Callback Data:", body);

    // هنا تقدر تحفظ النتيجة في قاعدة البيانات أو تحدث حالة الحجز
    return NextResponse.json({ message: "Callback received successfully" }, { status: 200 });
  } catch (error) {
    console.error("💥 Callback Error:", error);
    return NextResponse.json({ error: "Failed to process callback" }, { status: 500 });
  }
}
