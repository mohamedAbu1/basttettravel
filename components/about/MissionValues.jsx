"use client";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import DividerWithIcon from "../layout/DividerWithIcon";

export default function MissionValues() {
  const { themeName } = useTheme();
  const { t } = useTranslation("about");

  // ✨ إعدادات الأنيميشن
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const staggerContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.2 } },
  };

  return (
    <motion.section
      className="relative z-10 py-8 px-6"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={staggerContainer}
    >
      <motion.div
        variants={staggerContainer}
        className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8"
      >
        <motion.div
          variants={fadeUp}
          className={`rounded-2xl p-6 border ${
            themeName === "dark"
              ? "border-gold/25 bg-black/30"
              : "border-[#c9a34a]/25 bg-white/60 backdrop-blur-sm"
          }`}
        >
          <h3
            className={`about-p text-xl font-bold mb-2`} style={{
            WebkitTextStroke:
              themeName === "dark" ? "1px #C2A878" : "1px #5C4B3B",
            textShadow:
              themeName === "dark"
                ? "2px 2px 6px rgba(0,0,0,0.6)"
                : "2px 2px 6px rgba(255,255,255,0.3)",
          }}
          >
            {t("h3")}
          </h3>
          <DividerWithIcon />
          <p
            className={`text-center ${themeName === "dark" ? "text-white/80" : "text-[#5c4520]"}`}
          >
            {t("p2")}
          </p>
          <DividerWithIcon />
        </motion.div>

        <motion.div
          variants={fadeUp}
          className={`rounded-2xl p-6 border ${
            themeName === "dark"
              ? "border-gold/25 bg-black/30"
              : "border-[#c9a34a]/25 bg-white/60 backdrop-blur-sm"
          }`}
        >
          <h3
            className={`about-p text-xl font-bold mb-2`} style={{
            WebkitTextStroke:
              themeName === "dark" ? "1px #C2A878" : "1px #5C4B3B",
            textShadow:
              themeName === "dark"
                ? "2px 2px 6px rgba(0,0,0,0.6)"
                : "2px 2px 6px rgba(255,255,255,0.3)",
          }}
          >
            {t("h2")}
          </h3>
          <DividerWithIcon />

          <p
            className={`text-center ${themeName === "dark" ? "text-white/80" : "text-[#5c4520]"}`}
          >
            {t("li")}
          </p>
          <DividerWithIcon />
        </motion.div>

        <motion.div
          variants={fadeUp}
          className={`rounded-2xl p-6 border ${
            themeName === "dark"
              ? "border-gold/25 bg-black/30"
              : "border-[#c9a34a]/25 bg-white/60 backdrop-blur-sm"
          }`}
        >
          <h3
            className={`about-p text-xl font-bold mb-2`}  style={{
            WebkitTextStroke:
              themeName === "dark" ? "1px #C2A878" : "1px #5C4B3B",
            textShadow:
              themeName === "dark"
                ? "2px 2px 6px rgba(0,0,0,0.6)"
                : "2px 2px 6px rgba(255,255,255,0.3)",
          }}
          >
            {t("h4")}
          </h3>
          <DividerWithIcon />

          <p
            className={`text-center ${themeName === "dark" ? "text-white/80" : "text-[#5c4520]"}`}
          >
            {t("p3")}
          </p>
          <DividerWithIcon />
        </motion.div>
      </motion.div>
    </motion.section>
  );
}
