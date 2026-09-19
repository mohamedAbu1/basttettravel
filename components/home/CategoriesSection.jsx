"use client";

import Image from "next/image";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaArrowRight, FaCompass } from "react-icons/fa";
import { usePathname, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { useCitiesCategories } from "@/context/CitiesCategoriesContext";
import { useTheme } from "@/context/ThemeContext";

const FALLBACK_IMAGE = "/HomePageImage/asdasdas.webp";

function SafeImage({ src, alt }) {
  const [imageSrc, setImageSrc] = useState(src || FALLBACK_IMAGE);
  return <Image src={imageSrc} alt={alt} fill sizes="(max-width: 700px) 88vw, (max-width: 1100px) 42vw, 26vw" className="curated-collection-image" unoptimized={imageSrc.startsWith("http")} onError={() => setImageSrc(FALLBACK_IMAGE)} />;
}

const getName = (value, language, fallback) => {
  if (!value) return fallback;
  if (typeof value === "string") return value;
  return value[language] || value.en || Object.values(value).find(Boolean) || fallback;
};

const encodeData = (value) => btoa(unescape(encodeURIComponent(JSON.stringify(value))));

export default function CategoriesSection() {
  const { categories = [], loading, error, retry } = useCitiesCategories();
  const { theme } = useTheme();
  const { t, i18n } = useTranslation("home");
  const { t: commonT } = useTranslation("common");
  const router = useRouter();
  const pathname = usePathname();
  const language = i18n.language.split("-")[0];
  const locale = pathname.split("/").filter(Boolean)[0] || "en";

  const openCategory = (category) => {
    const name = getName(category.name, language, "All experiences");
    const encoded = encodeData({ city: "all", category: [name], group_price: "All", popular: false });
    router.push(`/${locale}/trips?data=${encoded}`);
  };

  if (loading) return <section className="curated-collection-section curated-section-loading"><div className="curated-collection-shell"><div className="curated-loading-line" /><div className="curated-loading-grid"><span /><span /><span /></div></div></section>;
  if (error) return <section className="curated-collection-section"><div className="curated-empty-state"><FaCompass /><strong>{commonT("collectionLoadError", { defaultValue: "We couldn't load experiences right now." })}</strong><span>{commonT("tryAgain", { defaultValue: "Please try again in a moment." })}</span><button type="button" onClick={retry}>{commonT("retry", { defaultValue: "Try again" })}</button></div></section>;
  if (!categories.length) return <section className="curated-collection-section"><div className="curated-empty-state"><FaCompass /><strong>No categories are available right now.</strong><span>{commonT("checkBackSoon", { defaultValue: "Please check back soon for new experiences." })}</span></div></section>;

  return <section className="curated-collection-section categories-showcase" style={{ "--collection-accent": theme.logoBorder }}>
    <div className="curated-collection-shell">
      <header className="curated-collection-header"><div><span className="curated-eyebrow">Basttet Travel · Find your pace</span><h2>{t("ExploreCategories")}</h2><p>{t("Discover")}</p></div><span className="curated-count"><strong>{String(categories.length).padStart(2, "0")}</strong><small>Ways to travel</small></span></header>
      <div className="curated-collection-grid">{categories.slice(0, 7).map((category, index) => { const name = getName(category.name, language, "Travel experience"); const image = category.images?.[0] || FALLBACK_IMAGE; return <motion.button type="button" key={category.id || name} className={`curated-collection-card ${index === 0 ? "is-featured" : ""}`} onClick={() => openCategory(category)} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: .15 }} transition={{ duration: .45, delay: index * .05 }}><SafeImage src={image} alt={name} /><span className="curated-card-overlay" /><span className="curated-card-number">{String(index + 1).padStart(2, "0")}</span><span className="curated-card-content"><small>{t("Explore")}</small><strong>{name}</strong><span className="curated-card-link">Discover collection <FaArrowRight /></span></span></motion.button>; })}</div>
    </div>
  </section>;
}
