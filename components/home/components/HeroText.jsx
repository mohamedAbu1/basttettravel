"use client";
import { Typewriter } from "react-simple-typewriter";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "react-i18next";

export default function HeroText() {
  const { theme } = useTheme();
  const { t } = useTranslation("home");

  return (
    <h1
      className="hero-text absolute bottom-1 left-24 text-center font-extrabold text-4xl md:text-5xl text-gradient"
      style={{
        filter: `drop-shadow(0 0 6px ${theme.logoBorder})`,
      }}
    >
      <Typewriter
        words={[t("welcome"), t("brand"), t("journey")]}
        loop={true}
        cursor
        cursorStyle="𓂀"
        typeSpeed={75}
        deleteSpeed={40}
        delaySpeed={2000}
      />
    </h1>
  );
}
