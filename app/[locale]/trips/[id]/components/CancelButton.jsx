"use client";
import React, { useState } from "react";
import { usePurchase } from "@/context/PurchaseContext";
import { useAuth } from "@/context/AuthContext";
import { toast } from "react-toastify";
import { useTranslation } from "react-i18next";

export default function CancelButton({ trip }) {
  const { cancelTrip } = usePurchase();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { userData } = useAuth(); // ✅ جلب المستخدم الحالي
  const { t } = useTranslation("trips");

  const cancelBooking = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await cancelTrip(trip.id, userData.id);
      if (result.success) {
        toast.success("✅ Booking cancelled successfully!");
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="mt-4">
      <button
        onClick={cancelBooking}
        disabled={loading}
        className="fixed bottom-6 left-6 rounded-[4px] px-6 py-3 bg-transparent backdrop-blur-md 
                   border border-[#C2A878] text-[#C2A878] font-semibold tracking-wide 
                   hover:bg-[#C2A878]/20 hover:text-white transition-all duration-300 
                   shadow-lg cursor-pointer"
      >
        {loading ? t("Cancelling") : t("CancelBooking")}
      </button>
      {error && <p className="text-red-500 mt-2">Error: {error}</p>}
    </div>
  );
}
