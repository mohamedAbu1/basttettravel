"use client";
import { FaStar, FaDollarSign, FaEuroSign, FaPoundSign } from "react-icons/fa";
import Image from "next/image";
import { useEffect, useState } from "react";
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
import { useSeasonalEvent } from "@/components/layout/SeasonalTheme";

const TRIP_IMAGE_FALLBACK = "/HomePageImage/asdasdas.webp";

function SafeTripImage({ src, ...props }) {
  const [imageSrc, setImageSrc] = useState(src || TRIP_IMAGE_FALLBACK);

  useEffect(() => {
    setImageSrc(src || TRIP_IMAGE_FALLBACK);
  }, [src]);

  return (
    <Image
      {...props}
      src={imageSrc}
      unoptimized={imageSrc.startsWith("http")}
      onError={() => setImageSrc(TRIP_IMAGE_FALLBACK)}
    />
  );
}

function localizedName(value, lang, fallback) {
  if (!value) return fallback;
  const parsed = typeof value === "string" ? (() => {
    try { return JSON.parse(value); } catch { return value; }
  })() : value;
  if (typeof parsed === "object") return parsed?.[lang] || parsed?.en || Object.values(parsed)[0] || fallback;
  return String(parsed);
}

export default function TripsGrid({ trips, cardStyle = "vertical" }) {
  const router = useRouter();
  const { userData } = useAuth();
  const { currency, purchases } = usePurchase();
  const { t } = useTranslation("trips");
  const { lang } = useLanguage();
  const { theme } = useTheme();
  const seasonalEvent = useSeasonalEvent();

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
        const reviews = Array.isArray(trip.reviews) ? trip.reviews : [];
        const avgStars = Math.max(
          0,
          Math.min(
            5,
            Number(trip.rating) ||
              (reviews.length
                ? reviews.reduce((sum, review) => sum + Number(review.rating || 0), 0) / reviews.length
                : 0),
          ),
        );
        const displayedPrice = convertPrice(trip.group_price, trip.currency);
        const discountedPrice = seasonalEvent
          ? (Number(displayedPrice) * (1 - seasonalEvent.discount / 100)).toFixed(2)
          : displayedPrice;

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
        let CurrencyIcon = FaDollarSign;
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
            className={`trip-list-card flex ${cardStyle === "vertical" ? "w-full flex-col" : "flex-row"} rounded-xl overflow-hidden`}
          >
           

          
             {/* قسم الصور بسليدر */}
            <div className={` ${cardStyle === "vertical" ? "w-full" : "lg:w-1/2"} w-full`}>
              <Swiper
                spaceBetween={10}
                slidesPerView={1}
                loop={(trip.images || []).filter(Boolean).length > 1}
                autoplay={{ delay: 3000 }}
                pagination={{ clickable: true }}
                navigation
                modules={[Autoplay, Pagination, Navigation]}
                className="h-[300px] lg:h-[400px]"
              >
                {(trip.images || [trip.cover_image]).map((img, idx) => (
                  <SwiperSlide key={idx}>
                    <SafeTripImage
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
            <div className={`${cardStyle === "vertical" ? "w-full" : "lg:w-1/2"} trip-list-copy w-full p-6 flex flex-col gap-4`}>
              <h3 className="trip-list-title text-xl font-bold">
                {trip.title?.[lang] || trip.title?.en || "Untitled"}
              </h3>

              <p className="trip-list-meta text-sm">
                {Array.isArray(trip.cities) && trip.cities.length > 0
                  ? trip.cities
                      .filter(Boolean)
                      .map((c) => localizedName(c.name, lang, "Unknown City"))
                      .join(", ")
                  : "Unknown City"}
              </p>

              <p className="trip-list-meta text-sm">
                {Array.isArray(trip.categories) && trip.categories.length > 0
                  ? trip.categories
                      .filter(Boolean)
                      .map((cat) => localizedName(cat.name, lang, "Unknown Category"))
                      .join(", ")
                  : t("NoCategory")}
              </p>

              <p className="trip-list-price text-lg font-semibold flex items-center gap-2">
                <CurrencyIcon style={{ color: currencyColor }} />
                {seasonalEvent && <span className="seasonal-old-price">{displayedPrice}</span>}
                <span>{discountedPrice} {currency}</span>
                {seasonalEvent && <span className="seasonal-discount-badge">-{seasonalEvent.discount}%</span>}
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
                <span className="text-sm text-gray-500" aria-label={avgStars.toFixed(1) + " out of 5 stars"}>
                  {avgStars ? avgStars.toFixed(1) : t("reviews")}
                </span>
              </div>

              <button
                type="button"
                onClick={() => router.push("/" + lang + "/trips/" + trip.id)}
                className="site-button site-button-primary trip-list-action mt-3 px-5 py-2 font-bold transition cursor-pointer shadow-md"
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
