"use client";
import Background from "./components/Background";
import HeroText from "./components/HeroText";
import BookingForm from "./components/BookingForm";
import { useState } from "react";
import LeftSocialIcons from "./components/LeftSocialIcons";
import { useTranslation } from "react-i18next";

export default function HeroSection() {
  const [, setShowTrips] = useState(false);
  const { t } = useTranslation("home");
  
  return (
    <section className="hero-section relative min-h-screen w-full overflow-hidden flex flex-col">
      {/* الخلفية */}
      <Background />

      {/* المحتوى الرئيسي */}
      <div className="hero-content relative z-20 flex flex-col lg:flex-row items-center justify-between w-full h-full mx-auto px-6 lg:px-12 mt-24 lg:mt-32">
        {/* النصوص والشرح */}
        <div className="hero-mobile-copy w-full lg:w-[50%] text-center lg:text-left flex flex-col mb-8 lg:mb-0 lg:pl-10">
          <HeroText />
        </div>
        <LeftSocialIcons />

        {/* الفورم والباقات */}
        <div className="hero-planner-column w-full lg:w-[39%] flex flex-col items-center justify-center mt-2 lg:mt-6">
          <div className="hero-planner-panel">
            <div className="hero-planner-heading">
              <span className="hero-planner-eyebrow">𓂀 {t("plannerEyebrow")}</span>
              <h2>{t("plannerTitle")}</h2>
              <p>{t("plannerDescription")}</p>
            </div>
            <BookingForm setShowTrips={setShowTrips} compact />
            <div className="hero-planner-trust" aria-label={t("plannerTrustLabel")}>
              <span><strong>✓</strong> {t("plannerTrustOne")}</span>
              <span><strong>✓</strong> {t("plannerTrustTwo")}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
