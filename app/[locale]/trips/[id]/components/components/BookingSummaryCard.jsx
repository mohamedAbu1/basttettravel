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

  // دالة تضمن تحميل السكريبت والتأكد من توفر window.Kashier فعلياً
  const ensureKashierLoaded = () => {
    return new Promise((resolve, reject) => {
      // إذا كان كائن Kashier جاهزاً بالفعل
      if (typeof window !== "undefined" && window.Kashier) {
        return resolve(window.Kashier);
      }

      // إضافة السكريبت إلى DOM إن لم يكن موجوداً
      let script = document.getElementById("kashier-sdk");
      if (!script) {
        script = document.createElement("script");
        script.id = "kashier-sdk";
        script.src = "https://checkout.kashier.io/kashier-checkout.js";
        script.async = true;
        document.body.appendChild(script);
      }

      // محاولة فحص window.Kashier كل 100 ملي ثانية (حتى 5 ثوانٍ كحد أقصى)
      let attempts = 0;
      const interval = setInterval(() => {
        attempts++;
        if (typeof window !== "undefined" && window.Kashier) {
          clearInterval(interval);
          resolve(window.Kashier);
        } else if (attempts > 50) {
          clearInterval(interval);
          reject(new Error("Kashier SDK loading timed out. Please refresh."));
        }
      }, 100);
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
      // 1. التأكد التام من اكتمال تحميل كائن Kashier
      const Kashier = await ensureKashierLoaded();

      const orderId = `BOOK-${Date.now()}`;
      const amountInEgp = total.toFixed(2);

      // 2. طلب الـ Hash من الـ Backend Route
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
        throw new Error(data.error || "Failed to initialize payment hash");
      }

      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || window.location.origin;

      // 3. تهيئة الدفع عبر Kashier SDK
      Kashier.init({
        merchantId: data.merchantId,
        apiKey: process.env.NEXT_PUBLIC_KASHIER_API_KEY,
        amount: amountInEgp,
        currency: "EGP",
        orderId: orderId,
        hash: data.hash,
        mode: "test", // اضبطها على "live" في بيئة الإنتاج الفعلي
        metaData: {
          tourName: tourName || "Cairo Tour",
          userEmail: userData?.email || "",
        },
        callbackUrl: `${baseUrl}/checkout/success`,
        failureRedirect: true,
      });

    } catch (error) {
      console.error("Booking Error:", error);
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