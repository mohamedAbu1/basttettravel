import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { amount, userDetails } = await request.json();

    if (!process.env.PAYMOB_API_KEY || !process.env.PAYMOB_INTEGRATION_ID) {
      console.error("❌ Missing Paymob Environment Variables");
      return NextResponse.json(
        { error: "Server configuration missing variables" },
        { status: 500 },
      );
    }

    // 1. Auth Request
    console.log("🚀 Starting Auth Request with API_KEY:", process.env.PAYMOB_API_KEY);
    const authResponse = await fetch("https://accept.paymob.com/api/auth/tokens", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ api_key: process.env.PAYMOB_API_KEY }),
    });

    console.log("📡 Auth Response Status:", authResponse.status);
    const authData = await authResponse.json();
    console.log("📦 Auth Response Data:", authData);

    if (!authResponse.ok || !authData.token) {
      return NextResponse.json(
        { error: "Authentication failed", details: authData },
        { status: 401 },
      );
    }

    const authToken = authData.token;
    console.log("✅ Auth Token:", authToken);

    // 2. Order Registration
    console.log("🚀 Starting Order Registration with amount:", amount * 100);
    const orderResponse = await fetch("https://accept.paymob.com/api/ecommerce/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        auth_token: authToken,
        delivery_needed: "false",
        amount_cents: amount * 100,
        currency: "EGP",
        items: [],
      }),
    });

    console.log("📡 Order Response Status:", orderResponse.status);
    const orderData = await orderResponse.json();
    console.log("📦 Order Response Data:", orderData);

    if (!orderResponse.ok || !orderData.id) {
      return NextResponse.json(
        { error: "Order registration failed", details: orderData },
        { status: 400 },
      );
    }

    const orderId = orderData.id;
    console.log("✅ Order ID:", orderId);

    // 3. Payment Key Request
    console.log("🚀 Starting Payment Key Request with Integration ID:", process.env.PAYMOB_INTEGRATION_ID);
    const paymentKeyResponse = await fetch("https://accept.paymob.com/api/acceptance/payment_keys", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        auth_token: authToken,
        amount_cents: amount * 100,
        expiration: 3600,
        order_id: orderId,
        billing_data: {
          apartment: "NA",
          email: userDetails?.email || "customer@example.com",
          floor: "NA",
          first_name: userDetails?.firstName || "Guest",
          street: "NA",
          building: "NA",
          phone_number: userDetails?.phone || "+201000000000",
          shipping_method: "NA",
          postal_code: "NA",
          city: "Cairo",
          country: "EG",
          last_name: userDetails?.lastName || "User",
          state: "Cairo",
        },
        currency: "EGP",
        integration_id: Number(process.env.PAYMOB_INTEGRATION_ID),
        lock_order_when_paid: "true",
      }),
    });

    console.log("📡 Payment Key Response Status:", paymentKeyResponse.status);
    const paymentKeyData = await paymentKeyResponse.json();
    console.log("📦 Payment Key Response Data:", paymentKeyData);

    if (!paymentKeyResponse.ok || !paymentKeyData.token) {
      return NextResponse.json(
        { error: "Payment key generation failed", details: paymentKeyData },
        { status: 400 },
      );
    }

    console.log("✅ Payment Token:", paymentKeyData.token);
    return NextResponse.json({ token: paymentKeyData.token });
  } catch (error) {
    console.error("💥 Paymob Server Error:", error);
    return NextResponse.json(
      { error: "Internal server error", message: error.message },
      { status: 500 },
    );
  }
}
