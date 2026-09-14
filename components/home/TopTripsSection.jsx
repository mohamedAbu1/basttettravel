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
import { usePathname } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { useCurrency } from "@/context/CurrencyContext";

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

const TopTripsSection = () => {
  const { theme } = useTheme();
  const { t, i18n } = useTranslation("home");
  const { t: commonT } = useTranslation("common");
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname.split("/").filter(Boolean)[0] || "en";
  const { userData } = useAuth();
  const normalizedLang = i18n.language.split("-")[0];

  const { trips, fetchTrips, loadingTrips } = useTrip();
  const { currency, purchases } = usePurchase();
  const { rates } = useCurrency();

  useEffect(() => {
    fetchTrips();
  }, [fetchTrips]);

  if (loadingTrips) {
    return (
      <section id="top-trips" className={`top-trips-loading w-full `} aria-live="polite">
        <div className="section-loading-heading" aria-hidden="true" />
        <div className="top-trips-skeleton-grid" aria-label={commonT("loadingTopTrips")}>
          {[0, 1, 2].map((item) => <div key={item} className="trip-card-skeleton" />)}
        </div>
      </section>
    );
  }

  if (!trips.length) {
    return (
      <section id="top-trips" className={`top-trips-empty w-full `} aria-live="polite">
        <div className="empty-state-card">
          <span className="empty-state-mark" aria-hidden="true">𓂀</span>
          <h2>{commonT("noTripsAvailable", { defaultValue: "No trips are available right now." })}</h2>
          <p>{commonT("checkBackSoon", { defaultValue: "Please check back soon for new experiences." })}</p>
        </div>
      </section>
    );
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
      if (topTrips.length < 2) return undefined;
      const interval = setInterval(() => {
        setIndex((prev) => (prev + 1) % topTrips.length);
      }, 12000);
      return () => clearInterval(interval);
    }, [topTrips.length]);

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
        p.user_id === userData?.id &&
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
        className={`trip-showcase-card relative rounded-2xl w-74 h-[31rem] overflow-hidden group transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl`}
        style={{ border: `2px solid ${theme.logoBorder}` }}
      >
        {/* صورة الرحلة */}
        <div className="relative w-full h-[58%] shrink-0">
          <SafeTripImage
            src={trip?.cover_image || "/default.jpg"}
            alt={trip?.title?.[normalizedLang] || "Trip image"}
            fill
            sizes="(max-width: 767px) 90vw, (max-width: 1280px) 30vw, 360px"
            className="object-cover group-hover:scale-110 transition duration-700 rounded-lg"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
        </div>

        {/* النصوص تحت الصورة بدل absolute */}
        <div className="category-card-overlay trip-card-content flex flex-col justify-between p-5">
          <h3
            className="trip-card-title text-lg font-bold leading-snug line-clamp-2"
          >
            {trip?.title?.[normalizedLang] || "Untitled Trip"}
          </h3>

          <div className="flex items-center gap-2 mt-3 mb-4">
            <span className="trip-card-rating text-sm font-bold">
              ⭐ {trip?.rating || "4.5"}
            </span>
            <span className="trip-card-reviews text-xs">
              ({Array.isArray(trip?.reviews) ? trip.reviews.length : 0}{" "}
              {t("reviews")})
            </span>
          </div>
          <div className="flex items-center justify-between">
            <p className="trip-card-price text-lg font-extrabold">
              {convertPrice(trip?.group_price, trip?.currency)} {currency}
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => router.push(`/${locale}/trips/${trip?.id}`)}
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
        id="top-trips"
        className={`flex flex-col lg:hidden py-12 px-4 w-full mx-auto `}
      >
        <div className="relative flex items-center justify-center w-full mb-12">
          <h2 className="sc-title-first text-2xl font-extrabold tracking-wide drop-shadow-md text-gradient text-center">
            <span className="inline-block transform text-gradient scale-x-[-1] mr-4">𓅓</span>
            {t("TopTrips")}
            <span className="inline-block text-gradient ml-4">𓅓</span>
            <DividerWithIcon />
          </h2>
        </div>
        <MobileSlider />
      </section>

      {/* نسخة الديسكتوب */}
      <section
        id="top-trips"
        className={`hidden lg:flex w-full flex-col relative py-24 px-6 transition-colors duration-500`}
      >
        <div className="relative flex items-center justify-center w-full mb-12">
          <h2 className="sc-title-first text-5xl font-extrabold tracking-wide drop-shadow-md text-gradient text-center">
            <span className="inline-block transform text-gradient scale-x-[-1] mr-4">𓅓</span>
            {t("TopTrips")}
            <span className="inline-block text-gradient ml-4">𓅓</span>
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
