"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "react-i18next";
import DividerWithIcon from "../layout/DividerWithIcon";

export default function AboutHero() {
  const { themeName } = useTheme();
  const { t } = useTranslation("about");

  return (
    <section className="relative z-10 py-20 px-6 mt-12">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
        
        {/* الصورة الأولى */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative w-full h-80 lg:h-[460px] rounded-2xl overflow-hidden shadow-2xl"
        >
          <Image
            src={
              themeName === "dark"
                ? "/Aswan/pexels-radwa-magdy-1718930-28144568.webp"
                : "/Nile_Cruise/5116-900x600.webp"
            }
            alt="WasetTravel Luxury Experience"
            fill
            className="object-cover scale-x-[-1]"
          />
        </motion.div>

        {/* النصوص */}
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="space-y-5"
        >
          <p
            className={`about-p uppercase tracking-widest text-sm text-gradient `}
          >
            {t("AboutWasetTravel")}
          </p>

          <DividerWithIcon />

          <h1
            className={`about-title text-4xl lg:text-5xl font-extrabold leading-tight text-gradient`}
          >
            {t("h1")}
          </h1>

          <DividerWithIcon />

          <p
            className={`about-p text-gradient`}
          >
            {t("p")}
          </p>
        </motion.div>

        {/* الصورة الثانية */}
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className=" hidden lg:flex relative w-full h-80 lg:h-[460px] rounded-2xl overflow-hidden shadow-2xl"
        >
          <Image
            src={
              themeName === "dark"
                ? "/Aswan/pexels-radwa-magdy-1718930-28144568.webp"
                : "/Nile_Cruise/5116-900x600.webp"
            }
            alt="WasetTravel Luxury Experience"
            fill
            className="object-cover"
          />
        </motion.div>
      </div>
    </section>
  );
}
