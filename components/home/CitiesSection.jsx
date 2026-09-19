"use client";

import Image from "next/image";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaArrowRight, FaMapMarkerAlt } from "react-icons/fa";
import { usePathname, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { canUseNextImageOptimizer } from "@/lib/media/image";
import { useCitiesCategories } from "@/context/CitiesCategoriesContext";
import { useTheme } from "@/context/ThemeContext";

const FALLBACK_IMAGE = "/HomePageImage/asdasdas.webp";

function SafeImage({ src, alt }) {
  const [imageSrc, setImageSrc] = useState(src || FALLBACK_IMAGE);
  return <Image src={imageSrc} alt={alt} fill sizes="(max-width: 700px) 88vw, (max-width: 1100px) 42vw, 26vw" className="curated-collection-image" unoptimized={!canUseNextImageOptimizer(imageSrc)} onError={() => setImageSrc(FALLBACK_IMAGE)} />;
}

const getName = (value, language, fallback) => {
  if (!value) return fallback;
  if (typeof value === "string") return value;
  return value[language] || value.en || Object.values(value).find(Boolean) || fallback;
};

const encodeData = (value) => btoa(unescape(encodeURIComponent(JSON.stringify(value))));

export default function CitiesSection() {
  const { cities = [], loading, error, retry } = useCitiesCategories();
  const { theme } = useTheme();
  const { t, i18n } = useTranslation("home");
  const { t: commonT } = useTranslation("common");
  const router = useRouter();
  const pathname = usePathname();
  const language = i18n.language.split("-")[0];
  const locale = pathname.split("/").filter(Boolean)[0] || "en";

  const openCity = (city) => {
    const name = getName(city.name, language, "Egypt");
    const encoded = encodeData({ city: [name], category: "all", group_price: "All", popular: false });
    router.push(`/${locale}/trips?data=${encoded}`);
  };

  if (loading) return <section className="curated-collection-section curated-section-loading"><div className="curated-collection-shell"><div className="curated-loading-line" /><div className="curated-loading-grid"><span /><span /><span /></div></div></section>;
  if (error) return <section className="curated-collection-section"><div className="curated-empty-state"><FaMapMarkerAlt /><strong>{commonT("collectionLoadError", { defaultValue: "We couldn't load destinations right now." })}</strong><span>{commonT("tryAgain", { defaultValue: "Please try again in a moment." })}</span><button type="button" onClick={retry}>{commonT("retry", { defaultValue: "Try again" })}</button></div></section>;
  if (!cities.length) return <section className="curated-collection-section"><div className="curated-empty-state"><FaMapMarkerAlt /><strong>No destinations are available right now.</strong><span>{commonT("checkBackSoon", { defaultValue: "Please check back soon for new experiences." })}</span></div></section>;

  return <section className="curated-collection-section cities-showcase" style={{ "--collection-accent": theme.logoBorder }}>
    <div className="curated-collection-shell">
      <header className="curated-collection-header"><div><span className="curated-eyebrow">Basttet Travel · Go somewhere memorable</span><h2>{t("ExploreCities")}</h2><p>From timeless monuments to quiet shores, choose the setting for your next story.</p></div><span className="curated-count"><strong>{String(cities.length).padStart(2, "0")}</strong><small>Egyptian destinations</small></span></header>
      <div className="curated-collection-grid">{cities.slice(0, 7).map((city, index) => { const name = getName(city.name, language, "Egypt"); const image = city.images?.[0] || FALLBACK_IMAGE; return <motion.button type="button" key={city.id || name} className={`curated-collection-card ${index === 0 ? "is-featured" : ""}`} onClick={() => openCity(city)} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .15 }} transition={{ duration: .45, delay: index * .05 }}><SafeImage src={image} alt={name} /><span className="curated-card-overlay" /><span className="curated-card-number">{String(index + 1).padStart(2, "0")}</span><span className="curated-card-content"><small><FaMapMarkerAlt /> Egypt</small><strong>{name}</strong><span className="curated-card-link">Explore destination <FaArrowRight /></span></span></motion.button>; })}</div>
    </div>
  </section>;
}
