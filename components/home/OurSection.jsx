"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import BrandLogo from "@/components/BrandLogo";
import DividerWithIcon from "../layout/DividerWithIcon";

const images = [
  "/Luxor/pexels-diego-f-parra-33199-15188096.webp",
  "/Luxor/pexels-girlvsglobe86-300284270-30404381.webp",
  "/Luxor/pexels-elenav-2011499497-29046654.webp",
  "/Luxor/WhatsApp Image 2025-12-31 at 11.30.42 AM.webp",
  "/Aswan/pexels-axp-photography-500641970-18991592.webp",
];

export default function OurSection() {
  const { t } = useTranslation("home");
  const pathname = usePathname();
  const locale = pathname.split("/").filter(Boolean)[0] || "en";

  return (
    <section className="our-story-section" aria-labelledby="our-story-title">
      <div className="our-story-inner">
        <div className="our-story-gallery" aria-label={t("AboutUs")}>
          <div className="our-story-image our-story-image-main">
            <Image src={images[0]} alt="Luxor temple and Nile landscape" fill sizes="(max-width: 800px) 92vw, 48vw" loading="lazy" />
            <span className="our-story-image-label">Basttet Travel</span>
          </div>
          <div className="our-story-image our-story-image-small our-story-image-top">
            <Image src={images[1]} alt="Egyptian travel experience" fill sizes="(max-width: 800px) 44vw, 20vw" loading="lazy" />
          </div>
          <div className="our-story-image our-story-image-small our-story-image-bottom">
            <Image src={images[2]} alt="Nile journey in Egypt" fill sizes="(max-width: 800px) 44vw, 20vw" loading="lazy" />
          </div>
          <span className="our-story-gallery-badge" aria-hidden="true">𓂀</span>
        </div>

        <div className="our-story-copy">
          <p className="section-kicker">{t("AboutUs")}</p>
          <h2 id="our-story-title">{t("DiscoverWasetTravel")}</h2>
          <DividerWithIcon />
          <p className="our-story-lead">
            {t("At")} <strong>Basttet Travel</strong>{t("AtP")} <strong>{t("professionalguides")}</strong> {t("AtPP")}
          </p>
          <div className="our-story-points" aria-label="Basttet Travel values">
            <span><b>01</b> Local knowledge</span>
            <span><b>02</b> Thoughtful planning</span>
            <span><b>03</b> Human support</span>
          </div>
          <Link className="our-story-action" href={`/${locale}/about`}>
            {t("LearnMoreAboutUs")} <span aria-hidden="true">↗</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
