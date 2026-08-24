'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';
import { motion } from 'framer-motion';

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { theme } = useTheme();

  const paymentStatus = searchParams.get('paymentStatus');
  const orderId = searchParams.get('orderId');
  const tourName = searchParams.get('tourName');
  const checkIn = searchParams.get('checkIn');
  const checkOut = searchParams.get('checkOut');
  const participants = searchParams.get('participants');
  const childrenCount = searchParams.get('childrenCount');
  const total = searchParams.get('total');

  return (
    <div className={`${theme.background} min-h-screen flex items-center justify-center p-8`}>
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className={`${theme.card} w-full max-w-2xl p-10 rounded-2xl shadow-2xl`}
      >
        {paymentStatus === 'SUCCESS' ? (
          <>
            <h1 className={`${theme.title} text-3xl mb-4 text-center`}>
              🎉 Booking Confirmed!
            </h1>
            <p className={`${theme.text} mb-8 text-center`}>
              Thank you for your payment. Your trip has been successfully booked.
            </p>

            <div className="grid grid-cols-2 gap-6 text-left mb-8">
              <div>
                <p className={theme.heading}><strong>Order ID:</strong></p>
                <p className={theme.text}>{orderId}</p>
              </div>
              <div>
                <p className={theme.heading}><strong>Tour:</strong></p>
                <p className={theme.text}>{tourName || 'Cairo Tour – Giza Pyramids & GEM'}</p>
              </div>
              <div>
                <p className={theme.heading}><strong>Check-in:</strong></p>
                <p className={theme.text}>{checkIn}</p>
              </div>
              <div>
                <p className={theme.heading}><strong>Check-out:</strong></p>
                <p className={theme.text}>{checkOut}</p>
              </div>
              <div>
                <p className={theme.heading}><strong>Adults:</strong></p>
                <p className={theme.text}>{participants}</p>
              </div>
              <div>
                <p className={theme.heading}><strong>Children:</strong></p>
                <p className={theme.text}>{childrenCount}</p>
              </div>
            </div>

            <div className="text-center mb-8">
              <p className={`${theme.title} text-xl`}>
                💰 Total Paid: ${total}
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/')}
              className={`${theme.buttonPrimary} w-full py-3 rounded-xl font-semibold`}
            >
              Back to Home
            </motion.button>
          </>
        ) : (
          <>
            <h1 className="text-red-600 text-3xl mb-4 text-center">❌ Payment Failed</h1>
            <p className={`${theme.subText} mb-8 text-center`}>
              Something went wrong. Please try again or contact support.
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/')}
              className={`${theme.buttonSecondary} w-full py-3 rounded-xl font-semibold`}
            >
              Back to Home
            </motion.button>
          </>
        )}
      </motion.div>
    </div>
  );
}
