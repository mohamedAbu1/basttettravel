/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/purity */
"use client";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { useTrip } from "@/context/TripContext";
import { useCitiesCategories } from "@/context/CitiesCategoriesContext";
import { useReviews } from "@/context/ReviewsContext";
import { useEffect } from "react";
import { FaStar, FaDollarSign, FaEuroSign } from "react-icons/fa";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { usePurchase } from "@/context/PurchaseContext";
import { useQueryFilters } from "@/context/QueryContext";
import { useAuth } from "@/context/AuthContext";
export default function TripsGrid({ cardStyle = "vertical", search }) {
  const { themeName } = useTheme();
  const { trips, fetchTrips, loadingTrips } = useTrip();
  const { lang } = useLanguage();
  const { categories: allCategories } = useCitiesCategories();
  const { reviewsByTrip, fetchReviewsByTrip } = useReviews();
  const router = useRouter();
  const { filterTrips } = useQueryFilters();
  const { user } = useAuth(); // ✅ المستخدم الحالي// ✅ جلب المستخدم الحالي
  const { currency, purchases } = usePurchase(); // ✅ جلب العملة والحجوزات

  useEffect(() => {
    fetchTrips();
  }, []);

  useEffect(() => {
    if (trips.length > 0) {
      trips.forEach((trip) => {
        fetchReviewsByTrip(trip.id);
      });
    }
  }, [trips]);

  const getRandomStars = () => Math.floor(Math.random() * 3) + 3;
  const { t } = useTranslation("trips");

  if (loadingTrips) {
    return <p className="text-center text-gray-500">Loading trips...</p>;
  }

  // فلترة الكويري
  const filteredTrips = filterTrips(trips, allCategories, lang);

  // فلترة البحث النصي
  const searchedTrips =
    search && search.trim() !== ""
      ? filteredTrips.filter((trip) => {
          const lowerSearch = search.toLowerCase();
          const title = trip.title?.[lang] || trip.title?.en || "";
          const cityNames =
            trip.trip_cities?.map(
              (c) =>
                c.cities?.name?.[lang] || c.city?.name?.[lang] || c.city_name,
            ) || [];
          const categoryNames =
            trip.trip_categories?.map((cat) => {
              const catObj = allCategories.find(
                (c) => c.id === cat.category_id,
              );
              return catObj?.name?.[lang] || catObj?.name?.en || catObj?.name;
            }) || [];

          return (
            title.toLowerCase().includes(lowerSearch) ||
            cityNames.some((c) => c.toLowerCase().includes(lowerSearch)) ||
            categoryNames.some((c) => c.toLowerCase().includes(lowerSearch))
          );
        })
      : filteredTrips;
  // ✅ تحقق إذا كان المستخدم الحالي اشترى هذه الرحلة

  return (
    <div
      className={`flex-1 ${
        cardStyle === "vertical"
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          : "grid grid-cols-1 md:grid-cols-2 gap-6"
      }`}
    >
      {searchedTrips.map((trip, i) => {
        const tripReviews = reviewsByTrip[trip.id] || [];
        const reviewsCount = tripReviews.length;

        const avgStars =
          reviewsCount > 0
            ? Math.round(
                tripReviews.reduce((sum, r) => sum + (r.stars || 0), 0) /
                  reviewsCount,
              )
            : getRandomStars();

        const getLocalizedText = (obj, lang) => {
          if (!obj) return "Unknown";
          if (typeof obj === "string") return obj;
          return obj[lang] || obj["en"] || "Unknown";
        };

        const tripCities =
          trip.trip_cities?.length > 0
            ? trip.trip_cities
                .map(
                  (c) =>
                    getLocalizedText(c.cities?.name, lang) ||
                    getLocalizedText(c.city?.name, lang) ||
                    getLocalizedText(c.city_name, lang),
                )
                .join(" • ")
            : "Unknown";

        const tripCategories =
          trip.trip_categories?.length > 0
            ? trip.trip_categories
                .map((cat) => {
                  const catObj = allCategories.find(
                    (category) => category.id === cat.category_id,
                  );
                  return (
                    catObj?.name?.[lang] ||
                    catObj?.name?.["en"] ||
                    catObj?.name ||
                    "General"
                  );
                })
                .join(" • ")
            : "General";

        let displayedPrice = trip.price;
        if (currency === "EUR" && trip.currency === "USD") {
          displayedPrice = (trip.price * 0.85).toFixed(2);
        } else if (currency === "USD" && trip.currency === "EUR") {
          displayedPrice = (trip.price * 1.18).toFixed(2);
        }
 const hasPurchased = purchases.some(
            (p) =>
              p.trip_id === trip.id &&
              p.user_id === user?.id &&
              p.status !== "Cancelled",
          );
        return (
          <motion.div
            key={trip.id || i}
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            whileHover={{
              scale: 1.05,
              boxShadow: "0px 8px 20px rgba(0,0,0,0.3)",
            }}
            className={`relative rounded-xl shadow-lg overflow-hidden transform transition 
              ${
                themeName === "dark"
                  ? "border border-[#c9a34a]/30"
                  : "border border-[#c9a34a]/30"
              } 
              ${cardStyle === "horizontal" ? "h-86 flex" : "h-88"}`}
          >
            {/* صورة الرحلة */}
            <Image
              src={trip.cover_image || "/default.jpg"}
              alt={trip.title?.[lang] || trip.title?.en || "Trip image"}
              width={660}
              height={800}
              className="object-cover w-full h-full rounded-lg"
              priority
            />
            {/* Overlay */}
            <div
              className={`absolute inset-0 bg-gradient-to-t ${
                themeName === "dark"
                  ? "from-black/80 via-black/40 to-transparent"
                  : "from-[#3a2c0a]/70 via-[#3a2c0a]/40 to-transparent"
              }`}
            />
            {/* محتوى الكارد */}
            <div
              className={`absolute bottom-0 p-4 w-full flex flex-col gap-2 text-white ${
                cardStyle === "horizontal" ? "justify-center" : ""
              }`}
            >
              <h4
                className={`trips-text text-lg font-bold`} style={{
            WebkitTextStroke:
              themeName === "dark" ? "1px #C2A878" : "1px #fff",
            textShadow:
              themeName === "dark"
                ? "2px 2px 6px rgba(0,0,0,0.6)"
                : "2px 2px 6px rgba(255,255,255,0.3)",
          }}
              >
                {trip.title?.[lang] || trip.title?.en || "Untitled"}
              </h4>

              <p className="text-sm opacity-90">
                {tripCities} • {tripCategories}
              </p>

              <p className="text-md font-semibold flex items-center gap-2">
                <span
                  className="rounded-[9px] px-3 py-2 flex flex-row items-center
             bg-transparent backdrop-blur-md 
             border border-[#C2A878] 
             text-[#C2A878] font-semibold tracking-wide
             hover:bg-[#C2A878]/20 hover:text-white 
             transition-all duration-300 shadow-lg cursor-pointer"
                >
                  {currency === "USD" ? <FaDollarSign /> : <FaEuroSign />}
                  {displayedPrice} {currency}
                </span>
              </p>

              <div className="flex items-center gap-2">
                {(() => {
                  // ✅ توليد رقم عشوائي بين 3 و 5
                  const randomStars = Math.floor(Math.random() * 3) + 3;
                  return [...Array(5)].map((_, idx) => (
                    <FaStar
                      key={idx}
                      className={`${
                        idx < randomStars
                          ? "text-yellow-400"
                          : "text-gray-500 opacity-50"
                      }`}
                    />
                  ));
                })()}
                <span className="text-sm opacity-80">
                  ({reviewsCount > 0 ? reviewsCount : "No"} {t("reviews")})
                </span>
              </div>

              <button
                style={{ cursor: "pointer" }}
                onClick={() => router.push(`/trips/${trip.id}`)}
                className="rounded-[9px] px-3 py-2 
             bg-transparent backdrop-blur-md 
             border border-[#C2A878] 
             text-[#C2A878] font-semibold tracking-wide
             hover:bg-[#C2A878]/20 hover:text-white 
             transition-all duration-300 shadow-lg cursor-pointer"
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
