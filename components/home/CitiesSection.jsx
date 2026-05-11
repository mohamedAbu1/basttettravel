"use client";
import Image from "next/image";
import {useState ,useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useCitiesCategories } from "@/context/CitiesCategoriesContext";
import DividerWithIcon from "../layout/DividerWithIcon";
import { useRouter } from "next/navigation";

// دالة لتشفير الكويري
const encodeData = (obj) => btoa(JSON.stringify(obj));

// داخل CityCard


function CityCard({ city, themeName, theme, language, t }) {
  const router = useRouter();
  const cityName =
    city.name?.[language] || city.name?.["en"] || city.name || "";

  const handleExplore = () => {
    const queryObj = {
      city: [cityName],
      category: "all",
      price: "All",
      popular: false,
    };
    const encoded = btoa(JSON.stringify(queryObj));
    router.push(`/trips?data=${encoded}`);
  };

  // ✅ حالة لتبديل الصور
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) =>
        prev === 0 ? 1 : 0
      );
    }, 4000); // كل 4 ثواني يتغير
    return () => clearInterval(interval);
  }, []);

  const images = city.images?.slice(0, 2) || ["/fallback.jpg", "/fallback.jpg"];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="min-w-[250px] p-4"
    >
      <div
        className={`
          relative h-82 rounded-2xl overflow-hidden group cursor-pointer
          ${theme.card} ${theme.border} ${theme.shadow}
          transition-all duration-500
          hover:scale-[1.05] hover:shadow-2xl hover:-rotate-1
        `}
      >
        {/* ✅ أنيميشن تبديل الصور */}
        <motion.div
          key={currentImage}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute inset-0"
        >
          <Image
            src={images[currentImage]}
            alt={cityName || "City image"}
            fill
            className="object-cover rounded-lg"
          />
        </motion.div>

        <div
          className={`
            absolute inset-0 
            ${theme.overlay}
            flex flex-col items-center justify-end pb-6
          `}
        >
          <p
            className="trips-text text-lg font-bold text-white drop-shadow-lg mb-2"
            style={{
              WebkitTextStroke:
                themeName === "dark" ? "1px #C2A878" : "1px #ffffff",
              textShadow:
                themeName === "dark"
                  ? "2px 2px 6px rgba(0,0,0,0.6)"
                  : "2px 2px 6px rgba(255,255,255,0.3)",
            }}
          >
            {cityName}
          </p>
          <button
            onClick={handleExplore}
            className="rounded-[9px] px-3 py-2 
             bg-transparent backdrop-blur-md 
             border border-[#C2A878] 
             text-[#C2A878] font-semibold tracking-wide
             hover:bg-[#C2A878]/20 hover:text-white 
             transition-all duration-300 shadow-lg cursor-pointer"
          >
            {t("Explore")}
          </button>
        </div>
      </div>
    </motion.div>
  );
}



const CitiesSection = () => {
  const { theme, themeName } = useTheme();
  const { t, i18n } = useTranslation("home");
  const { cities, loading } = useCitiesCategories();
  const normalizedLang = i18n.language.split("-")[0];
  if (loading) {
    return <p className="text-center text-gray-500">Loading cities...</p>;
  }

  // كرر المدن مرتين علشان تعمل loop سلس
  const looped = [...cities, ...cities];

  return (
    <section
      className={`
        hidden lg:flex py-12 px-6 flex-col w-full mx-auto relative
        ${theme.background}
      `}
    >
      <div className="max-w-2xl mx-auto mb-16 w-full">
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
          <span className="inline-block transform scale-x-[-1] mr-4">𓅓</span>
          {t("ExploreCities")}
          <span className="inline-block ml-4">𓅓</span>
        </h2>

        <DividerWithIcon />
      </div>

      {/* ✅ Marquee Animation */}
      <div className="relative overflow-hidden w-full max-w-7xl mx-auto h-[410px]">
        <motion.div
          className="flex h-full"
          animate={{ x: ["0%", "-100%"] }}
          transition={{
            duration: 20,
            ease: "linear",
            repeat: Infinity,
          }}
        >
          {looped.map((city, i) => (
            <CityCard
              key={i}
              city={city}
              t={t}
              themeName={themeName}
              theme={theme}
              language={normalizedLang}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default CitiesSection;
