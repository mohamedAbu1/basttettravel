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
  const { theme } = useTheme();
  const { t } = useTranslation("home");

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
        toast.success(t("TripBookedSuccessfully"));
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
      onClick={async () => {
        try {
          const res = await fetch("/api/paymob", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              amount: 100,
              userDetails: {
                email: "test@example.com",
                firstName: "Mohamed",
                lastName: "Ahmed",
                phone: "+201000000000",
              },
            }),
          });

          const data = await res.json();

          if (data.error) {
            alert("Error: " + data.error);
          } else {
            // افتح الـ Iframe مع الـ Payment Token
            const iframeUrl = `${process.env.PAYMOB_IFRAME_URL}?payment_token=${data.token}`;
            window.location.href = iframeUrl;
          }
        } catch (err) {
          alert("Failed: " + err.message);
        }
      }}
      disabled={loading}
      className={`mt-4 w-full py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition cursor-pointer ${
        loading ? "opacity-50 cursor-not-allowed" : theme.buttonSuccess
      }`}
    >
      <FaCheckCircle className="w-5 h-5 animate-pulse" />
      {loading ? t("Processing") : t("BookNow")}
    </button>
  );
}
