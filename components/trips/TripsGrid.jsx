"use client";
import { FaStar, FaDollarSign, FaEuroSign, FaPoundSign } from "react-icons/fa";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { usePurchase } from "@/context/PurchaseContext";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { useCurrency } from "@/context/CurrencyContext"; // ✅ استدعاء الكونتكست
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
export default function TripsGrid({ trips, cardStyle = "vertical" }) {
  const router = useRouter();
  const { userData } = useAuth();
  const { currency, purchases } = usePurchase();
  const { t } = useTranslation("trips");
  const { lang } = useLanguage();
  const { theme } = useTheme();

  const getRandomStars = () => Math.floor(Math.random() * 3) + 3;
  const convertPrice = (group_price, tripCurrency) => {
    let converted = group_price;
    if (currency === "EUR" && tripCurrency === "USD") {
      converted = (group_price * 0.85).toFixed(2);
    } else if (currency === "USD" && tripCurrency === "EUR") {
      converted = (group_price * 1.18).toFixed(2);
    } else if (currency === "EGP" && tripCurrency === "USD") {
      converted = (group_price * 49.1).toFixed(2);
    } else if (currency === "USD" && tripCurrency === "EGP") {
      converted = (group_price / 49.1).toFixed(2);
    }
    return converted;
  };
  return (
    <div
      className={`flex-1 z-[0] ${
        cardStyle === "vertical"
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
          : "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6"
      } `}
    >
     {trips.map((trip, i) => {
        const avgStars = getRandomStars();
        const displayedPrice = convertPrice(trip.group_price, trip.currency);

        const hasPurchased =
          userData &&
          purchases.some(
            (p) =>
              p.user_id?.toString() === userData.id?.toString() &&
              p.trip_id?.toString() === trip.id?.toString() &&
              p.status !== "Cancelled",
          );

        const hasActivePurchase = purchases.some(
          (p) =>
            p.trip_id === trip.id &&
            p.user_id === userData?.id &&
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
              scale: 1.02,
              boxShadow: theme.shadow,
            }}
            className={`flex ${cardStyle === "vertical" ? "w-full flex-col" : "flex-row"} bg-white dark:bg-transparent rounded-xl shadow-lg overflow-hidden`}
          >
           

          
             {/* قسم الصور بسليدر */}
            <div className={` ${cardStyle === "vertical" ? "w-full" : "lg:w-1/2"} w-full`}>
              <Swiper
                spaceBetween={10}
                slidesPerView={1}
                loop
                autoplay={{ delay: 3000 }}
                pagination={{ clickable: true }}
                navigation
                modules={[Autoplay, Pagination, Navigation]}
                className="h-[300px] lg:h-[400px]"
              >
                {(trip.images || [trip.cover_image]).map((img, idx) => (
                  <SwiperSlide key={idx}>
                    <Image
                      src={img || "/default.jpg"}
                      alt={trip.title?.[lang] || trip.title?.en || "Trip image"}
                      width={1900}
                      height={400}
                      className="object-cover w-full h-full"
                    />
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
              {/* قسم المعلومات */}
            <div className={`${cardStyle === "vertical" ? "w-full" : "lg:w-1/2"} w-full p-6 flex flex-col gap-4`}>
              <h3 className="text-1xl font-bold text-[#C2A878]">
                {trip.title?.[lang] || trip.title?.en || "Untitled"}
              </h3>

              <p className="text-gray-600 dark:text-gray-500 text-sm">
                {Array.isArray(trip.cities) && trip.cities.length > 0
                  ? trip.cities
                      .filter(Boolean)
                      .map((c) => {
                        try {
                          const parsed = JSON.parse(c.name);
                          return (
                            parsed?.[lang] ||
                            parsed?.["en"] ||
                            Object.values(parsed)[0] ||
                            "Unknown City"
                          );
                        } catch {
                          return c.name || "Unknown City";
                        }
                      })
                      .join(", ")
                  : "Unknown City"}
              </p>

              <p className="text-gray-600 dark:text-gray-500 text-sm">
                {Array.isArray(trip.categories) && trip.categories.length > 0
                  ? trip.categories
                      .filter(Boolean)
                      .map((cat) => {
                        try {
                          const parsed = JSON.parse(cat.name);
                          return (
                            parsed?.[lang] ||
                            parsed?.["en"] ||
                            Object.values(parsed)[0] ||
                            "Unknown Category"
                          );
                        } catch {
                          return cat.name || "Unknown Category";
                        }
                      })
                      .join(", ")
                  : t("NoCategory")}
              </p>

              <p className="text-lg font-semibold flex items-center gap-2">
                <CurrencyIcon style={{ color: currencyColor }} />
                {displayedPrice} {currency}
              </p>

              <div className="flex items-center gap-2">
                {[...Array(5)].map((_, idx) => (
                  <FaStar
                    key={idx}
                    className={
                      idx < avgStars ? "text-yellow-400" : "text-gray-300"
                    }
                  />
                ))}
                <span className="text-sm text-gray-500">({t("reviews")})</span>
              </div>

              <button
                onClick={() => router.push(`/trips/${trip.id}`)}
                className="mt-3 px-5 py-2 rounded-lg font-bold transition cursor-pointer 
          bg-[#C2A878] text-white hover:bg-[#a58a60] shadow-md"
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
