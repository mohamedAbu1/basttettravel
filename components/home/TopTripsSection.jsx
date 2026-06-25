"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import DividerWithIcon from "../layout/DividerWithIcon";
import { useTrip } from "@/context/TripContext";
import { usePurchase } from "@/context/PurchaseContext";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

const TopTripsSection = () => {
  const { theme, themeName } = useTheme();
  const { t, i18n } = useTranslation("home");
  const router = useRouter();
  const { user } = useAuth();
  const normalizedLang = i18n.language.split("-")[0];

  const { trips, fetchTrips, loadingTrips } = useTrip();
  const { currency, purchases } = usePurchase();
  const [screenSize, setScreenSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const handleResize = () => {
      setScreenSize({ width: window.innerWidth, height: window.innerHeight });
    };

    handleResize(); // أول مرة
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  useEffect(() => {
    fetchTrips();
  }, []);

  // ✅ الرموز الفرعونية للديكور
  const symbols = [
    "𓂀",
    "𓋹",
    "𓆣",
    "𓇼",
    "𓇯",
    "𓏏",
    "𓎛",
    "𓊽",
    "𓃾",
    "𓅓",
    "𓈇",
    "𓉐",
    "𓊹",
    "𓌙",
    "𓍿",
    "𓎟",
  ];

  if (loadingTrips) {
    return <p className="text-center">Loading top trips...</p>;
  }

  const topTrips = [...trips]
    .sort(
      (a, b) =>
        (Array.isArray(b.reviews) ? b.reviews.length : 0) -
        (Array.isArray(a.reviews) ? a.reviews.length : 0),
    )
    .slice(0, 7);

  const convertPrice = (price, tripCurrency) => {
    let converted = price;
    if (currency === "EUR" && tripCurrency === "USD") {
      converted = (price * 0.85).toFixed(2);
    } else if (currency === "USD" && tripCurrency === "EUR") {
      converted = (price * 1.18).toFixed(2);
    }
    return converted;
  };

  return (
    <section
      className={`hidden lg:flex w-full flex-col relative py-24 px-6 transition-colors duration-500 ${theme.background}`}
    >
      {/* خلفية الرموز */}
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 25 }).map((_, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 0.25, y: 0 }}
            transition={{ duration: 1.2, delay: i * 0.1 }}
            className="absolute text-6xl"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              transform: `rotate(${Math.random() * 360}deg)`,
              color: theme.icon,
            }}
          >
            {symbols[Math.floor(Math.random() * symbols.length)]}
          </motion.span>
        ))}
      </div>

      {/* العنوان */}
      <div className="relative flex items-center justify-center w-full mb-12">
        {/* صورة يسار */}
        <div
          className="absolute -translate-y-1/2 scale-x-[-1] opacity-40 pointer-events-none"
          style={{
            left: screenSize.width * 0.05, // 10% من عرض الشاشة
            top: screenSize.height * 0.0, // 20% من ارتفاع الشاشة
            width: "420px",
            height: "200px",
          }}
        >
          <Image
           src={
              themeName === "dark"
                ? "/HomePageImage/ancient-egyptian-winged-goddess-isis-statue-white-background.webp"
                : "/HomePageImage/cruiseliner.svg"
            }
            alt="Decorative Left"
            fill
            className="object-contain"
          />
        </div>

        {/* النص */}
        <h2 className="sc-title-first text-5xl font-extrabold tracking-wide drop-shadow-md text-gradient text-center">
          <span className="inline-block transform scale-x-[-1] mr-4">𓅓</span>
          {t("TopTrips")}
          <span className="inline-block ml-4">𓅓</span>
          <DividerWithIcon />
        </h2>

        {/* صورة يمين */}
        <div
          className="absolute -translate-y-1/2 opacity-40 pointer-events-none "
          style={{
            right: screenSize.width * 0.05, // 10% من عرض الشاشة
            top: screenSize.height * 0.0, // 20% من ارتفاع الشاشة
            width: "420px",
            height: "200px",
          }}
        >
          <Image
            src={
              themeName === "dark"
                ? "/HomePageImage/ancient-egyptian-winged-goddess-isis-statue-white-background.webp"
                : "/HomePageImage/cruiseliner.svg"
            }
            alt="Decorative Right"
            fill
            className="object-contain"
          />
        </div>
      </div>

      {/* الكروت */}
      <div className="flex flex-wrap justify-center gap-8 max-w-7xl w-full mx-auto relative z-10">
        {topTrips.map((trip, i) => {
          const hasPurchased = purchases.some(
            (p) =>
              p.trip_id === trip.id &&
              p.user_id === user?.id &&
              p.status !== "Cancelled",
          );

          return (
            <motion.div
              key={trip.id || i}
              initial={{ opacity: 0, y: 50, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.8, delay: i * 0.2 }}
              viewport={{ once: true }}
              className={`${theme.card} flex-1 basis-full sm:basis-[48%] lg:basis-[30%] xl:basis-[22%] relative rounded-2xl overflow-hidden group transition-all duration-500 hover:scale-[1.05] hover:shadow-2xl hover:-rotate-1`}
              style={{ border: `2px solid ${theme.logoBorder}` }}
            >
              <div className="relative h-72">
                <Image
                  src={trip.cover_image || "/default.jpg"}
                  alt={trip.title?.[normalizedLang] || "Trip image"}
                  fill
                  className="object-cover group-hover:scale-110 transition duration-700 rounded-lg"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
              </div>

              <div className="absolute inset-0 flex flex-col justify-end p-6">
                <h3
                  className={`trips-text text-xl font-bold tracking-wide mb-1 ${theme.title}`}
                >
                  {trip.title?.[normalizedLang] || "Untitled Trip"}
                </h3>

                <div className="flex items-center gap-2 mb-2">
                  <span className="text-yellow-400 text-lg font-semibold">
                    ⭐ {trip.rating || "4.5"}
                  </span>
                  <span className={`text-sm opacity-80 ${theme.subText}`}>
                    ({Array.isArray(trip.reviews) ? trip.reviews.length : 0}{" "}
                    {t("reviews")})
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <p className={`text-lg font-semibold ${theme.text}`}>
                    {convertPrice(trip.price, trip.currency)} {currency}
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => router.push(`/trips/${trip.id}`)}
                    className={`rounded-[9px] px-3 py-2 font-semibold tracking-wide cursor-pointer transition-all duration-300 shadow-lg ${theme.buttonPrimary}`}
                    style={{ border: `2px solid ${theme.logoBorder}` }}
                  >
                    {hasPurchased ? t("Tripdetails") : t("BookNow")}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};

export default TopTripsSection;
