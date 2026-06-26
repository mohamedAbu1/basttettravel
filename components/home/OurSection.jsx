"use client";
import { useEffect, useState  } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "react-i18next";
import DividerWithIcon from "../layout/DividerWithIcon";
import Decor from "../layout/Decor";

const OurSection = () => {
  const router = useRouter();
  const { theme, themeName } = useTheme();
  const { t } = useTranslation("home");
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => {
    setHasMounted(true);
  }, []);
  if (!hasMounted) return null;

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
      id="section-four"
      className={`hidden lg:flex relative w-full min-h-screen px-4 sm:py-10 md:py-12 lg:py-0 flex-col items-center justify-start ${theme.background} ${theme.text} `}
      style={{ paddingBottom: "40px", paddingTop: "20px" }}
    >
        {/* <Decor pos={"top"} /> */}
      {/* خلفية الرموز الفرعونية */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        {Array.from({ length: 25 }).map((_, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 0.25, y: 0 }}
            transition={{ duration: 1.2, delay: i * 0.1 }}
            className="absolute text-7xl"
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

      <div className="w-full max-w-screen-xl flex flex-col lg:flex-row items-center justify-between gap-10 relative z-10">
        {/* ✅ Slider */}
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full lg:w-1/2 rounded-3xl overflow-hidden shadow-xl"
          style={{ boxShadow: theme.shadow }}
        >
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            spaceBetween={30}
            slidesPerView={1}
            className="w-full h-full"
          >
            {[
              "/Luxor/pexels-diego-f-parra-33199-15188096.webp",
              "/Luxor/pexels-girlvsglobe86-300284270-30404381.webp",
              "/Luxor/pexels-elenav-2011499497-29046654.webp",
              "/Luxor/WhatsApp Image 2025-12-31 at 11.30.42 AM.webp",
              "/Aswan/pexels-axp-photography-500641970-18991592.webp",
              "/Luxor/wasdwaw.webp",
            ].map((imgSrc, index) => (
              <SwiperSlide key={index}>
                <div className="w-full h-[85vh]">
                  <Image
                    src={imgSrc || "/fallback.jpg"}
                    alt={`WasetTravel Slide ${index + 1}`}
                    fill
                    className="w-full h-full object-cover rounded-lg"
                    loading="lazy"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>

        {/* ✅ Text */}
        <motion.div
          initial={{ opacity: 0, x: 100 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full lg:w-1/2 text-start"
          style={{ paddingLeft: "13px" }}
        >
        

          {/* صورة اللوجو حسب المود */}
          <div className="flex justify-center">
            <Image
              src={
                theme.name === "dark"
                  ? "/HomePageImage/Copilot_20260613_134423.webp"
                  : "/HomePageImage/Copilot_20260613_134550.webp"
              }
              alt="Basttet Travel Logo"
              width={330}
              height={330}
              className="object-contain select-none"
              priority
            />
          </div>

          <p className="sc-p text-sm uppercase mb-2 tracking-wide text-gradient">
            {t("AboutUs")}
          </p>

          <h2 className="sc-title text-3xl lg:text-4xl font-bold mb-4 leading-snug text-gradient">
            {t("DiscoverWasetTravel")}
          </h2>

          <DividerWithIcon />

          <p
            className="text-base mb-6 leading-relaxed"
            style={{ color: theme.text }}
          >
            {t("At")}{" "}
            <span style={{ color: theme.logoBorder, fontWeight: 600 }}>
              Basttet Travel{" "}
            </span>
            {t("AtP")}{" "}
            <span style={{ color: theme.logoBorder, fontWeight: 600 }}>
              {t("professionalguides")}
            </span>{" "}
            {t("AtPP")}
          </p>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push("/about")}
            className={`w-full rounded-[4px] px-6 py-3 font-semibold tracking-wide cursor-pointer transition-all duration-300 shadow-lg ${theme.buttonPrimary}`}
            style={{
              color: `${theme.subText}`,
              border: `2px solid ${theme.logoBorder}`,
            }}
          >
            {t("LearnMoreAboutUs")}
          </motion.button>

        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: -100 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full lg:w-1/2 rounded-3xl overflow-hidden shadow-xl"
          style={{ boxShadow: theme.shadow }}
        >
          <Swiper
            modules={[Navigation, Pagination, Autoplay]}
            navigation
            pagination={{ clickable: true }}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            spaceBetween={30}
            slidesPerView={1}
            className="w-full h-full"
          >
            {[
              "/Luxor/pexels-diego-f-parra-33199-15188096.webp",
              "/Luxor/pexels-girlvsglobe86-300284270-30404381.webp",
              "/Luxor/pexels-elenav-2011499497-29046654.webp",
              "/Luxor/WhatsApp Image 2025-12-31 at 11.30.42 AM.webp",
              "/Aswan/pexels-axp-photography-500641970-18991592.webp",
              "/Luxor/wasdwaw.webp",
            ].map((imgSrc, index) => (
              <SwiperSlide key={index}>
                <div className="w-full h-[85vh]">
                  <Image
                    src={imgSrc || "/fallback.jpg"}
                    alt={`WasetTravel Slide ${index + 1}`}
                    fill
                    className="w-full h-full object-cover rounded-lg"
                    loading="lazy"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </motion.div>
      </div>
                {/* <Decor  pos={"bottom"} /> */}

    </section>
  );
};

export default OurSection;
