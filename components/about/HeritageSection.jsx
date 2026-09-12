"use client";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import DividerWithIcon from "../layout/DividerWithIcon";
import BrandLogo from "@/components/BrandLogo";

export default function HeritageSection() {
  const { t } = useTranslation("about");

  // ✨ إعدادات الأنيميشن
  const fadeLeft = {
    hidden: { opacity: 0, x: -60 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  const fadeRight = {
    hidden: { opacity: 0, x: 60 },
    visible: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  };

  return (
    <motion.section
      className="relative z-10 pb-20 px-6"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
    >
      <div
        className="about-heritage-card max-w-7xl mx-auto rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8"
      >
        {/* النص */}
        <motion.div variants={fadeLeft} className="flex-1">
          {/* اللوجو في الأعلى */}
          <div className="flex justify-center mb-6">
            <BrandLogo variant="horizontal" className="h-auto w-full max-w-[28rem]" priority />
          </div>

          <h3 className="about-section-title text-2xl font-bold mb-3">
            {t("h5")}
          </h3>
          <DividerWithIcon />

          <p className="about-section-description text-center">
            {t("p4")}
          </p>
        </motion.div>

        {/* الصورة */}
     
      </div>
    </motion.section>
  );
}
