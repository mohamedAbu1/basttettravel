import crypto from "crypto";

export async function POST(req) {
  try {
    const rawBody = await req.text();
    const secret = process.env.KASHIER_WEBHOOK_SECRET || process.env.KASHIER_SECRET_KEY;
    const providedSignature = req.headers.get("x-kashier-signature");

    if (!secret || !providedSignature) {
      return Response.json({ message: "Webhook signature is required" }, { status: 401 });
    }

    const expectedSignature = crypto.createHmac("sha256", secret).update(rawBody).digest("hex");
    const validSignature = providedSignature.length === expectedSignature.length &&
      crypto.timingSafeEqual(Buffer.from(providedSignature), Buffer.from(expectedSignature));
    if (!validSignature) {
      return Response.json({ message: "Invalid webhook signature" }, { status: 401 });
    }

    const body = JSON.parse(rawBody);
    const event = body.event;
    const data = body.data || {};

    if (event === "pay" || data.status === "SUCCESS") {
      console.info("Verified payment webhook", {
        orderId: data.merchantOrderId,
        transactionId: data.transactionId,
      });
    } else if (data.status === "FAILED") {
      console.info("Verified failed payment webhook", { orderId: data.merchantOrderId });
    }

    return Response.json({ status: "success" }, { status: 200 });
  } catch (error) {
    console.error("Webhook processing failed", error.message);
    return Response.json({ message: "Webhook processing failed" }, { status: 500 });
  }
}
