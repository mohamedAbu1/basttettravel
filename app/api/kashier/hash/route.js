import crypto from 'crypto';

export async function POST(req) {
  try {
    const { amount, currency, orderId } = await req.json();

    const merchantId = process.env.KASHIER_MERCHANT_ID;
    const apiKey = process.env.KASHIER_API_KEY;

    if (!merchantId || !apiKey) {
      return Response.json(
        { error: 'Kashier credentials are missing in env files' },
        { status: 500 }
      );
    }

    // بناء النص المطلوب مشفراً بدقة
    const path = `/?payment=${merchantId}.${orderId}.${amount}.${currency}`;

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