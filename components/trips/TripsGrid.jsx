"use client";
import { FaStar, FaDollarSign, FaEuroSign } from "react-icons/fa";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { usePurchase } from "@/context/PurchaseContext";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";

export default function TripsGrid({ trips, cardStyle = "vertical" }) {
  const router = useRouter();
  const { user } = useAuth();
  const { currency, purchases } = usePurchase();
  const { t } = useTranslation("trips");
  const { lang } = useLanguage();

  const getRandomStars = () => Math.floor(Math.random() * 3) + 3;

  return (
    <div
      className={`flex-1 z-[0] ${
        cardStyle === "vertical"
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          : "grid grid-cols-1 md:grid-cols-2 gap-6"
      }`}
    >
      {trips.map((trip, i) => {
        const avgStars = getRandomStars();

        let displayedPrice = trip.price;
        if (currency === "EUR") {
          displayedPrice = (trip.price * 0.85).toFixed(2);
        }

        const hasPurchased =
          user &&
          purchases.some(
            (p) =>
              p.user_id?.toString() === user.id?.toString() &&
              p.trip_id?.toString() === trip.id?.toString() &&
              p.status !== "Cancelled"
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
            className={`trip-card ${
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

            <div className="trip-overlay">
              <h4 className="trip-title">
                {trip.title?.[lang] || trip.title?.en || "Untitled"}
              </h4>
              <p className="trip-sub">
                {trip.trip_cities
                  ?.map(
                    (c) =>
                      c.cities?.name?.[lang] ||
                      c.cities?.name?.en ||
                      c.city_name
                  )
                  .join(", ") || t("NoCity")}
              </p>
              <p className="trip-sub">
                {trip.trip_categories
                  ?.map((cat) => {
                    const catName =
                      cat.categories?.name?.[lang] ||
                      cat.categories?.name?.en ||
                      cat.categories?.name;
                    return catName;
                  })
                  .join(", ") || t("NoCategory")}
              </p>

              <p className="trip-price">
                <span className="price-badge">
                  {currency === "USD" ? <FaDollarSign /> : <FaEuroSign />}
                  {displayedPrice} {currency}
                </span>
              </p>

              <div className="trip-stars">
                {[...Array(5)].map((_, idx) => (
                  <FaStar
                    key={idx}
                    className={`${
                      idx < avgStars
                        ? "text-yellow-400"
                        : "text-gray-500 opacity-50"
                    }`}
                  />
                ))}
                <span className="reviews-text">({t("reviews")})</span>
              </div>

              <button
                onClick={() => router.push(`/trips/${trip.id}`)}
                className={`trip-button ${
                  hasPurchased ? "btn-purchased" : "btn-primary"
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
