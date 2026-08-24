import crypto from 'crypto';
// استورد هنا ملف اتصال قاعدة البيانات الخاص بك

export async function POST(req) {
  try {
    const body = await req.json();
    const event = body.event; // نوع الحدث مثل: pay
    const data = body.data;

    // 1. التحقق من التوقيع (Signature) لضمان أن الإشعار قادم فعلياً من Kashier
    const kashierSignature = req.headers.get('x-kashier-signature');
    const secretKey = process.env.KASHIER_SECRET_KEY;

    // (اختياري) يمكنك فحص التوقيع المشفّر بالأمر التالي
    // const calculatedSignature = crypto.createHmac('sha256', secretKey).update(JSON.stringify(body)).digest('hex');

    // 2. معالجة الأحداث
    if (event === 'pay' || data?.status === 'SUCCESS') {
      const orderId = data.merchantOrderId;
      const transactionId = data.transactionId;

      // TODO: قم بتحديث حالة الحجز في قاعدة البيانات (MySQL) إلى "PAID"
      // await db.query('UPDATE bookings SET status = ?, transaction_id = ? WHERE order_id = ?', ['SUCCESS', transactionId, orderId]);

      console.log(`Payment successful for Order: ${orderId}`);
    } else if (data?.status === 'FAILED') {
      const orderId = data.merchantOrderId;
      
      // TODO: تحديث حالة الحجز إلى "FAILED"
      console.log(`Payment failed for Order: ${orderId}`);
    }

    // 3. إرجاع استجابة 200 لكاشير لتأكيد وصول الإشعار
    return Response.json({ status: 'success' }, { status: 200 });

  } catch (error) {
    console.error('Webhook Error:', error);
    return Response.json({ message: 'Webhook processing failed' }, { status: 500 });
  }
}