'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useTheme } from '@/context/ThemeContext';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { theme } = useTheme();
  const { t } = useTranslation("common");

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
              {t("bookingConfirmed")}
            </h1>
            <p className={`${theme.text} mb-8 text-center`}>
              {t("paymentThanks")}
            </p>

            <div className="grid grid-cols-2 gap-6 text-left mb-8">
              <div>
                <p className={theme.heading}><strong>{t("orderId")}</strong></p>
                <p className={theme.text}>{orderId}</p>
              </div>
              <div>
                <p className={theme.heading}><strong>{t("tour")}</strong></p>
                <p className={theme.text}>{tourName || t("unknownTour")}</p>
              </div>
              <div>
                <p className={theme.heading}><strong>{t("checkin")}</strong></p>
                <p className={theme.text}>{checkIn}</p>
              </div>
              <div>
                <p className={theme.heading}><strong>{t("checkout")}</strong></p>
                <p className={theme.text}>{checkOut}</p>
              </div>
              <div>
                <p className={theme.heading}><strong>{t("adults")}</strong></p>
                <p className={theme.text}>{participants}</p>
              </div>
              <div>
                <p className={theme.heading}><strong>{t("children")}</strong></p>
                <p className={theme.text}>{childrenCount}</p>
              </div>
            </div>

            <div className="text-center mb-8">
              <p className={`${theme.title} text-xl`}>
                💰 {t("totalPaid")} ${total}
              </p>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/')}
              className={`${theme.buttonPrimary} w-full py-3 rounded-xl font-semibold`}
            >
              {t("backHome")}
            </motion.button>
          </>
        ) : (
          <>
            <h1 className="text-red-600 text-3xl mb-4 text-center">{t("paymentFailed")}</h1>
            <p className={`${theme.subText} mb-8 text-center`}>
              {t("paymentError")}
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push('/')}
              className={`${theme.buttonSecondary} w-full py-3 rounded-xl font-semibold`}
            >
              {t("backHome")}
            </motion.button>
          </>
        )}
      </motion.div>
    </div>
  );
}
