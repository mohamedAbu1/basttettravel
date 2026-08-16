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
import { useCurrency } from "@/context/CurrencyContext";

const TopTripsSection = () => {
  const { theme } = useTheme();
  const { t, i18n } = useTranslation("home");
  const router = useRouter();
  const { user } = useAuth();
  const normalizedLang = i18n.language.split("-")[0];

  const { trips, fetchTrips, loadingTrips } = useTrip();
  const { currency, purchases } = usePurchase();
  const { rates } = useCurrency();

  useEffect(() => {
    fetchTrips();
  }, []);

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

  const convertPrice = (group_price, tripCurrency) => {
    let converted = group_price;
    if (currency === "EUR" && tripCurrency === "USD") {
      converted = (group_price * (rates.EUR || 0.85)).toFixed(2);
    } else if (currency === "USD" && tripCurrency === "EUR") {
      converted = (group_price * (1 / (rates.EUR || 1.18))).toFixed(2);
    } else if (currency === "EGP" && tripCurrency === "USD") {
      converted = (group_price * (rates.USD || 49.1)).toFixed(2);
    } else if (currency === "USD" && tripCurrency === "EGP") {
      converted = (group_price / (rates.USD || 49.1)).toFixed(2);
    }
    return converted;
  };

  // نسخة الموبايل بدون أي أنيميشن
  const MobileSlider = () => {
    const [index, setIndex] = useState(0);

    useEffect(() => {
      const interval = setInterval(() => {
        setIndex((prev) => (prev + 1) % topTrips.length);
      }, 12000);
      return () => clearInterval(interval);
    }, []);

    return (
      <div className="flex flex-col items-center gap-6 w-full">
        <div key={index} className="w-[90%] max-w-sm">
          <TripCard trip={topTrips[index]} disableAnimation />
        </div>
      </div>
    );
  };

  // كارت الرحلة
  const TripCard = ({ trip, disableAnimation = false }) => {
    const hasPurchased = purchases.some(
      (p) =>
        p.trip_id === trip.id &&
        p.user_id === user?.id &&
        p.status !== "Cancelled",
    );

    const CardWrapper = disableAnimation ? "div" : motion.div;

    return (
      <CardWrapper
        key={trip?.id}
        {...(!disableAnimation && {
          initial: { opacity: 0, y: 50, scale: 0.95 },
          whileInView: { opacity: 1, y: 0, scale: 1 },
          transition: { duration: 0.8 },
          viewport: { once: true },
        })}
        className={`${theme.card} relative rounded-2xl overflow-hidden group transition-all duration-500 hover:scale-[1.05] hover:shadow-2xl`}
        style={{ border: `2px solid ${theme.logoBorder}` }}
      >
        <div className="relative w-full h-72">
          <Image
            src={trip?.cover_image || "/default.jpg"}
            alt={trip?.title?.[normalizedLang] || "Trip image"}
            fill
            className="object-cover group-hover:scale-110 transition duration-700 rounded-lg"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
        </div>

        <div className="absolute inset-0 flex flex-col justify-end p-6">
          <h3 className={`trips-text text-xl font-bold mb-1 ${theme.title}`}>
            {trip?.title?.[normalizedLang] || "Untitled Trip"}
          </h3>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-yellow-400 text-lg font-semibold">
              ⭐ {trip?.rating || "4.5"}
            </span>
            <span className={`text-sm opacity-80 ${theme.subText}`}>
              ({Array.isArray(trip?.reviews) ? trip.reviews.length : 0}{" "}
              {t("reviews")})
            </span>
          </div>
          <div className="flex items-center justify-between">
            <p className={`text-lg font-semibold ${theme.text}`}>
              {convertPrice(trip?.group_price, trip?.currency)} {currency}
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push(`/trips/${trip?.id}`)}
              className={`rounded-[9px] px-3 py-2 font-semibold tracking-wide cursor-pointer transition-all duration-300 shadow-lg ${theme.buttonPrimary}`}
              style={{ border: `2px solid ${theme.logoBorder}` }}
            >
              {hasPurchased ? t("Tripdetails") : t("BookNow")}
            </motion.button>
          </div>
        </div>
      </CardWrapper>
    );
  };

  return (
    <>
      {/* نسخة الموبايل */}
      <section
        className={`flex flex-col lg:hidden py-12 px-4 w-full mx-auto ${theme.background}`}
      >
        <div className="relative flex items-center justify-center w-full mb-12">
          <h2 className="sc-title-first text-2xl font-extrabold tracking-wide drop-shadow-md text-gradient text-center">
            <span className="inline-block transform scale-x-[-1] mr-4">𓅓</span>
            {t("TopTrips")}
            <span className="inline-block ml-4">𓅓</span>
            <DividerWithIcon />
          </h2>
        </div>
        <MobileSlider />
      </section>

      {/* نسخة الديسكتوب */}
      <section
        className={`hidden lg:flex w-full flex-col relative py-24 px-6 transition-colors duration-500 ${theme.background}`}
      >
        <div className="relative flex items-center justify-center w-full mb-12">
          <h2 className="sc-title-first text-5xl font-extrabold tracking-wide drop-shadow-md text-gradient text-center">
            <span className="inline-block transform scale-x-[-1] mr-4">𓅓</span>
            {t("TopTrips")}
            <span className="inline-block ml-4">𓅓</span>
            <DividerWithIcon />
          </h2>
        </div>
        <div className="flex flex-wrap justify-center gap-8 max-w-7xl w-full mx-auto relative z-10">
          {topTrips.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      </section>
    </>
  );
};

export default TopTripsSection;
