"use client";

import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { FaArrowRight, FaClock, FaCompass, FaMapMarkerAlt, FaStar } from "react-icons/fa";
import { usePathname, useRouter } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";
import { useTrip } from "@/context/TripContext";
import { usePurchase } from "@/context/PurchaseContext";
import { useSeasonalEvent } from "@/components/layout/SeasonalTheme";
import { useAuth } from "@/context/AuthContext";
import { useCurrency } from "@/context/CurrencyContext";
import { canUseNextImageOptimizer } from "@/lib/media/image";

const FALLBACK_IMAGE = "/HomePageImage/asdasdas.webp";

function SafeTripImage({ src, alt, ...props }) {
  const [imageSrc, setImageSrc] = useState(src || FALLBACK_IMAGE);

  useEffect(() => setImageSrc(src || FALLBACK_IMAGE), [src]);

  return <Image {...props} src={imageSrc} alt={alt} unoptimized={!canUseNextImageOptimizer(imageSrc)} onError={() => setImageSrc(FALLBACK_IMAGE)} />;
}

function getLocalizedValue(value, language, fallback = "") {
  if (!value) return fallback;
  if (typeof value === "string") return value;
  return value[language] || value.en || Object.values(value).find(Boolean) || fallback;
}

const TopTripsSection = () => {
  const { theme } = useTheme();
  const { t, i18n } = useTranslation("home");
  const { t: commonT } = useTranslation("common");
  const { t: uiT } = useTranslation("ui");
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname.split("/").filter(Boolean)[0] || "en";
  const language = i18n.language.split("-")[0];
  const { userData } = useAuth();
  const { trips, fetchTrips, loadingTrips } = useTrip();
  const { currency, purchases } = usePurchase();
  const seasonalEvent = useSeasonalEvent();
  const { rates } = useCurrency();

  useEffect(() => {
    fetchTrips({ summary: "home" });
  }, [fetchTrips]);

  const topTrips = useMemo(() => [...trips]
    .sort((a, b) => (Array.isArray(b.reviews) ? b.reviews.length : 0) - (Array.isArray(a.reviews) ? a.reviews.length : 0))
    .slice(0, 5), [trips]);

  const convertPrice = (price, tripCurrency) => {
    const amount = Number(price || 0);
    if (currency === tripCurrency) return amount.toFixed(2);
    if (currency === "EUR" && tripCurrency === "USD") return (amount * (rates.EUR || 0.85)).toFixed(2);
    if (currency === "USD" && tripCurrency === "EUR") return (amount / (rates.EUR || 1.18)).toFixed(2);
    if (currency === "EGP" && tripCurrency === "USD") return (amount * (rates.USD || 49.1)).toFixed(2);
    if (currency === "USD" && tripCurrency === "EGP") return (amount / (rates.USD || 49.1)).toFixed(2);
    return amount.toFixed(2);
  };

  const openTrip = (trip) => router.push(`/${locale}/trips/${trip.id}`);

  if (loadingTrips && !trips.length) {
    return <section id="top-trips" className="top-trips-section top-trips-loading" aria-live="polite"><div className="top-trips-shell"><div className="top-trips-heading-skeleton" /><div className="top-trips-skeleton-grid"><div className="top-trip-skeleton top-trip-skeleton-featured" /><div className="top-trip-skeleton" /><div className="top-trip-skeleton" /></div></div></section>;
  }

  if (!topTrips.length) {
    return <section id="top-trips" className="top-trips-section"><div className="top-trips-shell"><div className="top-trips-empty"><FaCompass /><h2>{commonT("noTripsAvailable", { defaultValue: "No trips are available right now." })}</h2><p>{commonT("checkBackSoon", { defaultValue: "Please check back soon for new experiences." })}</p></div></div></section>;
  }

  const renderPrice = (trip) => {
    const originalPrice = convertPrice(trip.group_price, trip.currency);
    const discountedPrice = seasonalEvent ? (Number(originalPrice) * (1 - seasonalEvent.discount / 100)).toFixed(2) : originalPrice;
    return <div className="top-trip-price"><span className={seasonalEvent ? "top-trip-old-price" : ""}>{seasonalEvent && `${originalPrice} ${currency}`}</span><strong>{discountedPrice} <small>{currency}</small></strong>{seasonalEvent && <em>-{seasonalEvent.discount}%</em>}</div>;
  };

  const TripTile = ({ trip, featured = false, index = 0 }) => {
    const title = getLocalizedValue(trip.title, language, "Untitled experience");
    const location = getLocalizedValue(trip.location || trip.city, language, "Egypt");
    const reviewCount = Array.isArray(trip.reviews) ? trip.reviews.length : 0;
    const hasPurchased = purchases.some((purchase) => purchase.trip_id === trip.id && purchase.user_id === userData?.id && purchase.status !== "Cancelled");

    return <motion.article className={`top-trip-tile ${featured ? "is-featured" : ""}`} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.15 }} transition={{ duration: 0.45, delay: index * 0.06 }}>
      <button type="button" className="top-trip-image-wrap" onClick={() => openTrip(trip)} aria-label={title}>
        <SafeTripImage src={trip.cover_image} alt={title} fill sizes={featured ? "(max-width: 900px) 100vw, 58vw" : "(max-width: 900px) 82vw, 24vw"} className="top-trip-image" />
        <span className="top-trip-image-shade" /><span className="top-trip-index">{String(index + 1).padStart(2, "0")}</span>
        {featured && <span className="top-trip-featured-label"><FaStar /> {uiT("editorsPick")}</span>}<span className="top-trip-arrow"><FaArrowRight /></span>
      </button>
      <div className="top-trip-info">
        <div className="top-trip-meta"><span><FaMapMarkerAlt /> {location}</span><span><FaClock /> {trip.duration || 1} {trip.duration_unit || "days"}</span></div>
        <h3>{title}</h3>
        <div className="top-trip-bottom"><span className="top-trip-rating"><FaStar /> {trip.rating || "4.5"} <small>({reviewCount})</small></span>{renderPrice(trip)}</div>
        <button type="button" className="top-trip-cta" onClick={() => openTrip(trip)}>{hasPurchased ? t("Tripdetails") : t("BookNow")} <FaArrowRight /></button>
      </div>
    </motion.article>;
  };

  return <section id="top-trips" className="top-trips-section" style={{ "--top-trips-accent": theme.logoBorder }}>
    <div className="top-trips-shell">
      <header className="top-trips-heading"><div><span className="top-trips-eyebrow">{uiT("curatedJourneys")}</span><h2>{t("TopTrips")}</h2><p>{uiT("handpickedExperiences")}</p></div><button type="button" className="top-trips-view-all" onClick={() => router.push(`/${locale}/trips`)}>{uiT("exploreAllTrips")} <FaArrowRight /></button></header>
      <div className="top-trips-grid">{topTrips.map((trip, index) => <TripTile key={trip.id} trip={trip} index={index} featured={index === 0} />)}</div>
    </div>
  </section>;
};

export default TopTripsSection;
