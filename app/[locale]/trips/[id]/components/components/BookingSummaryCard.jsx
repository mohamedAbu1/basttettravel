import React, { useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";
import { useData } from "@/context/DataContext";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useSeasonalEvent } from "@/components/layout/SeasonalTheme";

const BookingSummaryCard = ({
  tourName,
  participants,
  checkInPrice,
  checkIn,
  childrenCount,
  checkOut,
  tripId, // ✅ أضفنا معرف الرحلة
}) => {
  const { theme } = useTheme();
  const { userData } = useAuth();
  const { handleLoginOpen } = useData();
  const [loading, setLoading] = useState(false);
  const { t, i18n } = useTranslation("common");
  const labels = {
    en: { participants: "Participants", children: "Children", pay: "Continue to payment", processing: "Preparing payment..." },
    de: { participants: "Teilnehmer", children: "Kinder", pay: "Weiter zur Zahlung", processing: "Zahlung wird vorbereitet..." },
    es: { participants: "Participantes", children: "Niños", pay: "Continuar al pago", processing: "Preparando el pago..." },
    fr: { participants: "Participants", children: "Enfants", pay: "Continuer vers le paiement", processing: "Préparation du paiement..." },
    it: { participants: "Partecipanti", children: "Bambini", pay: "Continua al pagamento", processing: "Preparazione del pagamento..." },
    zh: { participants: "参与者", children: "儿童", pay: "继续付款", processing: "正在准备付款..." },
  }[i18n.language?.split("-")[0]] || {
    participants: "Participants",
    children: "Children",
    pay: "Continue to payment",
    processing: "Preparing payment...",
  };

  const childrenPrice = (checkInPrice * childrenCount) / 2;
  let total = checkInPrice * participants + childrenPrice;
  const seasonalEvent = useSeasonalEvent();
  const originalTotal = total;

  if (participants > 1) {
    total = total * 0.6;
  }
  if (seasonalEvent) {
    total = total * (1 - seasonalEvent.discount / 100);
  }
let EGP = total * 49.85
  // تحميل سكريبت Kashier SDK
  const loadKashierScript = () => {
    return new Promise((resolve, reject) => {
      if (typeof window !== "undefined" && (window.Kashier || window.kashier)) {
        return resolve(window.Kashier || window.kashier);
      }

      const existingScript = document.getElementById("kashier-sdk");
      if (existingScript) {
        existingScript.remove();
      }

      const script = document.createElement("script");
      script.id = "kashier-sdk";
      script.src = "https://checkout.kashier.io/kashier-checkout.js";
      script.async = true;

      script.onload = () => {
        setTimeout(() => {
          const kashierObj = window.Kashier || window.kashier;
          if (kashierObj) {
            resolve(kashierObj);
          } else {
            reject(new Error("Kashier SDK script loaded but object missing."));
          }
        }, 200);
      };

      script.onerror = () => {
        reject(new Error("Failed to load Kashier SDK script."));
      };

      document.body.appendChild(script);
    });
  };

  const handleBookingClick = async () => {
    if (!participants || !checkInPrice || !checkIn || !checkOut) {
      toast.error("⚠️ Please complete all booking details before proceeding.");
      return;
    }

    if (!userData) {
      handleLoginOpen();
      toast.error("You must log in to book the trip");
      return;
    }

    setLoading(true);

    try {
      const amountInEgp = EGP.toFixed(2);

      // ✅ أولاً: إدخال بيانات الحجز في قاعدة البيانات
      const bookingRes = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          trip_id: tripId,
          participants,
          childrenCount,
          checkIn,
          checkOut,
          total: amountInEgp,
          userEmail: userData?.email,
        }),
      });

      const bookingData = await bookingRes.json();
      if (!bookingRes.ok || !bookingData.success) {
        throw new Error(bookingData.error || "Failed to save booking.");
      }
      // The webhook uses the server-created booking id to update this record.
      const orderId = bookingData.bookingId;
      // ✅ ثانياً: طلب الـ Hash من الـ API Route للدفع
      const res = await fetch("/api/kashier/hash", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: amountInEgp,
          currency: "EGP",
          orderId: orderId,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.hash) {
        throw new Error(data.error || "Failed to initialize payment hash.");
      }

      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || window.location.origin;
      const apiKey = process.env.NEXT_PUBLIC_KASHIER_API_KEY;
      const redirectUrl = `${baseUrl}/checkout/success`;
      const webhookUrl = `${baseUrl}/api/kashier/webhook`;

      // ✅ تشغيل الـ SDK
      try {
        const KashierSDK = await loadKashierScript();

        KashierSDK.init({
          merchantId: data.merchantId,
          apiKey: apiKey,
          amount: amountInEgp,
          currency: "EGP",
          orderId: orderId,
          hash: data.hash,
          mode: "live",
          merchantRedirect: redirectUrl,
          callbackUrl: redirectUrl,
          serverWebhook: webhookUrl,
          metaData: {
            tourName: tourName || "Cairo Tour",
            userEmail: userData?.email || "",
            bookingId: bookingData.bookingId, // ✅ ربط الدفع بالحجز
          },
          failureRedirect: true,
        });
      } catch (sdkError) {
        console.warn("SDK load failed, using direct hosted redirection:", sdkError);

        const mode = "live";
        const checkoutUrl = `https://checkout.kashier.io/?merchantId=${data.merchantId}&orderId=${orderId}&amount=${amountInEgp}&currency=EGP&hash=${data.hash}&mode=${mode}&apiKey=${apiKey}&merchantRedirect=${encodeURIComponent(redirectUrl)}&serverWebhook=${encodeURIComponent(webhookUrl)}`;

        window.location.href = checkoutUrl;
      }

    } catch (error) {
      console.error("🔴 Booking Error:", error);
      toast.error(error.message || "An error occurred while launching payment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={` p-6`}>
      <h2 className={`${theme.title} mb-4`}>{t("bookingSummary")}</h2>

      <div className={`${theme.border} p-4 flex justify-between`}>
        <div>
          <p className={theme.text}>
            {tourName ||
              "Private Cairo Tour – Giza Pyramids, Sphinx & Grand Egyptian Museum (GEM)"}
          </p>
          <p className={theme.subText}>{labels.participants}: {participants || 0}</p>
          <p className={theme.subText}>{labels.children}: {childrenCount || 0}</p>
        </div>

        <div>
          <p className={theme.heading}>{t("totalLabel")}</p>
          <p className={`${theme.title} text-lg`}>
            {!isNaN(total) ? (
              <>
                {seasonalEvent && <span className="seasonal-old-price">${originalTotal.toFixed(2)}</span>}
                <span>${total.toFixed(2)}</span>
                {seasonalEvent && <span className="seasonal-discount-badge">-{seasonalEvent.discount}%</span>}
              </>
            ) : "$0.00"}
          </p>
        </div>
      </div>

      <div className="mt-6">
        <motion.button
          onClick={handleBookingClick}
          disabled={loading || !participants || !checkInPrice || !checkIn || !checkOut}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`hero-primary-action w-full flex items-center justify-center gap-2 ${
            loading || !participants || !checkInPrice || !checkIn || !checkOut ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <span className="text-xl">🛒</span>
          <span>{loading ? labels.processing : labels.pay}</span>
        </motion.button>
      </div>
    </div>
  );
};

export default BookingSummaryCard;
