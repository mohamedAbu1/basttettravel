"use client";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useCitiesCategories } from "@/context/CitiesCategoriesContext";
import DividerWithIcon from "../layout/DividerWithIcon";
import { useRouter } from "next/navigation";
import EgyptianBackground from "../layout/EgyptianBackground";

const encodeData = (obj) => btoa(JSON.stringify(obj));

function CategoryCard({ cat, theme, language }) {
  const [imgIndex, setImgIndex] = useState(0);
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      setImgIndex((prev) => (prev + 1) % (cat.images?.length || 1));
    }, 4000);
    return () => clearInterval(interval);
  }, [cat.images]);

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
    "豪华旅游",
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
      className={`relative overflow-hidden group cursor-pointer h-[320px] transition-all duration-500 hover:scale-[1.06] hover:shadow-2xl ${theme.card}`}
      style={{ border: `1px solid ${theme.logoBorder}` }}
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
        className={`absolute inset-0 ${theme.overlay} flex items-end justify-center pb-4`}
      >
        <p
          className={`trips-text text-lg font-bold tracking-wide drop-shadow-lg ${theme.title}`}
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
  const normalizedLang = i18n.language.split("-")[0];

  const looped = [...categories, ...categories];
  const cardWidth = 220;
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
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % categories.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [categories.length]);

  if (loading) {
    return <p className="text-center">Loading categories...</p>;
  }

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

  return (
    <section
      className={`hidden lg:flex flex-col py-24 px-6 w-full mx-auto relative transition-colors duration-500 ${theme.background} `}
    >
      {/* خلفية الرموز */}
      <div className="absolute inset-0 flex flex-wrap justify-center items-center opacity-10 pointer-events-none">
        {symbols.map((sym, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 0.3, y: 0 }}
            transition={{ duration: 1, delay: i * 0.1 }}
            className="text-6xl m-6"
            style={{
              color: theme.icon,
            }}
          >
            {sym}
          </motion.span>
        ))}
      </div>
      <EgyptianBackground />
      {/* العنوان */}
      <div
        className="absolute opacity-40 pointer-events-none"
        style={{
          right: screenSize.width * 0.05, // 10% من عرض الشاشة
          bottom: screenSize.height * 0.49, // 20% من ارتفاع الشاشة
          width: "240px",
          height: "200px",
        }}
      >
        <Image
         src={
              themeName === "dark"
                ? "/HomePageImage/ancient-egyptian-winged-goddess-isis-statue-white-background.webp"
                : "/HomePageImage/johnny_automatic_ocean_liner.svg"
            }
          alt="Decorative Style"
          fill
          className="object-contain"
        />
      </div>

      <div className="max-w-7xl mx-auto mb-10 text-start relative z-10">
        <h2 className="sc-title-first text-5xl font-extrabold tracking-wide drop-shadow-md text-gradient">
          <span className="inline-block transform scale-x-[-1] text-gradient mr-4">
            𓅓
          </span>
          {t("ExploreCategories")}
          <span className="inline-block ml-4 text-gradient">𓅓</span>
        </h2>

        <p className="sc-p-first mt-4 text-lg opacity-80 text-start text-gradient">
          {t("Discover")}
        </p>

        <DividerWithIcon />
      </div>
      <div
        className="absolute scale-x-[-1] opacity-40 pointer-events-none"
        style={{
          left: screenSize.width * 0.05, // 10% من عرض الشاشة
          bottom: screenSize.height * 0.49, // 20% من ارتفاع الشاشة
          width: "240px",
          height: "200px",
        }}
      >
        <Image
          src={
              themeName === "dark"
                ? "/HomePageImage/ancient-egyptian-winged-goddess-isis-statue-white-background.webp"
                : "/HomePageImage/johnny_automatic_ocean_liner.svg"
            }
          alt="Decorative Style"
          fill
          className="object-contain"
        />
      </div>
      {/* الكروت */}
      <div className="relative overflow-hidden w-full max-w-7xl mx-auto z-10">
        <motion.div
          className="flex h-full"
          drag="x"
          dragConstraints={{ left: -looped.length * cardWidth, right: 0 }}
          whileTap={{ cursor: "grabbing" }}
          animate={{ x: -index * cardWidth }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          {looped.map((cat, i) => (
            <div
              key={i}
              className="min-w-[100%] sm:min-w-[50%] md:min-w-[33.33%] lg:min-w-[20%] p-3"
            >
              <CategoryCard
                cat={cat}
                theme={theme}
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
