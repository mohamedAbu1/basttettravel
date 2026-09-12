"use client";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import { FaArrowRight, FaCheck } from "react-icons/fa";
import { usePathname } from "next/navigation";

export default function HeroText() {
  const { t } = useTranslation("home");
  const pathname = usePathname();
  const locale = pathname.split("/").filter(Boolean)[0] || "en";

  return (
    <div className="hero-copy max-w-2xl text-left pl-5">
      <p className="hero-eyebrow">
        <span className="hero-eyebrow-mark">𓂀</span>
        {t("heroEyebrow")}
      </p>
      <h1 className="hero-heading">
        {t("heroTitle")} <span>{t("heroTitleAccent")}</span>
      </h1>
      <p className="hero-description">{t("heroDescription")}</p>

      <div className="hero-actions">
        <Link href={`/${locale}/trips`} className="hero-primary-action">
          {t("heroCta")} <FaArrowRight aria-hidden="true" />
        </Link>
        <a href="#top-trips" className="hero-secondary-action">
          {t("heroSecondaryCta")}
        </a>
      </div>

      <div className="hero-trust-row" aria-label={t("heroTrustLabel")}>
        {["heroTrustOne", "heroTrustTwo", "heroTrustThree"].map((key) => (
          <span key={key}>
            <FaCheck aria-hidden="true" /> {t(key)}
          </span>
        ))}
      </div>
    </div>
  );
}
