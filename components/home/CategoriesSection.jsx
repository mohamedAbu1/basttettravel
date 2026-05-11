"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useCitiesCategories } from "@/context/CitiesCategoriesContext";
import DividerWithIcon from "../layout/DividerWithIcon";
import { useRouter } from "next/navigation";

// دالة لتشفير الكويري
const encodeData = (obj) => btoa(JSON.stringify(obj));
function CategoryCard({ cat, themeName, language }) {
  const [imgIndex, setImgIndex] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      setImgIndex((prev) => (prev + 1) % (cat.images?.length || 1));
    }, 4000);
    return () => clearInterval(interval);
  }, [cat.images]);

  // هنا بنحدد الاسم المعروض حسب اللغة
  const displayName =
    typeof cat.name === "object"
      ? cat.name?.[language] || cat.name?.en || cat.name
      : cat.name;

const luxuryNames = [
  "Luxusreisen",
  "Luxury Tours",
  "Tours de lujo",
  "Voyages de luxe",
  "Tour di lusso",
  "豪华旅游"
];


const handleClick = () => {
  const queryObj = {
    city: "all",
    category: [displayName],
    price: luxuryNames.includes(displayName) ? "Luxury" : "All",
    popular: false,
  };
  const encoded = encodeData(queryObj);
  router.push(`/trips?data=${encoded}`);
};
  return (
    <div
      onClick={handleClick}
      className={`relative rounded-2xl overflow-hidden group cursor-pointer h-[320px]
        transition-all duration-500 hover:scale-[1.06] hover:shadow-2xl
        ${
          themeName === "dark"
            ? "bg-[#1a1a1a] border border-gold/20 shadow-lg"
            : "bg-[#fff8e1] border border-[#c9a34a]/30 shadow-md"
        }
      `}
    >
      <AnimatePresence mode="sync">
        <motion.div
          key={imgIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <Image
            src={
              cat.images?.[imgIndex]?.startsWith("/")
                ? cat.images[imgIndex]
                : cat.images?.[imgIndex]?.startsWith("http")
                  ? cat.images[imgIndex]
                  : "/fallback.jpg"
            }
            alt={displayName}
            fill
            className="object-cover rounded-lg"
          />
        </motion.div>
      </AnimatePresence>

      <div
        className={`absolute inset-0 bg-gradient-to-t ${
          themeName === "dark" ? "from-black/60" : "from-[#fdf6e3]/70"
        } via-transparent to-transparent flex items-end justify-center pb-4`}
      >
        <p
          className={`trips-text text-lg font-bold tracking-wide drop-shadow-lg `} style={{
            WebkitTextStroke:
              themeName === "dark" ? "1px #C2A878" : "1px #5C4B3B",
            textShadow:
              themeName === "dark"
                ? "2px 2px 6px rgba(0,0,0,0.6)"
                : "2px 2px 6px rgba(255,255,255,0.3)",
          }}
        >
          {displayName}
        </p>
      </div>
    </div>
  );
}

const CategoriesSection = () => {
  const { theme, themeName } = useTheme();
  const { t, i18n } = useTranslation("home");
  const { categories, loading } = useCitiesCategories();
  const [index, setIndex] = useState(0);
  const getLangKey = (lang) => lang.split("-")[0];
  const normalizedLang = getLangKey(i18n.language);
  // هنا بتاخد اللغة كاملة زي "zh-CN"
  const langKey = i18n.language;


  const looped = [...categories, ...categories];
  const cardWidth = 220;

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % categories.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [categories.length]);

  const handleDragEnd = (event, info) => {
    const offset = info.offset.x;
    const direction = offset > 0 ? -1 : 1;
    const newIndex = Math.min(
      Math.max(index + direction, 0),
      categories.length - 1,
    );
    setIndex(newIndex);
  };

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

  if (loading) {
    return <p className="text-center text-gray-500">Loading categories...</p>;
  }

  return (
    <section
      className={` hidden lg:flex flex-col py-24 px-6 w-full mx-auto relative transition-colors duration-500
      ${theme.background}
      `}
    >
      <div className="absolute inset-0 pointer-events-none">
        {Array.from({ length: 25 }).map((_, i) => (
          <span
            key={i}
            className={`absolute ${
              themeName === "dark" ? "text-gray-700" : "text-[#222]"
            } opacity-60 text-7xl animate-pulse`}
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              transform: `rotate(${Math.random() * 360}deg)`,
            }}
          >
            {symbols[Math.floor(Math.random() * symbols.length)]}
          </span>
        ))}
      </div>

      <div className="max-w-7xl mx-auto mb-10 text-start">
        <h2
         className={`sc-title-first text-5xl font-extrabold tracking-wide drop-shadow-md text-left`}
          style={{
            WebkitTextStroke:
              themeName === "dark" ? "1px #C2A878" : "1px #5C4B3B",
            textShadow:
              themeName === "dark"
                ? "2px 2px 6px rgba(0,0,0,0.6)"
                : "2px 2px 6px rgba(255,255,255,0.3)",
          }}
        >
          <span className="inline-block transform scale-x-[-1] mr-4"> 𓅓</span>
          {t("ExploreCategories")}
          <span className="inline-block ml-4">{" "}𓅓</span>
        </h2>

        <p className="sc-p-first mt-4 text-lg opacity-80 text-start"  style={{
            WebkitTextStroke:
              themeName === "dark" ? "1px #C2A878" : "1px #5C4B3B",
            textShadow:
              themeName === "dark"
                ? "2px 2px 6px rgba(0,0,0,0.6)"
                : "2px 2px 6px rgba(255,255,255,0.3)",
          }}>
          {t("Discover")}
        </p>
        <DividerWithIcon />
      </div>

      <div className="relative overflow-hidden w-full max-w-7xl mx-auto">
        <motion.div
          className="flex h-full"
          drag="x"
          dragConstraints={{ left: -looped.length * cardWidth, right: 0 }}
          whileTap={{ cursor: "grabbing" }}
          animate={{ x: -index * cardWidth }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          onDragEnd={handleDragEnd}
        >
          {looped.map((cat, i) => (
            <div
              key={i}
              className="min-w-[100%] sm:min-w-[50%] md:min-w-[33.33%] lg:min-w-[20%] p-3"
            >
              <CategoryCard
                cat={cat}
                themeName={themeName}
                language={normalizedLang}
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default CategoriesSection;
