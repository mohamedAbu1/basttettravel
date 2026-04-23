/* eslint-disable @next/next/no-html-link-for-pages */
"use client";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import DividerWithIcon from "../layout/DividerWithIcon";

export default function CTASection() {
  const { themeName } = useTheme();
  const { t } = useTranslation("about");

  // ✨ إعدادات الأنيميشن
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.25 } }
  };

  return (
    <motion.section
      className="relative z-10 pb-24 px-6"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={staggerContainer}
    >
      <motion.div
        variants={staggerContainer}
        className="max-w-7xl mx-auto text-center"
      >
        <motion.h4
          variants={fadeUp}
          className={`about-p text-xl font-semibold mb-3`}  style={{
            WebkitTextStroke:
              themeName === "dark" ? "1px #C2A878" : "1px #5C4B3B",
            textShadow:
              themeName === "dark"
                ? "2px 2px 6px rgba(0,0,0,0.6)"
                : "2px 2px 6px rgba(255,255,255,0.3)",
          }}
        >
          {t("h6")}
        </motion.h4>

        <motion.p
          variants={fadeUp}
          className={`${themeName === "dark" ? "text-white/80" : "text-[#5c4520]"} mb-6`}
        >
          {t("p5")}
        </motion.p>

        <motion.a
          variants={fadeUp}
          href="/contact"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full rounded-[4px] px-6 py-3 
             bg-transparent backdrop-blur-md 
             border border-[#C2A878] 
             text-[#C2A878] font-semibold tracking-wide
             hover:bg-[#C2A878]/20 hover:text-white 
             transition-all duration-300 shadow-lg cursor-pointer"
        >
          {t("a")}
        </motion.a>
      </motion.div>
    </motion.section>
  );
}
