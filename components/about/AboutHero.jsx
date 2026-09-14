"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { FaArrowRight, FaCompass } from "react-icons/fa";
import { usePathname } from "next/navigation";

export default function AboutHero() {
  const { themeName } = useTheme();
  const { t } = useTranslation("about");
  const pathname = usePathname();
  const locale = pathname.split("/").filter(Boolean)[0] || "en";

  return (
    <section className="about-hero relative z-10 px-6 pt-32 pb-20 mt-0">
      <div className="about-hero-inner max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-[0.95fr_1.05fr] gap-12 lg:gap-20 items-center">
        <div className="about-visual-grid order-2 lg:order-1">
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="about-main-image relative w-full h-80 lg:h-[510px] rounded-[2rem] overflow-hidden shadow-2xl"
        >
          <Image
            src={
              themeName === "dark"
                ? "/Aswan/pexels-radwa-magdy-1718930-28144568.webp"
                : "/Nile_Cruise/5116-900x600.webp"
            }
            alt="Basttet Travel luxury Egypt experience"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover scale-x-[-1]"
          />
          <div className="about-image-caption">
            <span><FaCompass aria-hidden="true" /> {t("heroBadge")}</span>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.15, ease: "easeOut" }}
          className="about-secondary-image relative w-[70%] h-48 lg:h-64 rounded-[1.5rem] overflow-hidden shadow-2xl"
        >
          <Image
            src="/Luxor/pexels-francesco-ungaro-2325447.webp"
            alt="Luxor temple at sunset"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
        </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, x: -60 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="about-hero-copy space-y-5 order-1 lg:order-2"
        >
          <p className="about-eyebrow">{t("heroEyebrow")}</p>
          <h1 className="about-hero-title">{t("h1")}</h1>
          <p className="about-hero-description">{t("p")}</p>
          <div className="about-hero-actions">
            <Link href={`/${locale}/trips`} className="site-button site-button-primary">
              {t("heroCta")} <FaArrowRight aria-hidden="true" />
            </Link>
            <Link href={`/${locale}/contact`} className="site-button site-button-secondary">
              {t("heroSecondaryCta")}
            </Link>
          </div>
          <div className="about-hero-meta">
            <span><strong>𓂀</strong> {t("heroMetaOne")}</span>
            <span><strong>𓆣</strong> {t("heroMetaTwo")}</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
