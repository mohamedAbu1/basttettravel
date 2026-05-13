"use client";
import { FaCheckCircle } from "react-icons/fa";
import { useState } from "react";
import { usePurchase } from "@/context/PurchaseContext";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";

export default function ConfirmButton({
  trip,
  arrivalDate,
  departureDate,
  hasChildren,
  childrenCount,
  hasPets,
  pets,
  groupSize,
  hasGuide,
  guideLanguages,
}) {
  const { purchaseTrip } = usePurchase();
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const { theme } = useTheme(); // ✅ جلب الثيم
  const { t } = useTranslation("home"); // ✅ الترجمة

  const handlePurchase = async () => {
    setLoading(true);

    const bookingData = {
      tripId: trip,
      numPersons: groupSize,
      hasChildren,
      numChildren: childrenCount,
      hasPets,
      petTypes: pets,
      hasGuide,
      selectedLanguages: guideLanguages,
      arrivalDate,
      departureDate,
      userId: user.id,
      status: "Pending",
      platform: "web",
    };

    try {
      const result = await purchaseTrip(bookingData);

      if (result.success) {
        toast.success(t("TripBookedSuccessfully")); // ✅ مترجم
      } else {
        toast.error("❌ " + result.error);
      }
    } catch (err) {
      toast.error("❌ " + err.message);
    }

    setLoading(false);
  };

  return (
    <button
      onClick={handlePurchase}
      disabled={loading}
      className={`mt-4 w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition cursor-pointer ${
        loading
          ? "opacity-50 cursor-not-allowed"
          : theme.buttonSuccess // ✅ زر من الثيم
      }`}
    >
      <FaCheckCircle className="w-5 h-5 animate-pulse" />
      {loading ? t("Processing") : t("BookNow")}
    </button>
  );
}
