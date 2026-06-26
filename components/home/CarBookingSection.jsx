/* eslint-disable react-hooks/purity */
"use client";
import React from "react";
import { useTheme } from "@/context/ThemeContext";
import { FaCarSide } from "react-icons/fa";
import Image from "next/image";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import DividerWithIcon from "../layout/DividerWithIcon";
import { useAuth } from "@/context/AuthContext";

const CarBookingSection = () => {
  const { theme, themeName } = useTheme();
  const { t } = useTranslation("home");
  const { user } = useAuth();

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

  // ✨ إعدادات الأنيميشن
  const fadeInUp = {
    hidden: { opacity: 0, y: 60 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <motion.section
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={fadeInUp}
      className={`hidden lg:flex relative w-full items-center justify-center py-24 px-6 transition-colors duration-500 overflow-hidden ${theme.background}`}
    >
      {/* Background Car Image */}
      <div className="absolute inset-0 -z-10">
        <Image
          src="/HomePageImage/30204164_jaipur_bw_001.svg"
          alt="Luxury Car Background"
          fill
          className="object-cover opacity-20 rounded-lg"
          priority // ✅ لو الصورة أساسية في الصفحة (خلفية أو Hero)
          quality={85} // ✅ يقلل حجم الصورة ويحافظ على الجودة
        />
        <div
          className={`absolute inset-0 bg-gradient-to-br ${
            themeName === "dark"
              ? "from-black/70 via-transparent to-black/10"
              : "from-[#fdf6e3]/80 via-transparent to-[#c9a34a]/20"
          }`}
        ></div>
      </div>

      {/* Hieroglyphic Symbols Background */}
      <div className="absolute inset-0 pointer-events-none -z-0">
        {Array.from({ length: 20 }).map((_, i) => (
          <span
            key={i}
            className={`absolute ${
              themeName === "dark" ? "text-[#222]" : "text-[#222]"
            } opacity-30 text-6xl animate-pulse`}
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

      {/* Content with Car beside text */}
      <motion.div
        variants={fadeInUp}
        className="flex flex-col lg:flex-row items-center gap-12 max-w-7xl w-full mx-auto"
      >
        {/* Car Image beside text */}
        <motion.div
          variants={fadeInUp}
          className="flex-1 relative w-full h-80 lg:h-[400px]"
        >
          <Image
            src={
              themeName === "dark"
                ? "/HomePageImage/20752-5-2014-hyundai-tucson.webp"
                : "/HomePageImage/White-Kia-PNG-High-Quality-Image.webp"
            }
            alt="Luxury Car"
            fill
            className="object-contain drop-shadow-2xl"
            priority // ✅ لو الصورة أساسية في الصفحة (مثلاً Hero أو خلفية مهمة)
            quality={85} // ✅ يقلل حجم الصورة ويحافظ على جودة مناسبة
          />
        </motion.div>

        {/* Text Section */}
        <motion.div
          variants={fadeInUp}
          className="flex-1 text-center lg:text-left"
        >
          <h2
            className={`sc-title-first text-5xl font-extrabold tracking-wide drop-shadow-md flex items-center gap-3 justify-center lg:justify-start`}
            style={{
              WebkitTextStroke:
                themeName === "dark" ? "1px #C2A878" : "1px #5C4B3B",
              textShadow:
                themeName === "dark"
                  ? "2px 2px 6px rgba(0,0,0,0.6)"
                  : "2px 2px 6px rgba(255,255,255,0.3)",
            }}
          >
            {t("PremiumCarTransfer")}
          </h2>
          <DividerWithIcon />

          <p className="mt-6 text-lg opacity-80 leading-relaxed max-w-xl">
            {t("Experience")}
          </p>
          {user ? (
            // ✅ زر الحجز يظهر فقط إذا كان فيه مستخدم
            <motion.button
              variants={fadeInUp}
              style={{ cursor: "pointer" }}
              onClick={() => {
                window.dispatchEvent(new CustomEvent("openCarBookingChat"));
              }}
              className="w-full mt-8 inline-block px-10 py-4 rounded-full font-bold text-lg shadow-xl transition-transform transform hover:scale-105 
             bg-transparent backdrop-blur-md 
             border border-[#C2A878] 
             text-[#C2A878]  tracking-wide
             hover:bg-[#C2A878]/20 hover:text-white 
             duration-300  cursor-pointer"
            >
              {t("Book")}
            </motion.button>
          ) : (
            // ✅ رسالة أنيقة بدل الزر لو ما فيش مستخدم
            <motion.p
              variants={fadeInUp}
              className="sc-p-first mt-8 text-lg font-semibold opacity-80 italic text-center lg:text-left"
              style={{
                WebkitTextStroke:
                  themeName === "dark" ? "1px #C2A878" : "1px #5C4B3B",
                textShadow:
                  themeName === "dark"
                    ? "2px 2px 6px rgba(0,0,0,0.6)"
                    : "2px 2px 6px rgba(255,255,255,0.3)",
              }}
            >
              Please log in and book your car now ✨
            </motion.p>
          )}
        </motion.div>
      </motion.div>
    </motion.section>
  );
};

export default CarBookingSection;
