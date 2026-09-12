/* eslint-disable @next/next/no-html-link-for-pages */
"use client";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import DividerWithIcon from "../layout/DividerWithIcon";
import { usePathname } from "next/navigation";

export default function CTASection() {
  const { themeName } = useTheme();
  const { t } = useTranslation("about");
  const pathname = usePathname();
  const locale = pathname.split("/").filter(Boolean)[0] || "en";

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
        className="about-cta-card max-w-7xl mx-auto text-center"
      >
        <motion.h4
          variants={fadeUp}
          className="about-cta-title text-xl font-semibold mb-3"
        >
          {t("h6")}
        </motion.h4>

        <motion.p
          variants={fadeUp}
          className="about-cta-description mb-6"
        >
          {t("p5")}
        </motion.p>

      <motion.a
  variants={fadeUp}
  href={`/${locale}/contact`}
  whileHover={{ scale: 1.05 }}
  whileTap={{ scale: 0.95 }}
  className="site-button site-button-primary w-full"
>
  {t("a")}
</motion.a>

      </motion.div>
    </motion.section>
  );
}
