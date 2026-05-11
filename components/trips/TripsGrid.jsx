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
            className={`relative rounded-xl shadow-lg overflow-hidden  transform transition border border-[#c9a34a]/30 ${cardStyle === "vertical" ? "h-[400px]" : " h-[300px]"}`}
          >
            <Image
              src={trip.cover_image || "/default.jpg"}
              alt={trip.title?.[lang] || trip.title?.en || "Trip image"}
              width={660}
              height={400}
              className="object-cover w-full h-full rounded-lg"
              priority
            />

            <div className="absolute bottom-0 p-4 w-full flex flex-col gap-2 text-white bg-gradient-to-t from-black/70 to-transparent">
              <h4 className="text-lg font-bold">
                {trip.title?.[lang] || trip.title?.en || "Untitled"}
              </h4>
              <p className="text-sm opacity-90">
                {trip.trip_cities
                  ?.map(
                    (c) =>
                      c.cities?.name?.[lang] ||
                      c.cities?.name?.en ||
                      c.city_name,
                  )
                  .join(", ") || t("NoCity")}{" "}
              </p>
              <p className="text-sm opacity-90">
                {" "}
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
              <p className="text-md font-semibold flex items-center gap-2">
                <span className="px-2 py-1 rounded flex items-center gap-1 bg-[#c9a34a] text-white">
                  {currency === "USD" ? <FaDollarSign /> : <FaEuroSign />}
                  {displayedPrice} {currency}
                </span>
              </p>

              <div className="flex items-center gap-2">
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
                <span className="text-sm opacity-80">({t("reviews")})</span>
              </div>

              <button
                onClick={() => router.push(`/trips/${trip.id}`)}
                className={`mt-2 px-4 cursor-pointer py-2 rounded-lg font-bold transition text-white ${
                  hasPurchased
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-[#c9a34a] hover:bg-yellow-500"
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
