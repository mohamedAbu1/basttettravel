// BookingSummaryCard.jsx
import React, { useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";
import { useData } from "@/context/DataContext";
import { motion } from "framer-motion";

const BookingSummaryCard = ({
  tourName,
  participants,
  checkInPrice,
  checkIn,
  childrenCount,
  checkOut,
}) => {
  const { theme } = useTheme();
  const { userData } = useAuth();
  const { handleLoginOpen } = useData();
  const [loading, setLoading] = useState(false);

  const childrenPrice = (checkInPrice * childrenCount) / 2;
  let total = checkInPrice * participants + childrenPrice;

  if (participants > 1) {
    total = total * 0.6;
  }

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
      const orderId = `BOOK-${Date.now()}`;
      const amountInEgp = total.toFixed(2);

      // 1. طلب الـ Hash من الـ API Route
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

      // 2. تشغيل الـ SDK وإرسال الحقل المطلوبة merchantRedirect
      try {
        const KashierSDK = await loadKashierScript();

        KashierSDK.init({
          merchantId: data.merchantId,
          apiKey: apiKey,
          amount: amountInEgp,
          currency: "EGP",
          orderId: orderId,
          hash: data.hash,
          mode: "live", // حولها إلى "live" للإنتاج المباشر
          merchantRedirect: redirectUrl,
          callbackUrl: redirectUrl,
          serverWebhook: webhookUrl,
          metaData: {
            tourName: tourName || "Cairo Tour",
            userEmail: userData?.email || "",
          },
          failureRedirect: true,
        });
      } catch (sdkError) {
        console.warn("SDK load failed, using direct hosted redirection:", sdkError);

        // التوجيه المباشر مع تضمين merchantRedirect في الرابط
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
    <div className={`${theme.card} p-6`}>
      <h2 className={`${theme.title} mb-4`}>Booking Summary</h2>

      <div className={`${theme.border} p-4 flex justify-between`}>
        <div>
          <p className={theme.text}>
            {tourName ||
              "Private Cairo Tour – Giza Pyramids, Sphinx & Grand Egyptian Museum (GEM)"}
          </p>
          <p className={theme.subText}>Participants: {participants || 0}</p>
          <p className={theme.subText}>Children: {childrenCount || 0}</p>
        </div>

        <div>
          <p className={theme.heading}>Total:</p>
          <p className={`${theme.title} text-lg`}>
            {!isNaN(total) ? `$${total.toFixed(2)}` : "$0.00"}
          </p>
        </div>
      </div>

      <div className="mt-6">
        <motion.button
          onClick={handleBookingClick}
          disabled={loading}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`${theme.buttonPrimary} w-full flex items-center justify-center gap-2 ${
            loading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          <span className="text-xl">🛒</span>
          <span>{loading ? "Processing..." : "Pay Trip"}</span>
        </motion.button>
      </div>
    </div>
  );
};

export default BookingSummaryCard;