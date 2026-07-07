"use client";
import { FaStar, FaDollarSign, FaEuroSign, FaPoundSign } from "react-icons/fa";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { usePurchase } from "@/context/PurchaseContext";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import { useEffect, useState } from "react";
import { useTheme } from "@/context/ThemeContext";

export default function TripsGrid({ trips, cardStyle = "vertical" }) {
  const router = useRouter();
  const { user } = useAuth();
  const { currency, purchases } = usePurchase();
  const { t } = useTranslation("trips");
  const { lang } = useLanguage();
  const { theme } = useTheme();

  const getRandomStars = () => Math.floor(Math.random() * 3) + 3;

  // 🟢 state لتخزين سعر الصرف
  const [exchangeRate, setExchangeRate] = useState({ USD_EGP: 49.1, EUR_USD: 1.18, USD_EUR: 0.85 });

  useEffect(() => {
    const fetchRate = async () => {
      try {
        const res = await fetch("https://api.exchangerate.host/latest?base=USD&symbols=EGP");
        const data = await res.json();
        if (data && data.rates && data.rates.EGP) {
          setExchangeRate((prev) => ({ ...prev, USD_EGP: data.rates.EGP }));
        }
      } catch (err) {
        console.error("Error fetching EGP rate:", err);
      }
    };
    fetchRate();
  }, []);

  // 🟢 دالة التحويل
  const convertPrice = (price, tripCurrency) => {
    let converted = price;
    if (currency === "EUR" && tripCurrency === "USD") {
      converted = (price * exchangeRate.USD_EUR).toFixed(2);
    } else if (currency === "USD" && tripCurrency === "EUR") {
      converted = (price * exchangeRate.EUR_USD).toFixed(2);
    } else if (currency === "EGP" && tripCurrency === "USD") {
      converted = (price * exchangeRate.USD_EGP).toFixed(2);
    }
    return converted;
  };

  return (
    <div
     className={`flex-1 z-[0] ${
        cardStyle === "vertical"
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          : "grid grid-cols-1 md:grid-cols-2 gap-6"
      } `}
    >
      {trips.map((trip, i) => {
        const avgStars = getRandomStars();
        const displayedPrice = convertPrice(trip.group_price, "USD");

        const hasPurchased =
          user &&
          purchases.some(
            (p) =>
              p.user_id?.toString() === user.id?.toString() &&
              p.trip_id?.toString() === trip.id?.toString() &&
              p.status !== "Cancelled",
          );

        // 🟢 اختيار الأيقونة حسب العملة
        let CurrencyIcon;
        let currencyColor;
        if (currency === "USD") {
          CurrencyIcon = FaDollarSign;
          currencyColor = theme.usdColor || "#2ecc71";
        } else if (currency === "EUR") {
          CurrencyIcon = FaEuroSign;
          currencyColor = theme.eurColor || "#3498db";
        } else if (currency === "EGP") {
          CurrencyIcon = FaPoundSign;
          currencyColor = theme.egpColor || "#b8860b";
        }

        return (
          <motion.div
            key={trip.id || i}
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            whileHover={{
              scale: 1.05,
              boxShadow: theme.shadow,
            }}
            className={`relative overflow-hidden ${theme.card} ${
              cardStyle === "vertical" ? "h-[400px]" : "h-[300px]"
            }`}
          >
            <Image
              src={trip.cover_image || "/default.jpg"}
              alt={trip.title?.[lang] || trip.title?.en || "Trip image"}
              width={660}
              height={400}
              className="object-cover w-full h-full rounded-lg"
              priority
            />

            <div className={`absolute bottom-0 p-4 w-full flex flex-col gap-2 ${theme.overlay} text-white`}>
              <h4 className={`text-lg font-bold ${theme.title}`}>
                {trip.title?.[lang] || trip.title?.en || "Untitled"}
              </h4>
              <p className={`${theme.subText} text-sm`}>
                {trip.trip_cities?.map((c) => c.cities?.name?.[lang] || c.cities?.name?.en || c.city_name).join(", ") ||
                  t("NoCity")}
              </p>
              <p className={`${theme.subText} text-sm`}>
                {trip.trip_categories?.map((cat) => cat.categories?.name?.[lang] || cat.categories?.name?.en).join(", ") ||
                  t("NoCategory")}
              </p>
              <p className="text-md font-semibold flex items-center gap-2">
                <span className={`px-2 py-1 rounded flex items-center gap-1 ${theme.buttonPrimary}`}>
                  <CurrencyIcon style={{ color: currencyColor }} />
                  {displayedPrice} {currency}
                </span>
              </p>

              <div className="flex items-center gap-2">
                {[...Array(5)].map((_, idx) => (
                  <FaStar
                    key={idx}
                    className={idx < avgStars ? theme.icon : theme.iconInactive}
                  />
                ))}
                <span className={`${theme.subText} text-sm`}>({t("reviews")})</span>
              </div>

              <button
                onClick={() => router.push(`/trips/${trip.id}`)}
                className={`mt-2 px-4 py-2 rounded-lg font-bold transition cursor-pointer ${
                  hasPurchased ? "bg-green-500 hover:bg-green-600" : theme.buttonPrimary
                }`}
              >
                {hasPurchased ? t("Tripdetails") : t("btn")}
              </button>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
