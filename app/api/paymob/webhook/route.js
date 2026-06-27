import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const body = await request.json();
    console.log("📦 Paymob Webhook Data:", body);

    // مثال: تحديث حالة الطلب في قاعدة البيانات
    // await updateOrderStatus(body.order.id, body.success ? "Paid" : "Failed");

    return NextResponse.json({ message: "Webhook received successfully" }, { status: 200 });
  } catch (error) {
    console.error("💥 Webhook Error:", error);
    return NextResponse.json({ error: "Failed to process webhook" }, { status: 500 });
  }
}
