"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useCitiesCategories } from "@/context/CitiesCategoriesContext";
import DividerWithIcon from "../layout/DividerWithIcon";
import { useRouter } from "next/navigation";

const encodeData = (obj) => btoa(JSON.stringify(obj));

function CityCard({ city, themeName, theme, language, t }) {
  const router = useRouter();
  const cityName =
    city.name?.[language] || city.name?.["en"] || city.name || "";

  const handleExplore = () => {
    const queryObj = {
      city: [cityName],
      category: "all",
      group_price: "All",
      popular: false,
    };
    const encoded = encodeData(queryObj);
    router.push(`/trips?data=${encoded}`);
  };

  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev === 0 ? 1 : 0));
    }, 4000);
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
        className={`relative h-82 rounded-2xl overflow-hidden group cursor-pointer
          ${theme.card} ${theme.border} ${theme.shadow}
          transition-all duration-500 hover:scale-[1.05] hover:shadow-2xl hover:-rotate-1`}
      >
        <AnimatePresence mode="sync">
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
        </AnimatePresence>

        <div
          className={`absolute inset-0 ${theme.overlay} flex flex-col items-center justify-end pb-6`}
        >
          <p
            className={`trips-text text-lg font-bold mb-2 ${theme.title}`}
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
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleExplore}
            className={`rounded-[9px] px-3 py-2 font-semibold tracking-wide cursor-pointer transition-all duration-300 shadow-lg ${theme.buttonPrimary}`}
            style={{ border: `2px solid ${theme.logoBorder}` }}
          >
            {t("Explore")}
          </motion.button>
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

  const [screenSize, setScreenSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const handleResize = () => {
      setScreenSize({ width: window.innerWidth, height: window.innerHeight });
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  if (loading) {
    return <p className="text-center">Loading cities...</p>;
  }

  const looped = [...cities, ...cities];

  const symbols = [
    "𓂀","𓋹","𓆣","𓇼","𓇯","𓏏","𓎛","𓊽","𓃾","𓅓","𓈇","𓉐","𓊹","𓌙","𓍿","𓎟",
  ];

  return (
    <section
      className={`flex py-8 sm:py-12 px-4 sm:px-6 md:px-8 flex-col w-full mx-auto relative ${theme.background}`}
    >
      {/* خلفية الرموز */}
      <div className="absolute inset-0 pointer-events-none">
        {symbols.map((sym, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 0.15, y: 0 }}
            transition={{ duration: 1.2, delay: i * 0.1 }}
            className="absolute text-4xl sm:text-6xl"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              transform: `rotate(${Math.random() * 360}deg)`,
              color: theme.icon,
            }}
          >
            {sym}
          </motion.span>
        ))}
      </div>

      {/* عنوان */}
     
   <div className="max-w-7xl mx-auto mb-10 text-start relative z-10 flex flex-row items-center gap-14">
          {/* ✅ صورة قبل العنوان حسب الثيم */}
          <img
            src={
              themeName === "dark"
                ? "/HomePageImage/ancient-egyptian-winged-goddess-isis-statue-white-background.webp"
                : "/HomePageImage/johnny_automatic_ocean_liner.svg"
            }
            alt="Decor before title"
            className="w-34 h-34 object-contain"
          />

        <div className="max-w-2xl mx-auto mb-10 sm:mb-16 w-full relative z-10">
        <h2 className="sc-title-first text-3xl sm:text-5xl font-extrabold tracking-wide drop-shadow-md text-center text-gradient">
          <span className="inline-block transform scale-x-[-1] mr-2 sm:mr-4">𓅓</span>
          {t("ExploreCities")}
          <span className="inline-block ml-2 sm:ml-4">𓅓</span>
        </h2>
        <DividerWithIcon />
      </div>
          {/* ✅ صورة بعد العنوان حسب الثيم */}
          <img
            src={
              themeName === "dark"
                ? "/HomePageImage/ancient-egyptian-winged-goddess-isis-statue-white-background.webp"
                : "/HomePageImage/johnny_automatic_ocean_liner.svg"
            }
            alt="Decor after title"
            className="w-34 h-34 object-contain"
          />
        </div>
      {/* ✅ Marquee Animation */}
      <div className="relative overflow-hidden w-full max-w-7xl mx-auto h-[350px] z-10">
        <motion.div
          className="flex flex-col sm:flex-row h-full"
          animate={screenSize.width < 640 ? { y: ["0%", "-100%"] } : { x: ["0%", "-100%"] }}
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
