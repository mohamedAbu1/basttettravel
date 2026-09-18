import crypto from 'crypto';
import { requireUser } from "@/lib/auth/admin";

export async function POST(req) {
  try {
    const auth = requireUser(req);
    if (auth.response) return auth.response;
    const { amount, currency, orderId } = await req.json();
    const numericAmount = Number(amount);
    if (!Number.isFinite(numericAmount) || numericAmount <= 0 || numericAmount > 10000000
      || currency !== "EGP" || !/^[-A-Za-z0-9_]{3,80}$/.test(String(orderId || ""))) {
      return Response.json({ error: "Invalid payment data" }, { status: 400 });
    }

    const merchantId = process.env.KASHIER_MERCHANT_ID;
    const apiKey = process.env.KASHIER_API_KEY;

    if (!merchantId || !apiKey) {
      return Response.json(
        { error: 'Kashier credentials are missing in env files' },
        { status: 500 }
      );
    }

    // بناء النص المطلوب مشفراً بدقة
    const path = `/?payment=${merchantId}.${orderId}.${numericAmount.toFixed(2)}.${currency}`;

    const hash = crypto
      .createHmac('sha256', apiKey)
      .update(path)
      .digest('hex');

    return Response.json({ hash, merchantId }, { status: 200 });
  } catch (error) {
    console.error('Hash Generation Error:', error);
    return Response.json({ error: 'Failed to generate payment hash' }, { status: 500 });
  }
}
