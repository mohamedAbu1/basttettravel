"use client";
import { useEffect, useState } from "react";
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

const OurSection = () => {
  const router = useRouter();
  const { theme } = useTheme();
  const { t } = useTranslation("home");
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);
  if (!hasMounted) return null;

  const images = [
    "/Luxor/pexels-diego-f-parra-33199-15188096.webp",
    "/Luxor/pexels-girlvsglobe86-300284270-30404381.webp",
    "/Luxor/pexels-elenav-2011499497-29046654.webp",
    "/Luxor/WhatsApp Image 2025-12-31 at 11.30.42 AM.webp",
    "/Aswan/pexels-axp-photography-500641970-18991592.webp",
    "/Luxor/wasdwaw.webp",
  ];

  return (
    <>
      {/* نسخة الموبايل */}
      <section
        className={`flex lg:hidden flex-col items-center justify-start w-full px-4 py-10 ${theme.background} ${theme.text}`}
      >
        <div className="w-full rounded-2xl overflow-hidden shadow-lg mb-6">
          <Swiper
            modules={[Pagination, Autoplay]}
            pagination={{ clickable: true }}
            autoplay={{ delay: 4000, disableOnInteraction: false }}
            spaceBetween={20}
            slidesPerView={1}
            className="w-full h-[50vh]"
          >
            {images.map((imgSrc, index) => (
              <SwiperSlide key={index}>
                <div className="w-full h-full relative">
                  <Image
                    src={imgSrc || "/fallback.jpg"}
                    alt={`WasetTravel Slide ${index + 1}`}
                    fill
                    className="object-cover rounded-lg"
                    loading="lazy"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="text-center px-2">
          <Image
            src={
              theme.name === "dark"
                ? "/HomePageImage/Copilot_20260613_134423.webp"
                : "/HomePageImage/Copilot_20260613_134550.webp"
            }
            alt="Basttet Travel Logo"
            width={200}
            height={200}
            className="mx-auto mb-4 object-contain select-none"
            priority
          />

          <p className="sc-p text-xs uppercase mb-2 tracking-wide text-gradient">
            {t("AboutUs")}
          </p>

          <h2 className="sc-title text-2xl font-bold mb-4 leading-snug text-gradient">
            {t("DiscoverWasetTravel")}
          </h2>

          <DividerWithIcon />

          <p className="text-sm mb-6 leading-relaxed" style={{ color: theme.text }}>
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
            className={`w-full rounded-[6px] px-6 py-3 font-semibold tracking-wide cursor-pointer transition-all duration-300 shadow-lg ${theme.buttonPrimary}`}
            style={{
              color: `${theme.subText}`,
              border: `2px solid ${theme.logoBorder}`,
            }}
          >
            {t("LearnMoreAboutUs")}
          </motion.button>
        </div>
      </section>

      {/* نسخة الديسكتوب */}
      <section
        id="section-four"
        className={`hidden lg:flex relative w-full min-h-screen px-4 py-12 flex-col items-center justify-start ${theme.background} ${theme.text}`}
      >
        <div className="w-full max-w-screen-xl flex flex-row items-center justify-between gap-10 relative z-10">
          {/* ✅ Slider يسار */}
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
              className="w-full h-[85vh]"
            >
              {images.map((imgSrc, index) => (
                <SwiperSlide key={index}>
                  <div className="w-full h-full relative">
                    <Image
                      src={imgSrc || "/fallback.jpg"}
                      alt={`WasetTravel Slide ${index + 1}`}
                      fill
                      className="object-cover rounded-lg"
                      loading="lazy"
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </motion.div>

          {/* ✅ Text يمين */}
          <motion.div
            initial={{ opacity: 0, x: 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="w-full lg:w-1/2 text-start"
            style={{ paddingLeft: "13px" }}
          >
            <div className="flex justify-center mb-6">
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

            <h2 className="sc-title text-4xl font-bold mb-4 leading-snug text-gradient">
              {t("DiscoverWasetTravel")}
            </h2>

            <DividerWithIcon />

            <p className="text-base mb-6 leading-relaxed" style={{ color: theme.text }}>
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
              className={`w-full rounded-[6px] px-6 py-3 font-semibold tracking-wide cursor-pointer transition-all duration-300 shadow-lg ${theme.buttonPrimary}`}
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
            className=" hidden lg:flex w-full lg:w-1/2 rounded-3xl overflow-hidden shadow-xl"
            style={{ boxShadow: theme.shadow }}
          >
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              navigation
              pagination={{ clickable: true }}
              autoplay={{ delay: 4000, disableOnInteraction: false }}
              spaceBetween={30}
              slidesPerView={1}
              className="w-full h-[85vh]"
            >
              {images.map((imgSrc, index) => (
                <SwiperSlide key={index}>
                  <div className="w-full h-full relative">
                    <Image
                      src={imgSrc || "/fallback.jpg"}
                      alt={`WasetTravel Slide ${index + 1}`}
                      fill
                      className="object-cover rounded-lg"
                      loading="lazy"
                    />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </motion.div>
        </div>
      </section>
    </>
  );
};

export default OurSection;
