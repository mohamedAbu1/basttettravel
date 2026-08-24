'use client';

import { useSearchParams } from 'next/navigation';

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const paymentStatus = searchParams.get('paymentStatus');
  const orderId = searchParams.get('orderId');

  return (
    <div style={{ padding: '50px', textAlign: 'center' }}>
      {paymentStatus === 'SUCCESS' ? (
        <div>
          <h1 style={{ color: 'green' }}>تم دفع الحجز بنجاح! 🎉</h1>
          <p>رقم الحجز الخاص بك: {orderId}</p>
        </div>
      ) : (
        <div>
          <h1 style={{ color: 'red' }}>فشلت عملية الدفع ❌</h1>
          <p>يرجى المحاولة مرة أخرى أو التواصل مع الدعم الفني.</p>
        </div>
      )}
    </div>
  );
}