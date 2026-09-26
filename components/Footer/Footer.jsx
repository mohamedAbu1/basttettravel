"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";
import { FaFacebookF, FaInstagram, FaTripadvisor, FaWhatsapp } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import BrandLogo from "@/components/BrandLogo";

const socialLinks = [
  { Icon: FaFacebookF, label: "Facebook", url: "https://www.facebook.com/profile.php?id=61591222981163", color: "#1877f2" },
  { Icon: FaInstagram, label: "Instagram", url: "https://www.instagram.com/ismailharoun225/", color: "#e1306c" },
  { Icon: FaWhatsapp, label: "WhatsApp", url: "https://wa.me/201100507802", color: "#25d366" },
  { Icon: MdEmail, label: "Email", url: "mailto:BasttetTravel@outlook.com", color: "#ea4335" },
  { Icon: FaTripadvisor, label: "Tripadvisor", url: "https://www.tripadvisor.com/UserReviewEdit-g294205-d34512222-Basttet_Travel-Luxor_Nile_River_Valley.html", color: "#34e0a1" },
];

export default function Footer() {
  const pathname = usePathname();
  const { t } = useTranslation("footer");
  const { t: uiT } = useTranslation("ui");
  const locale = pathname.split("/").filter(Boolean)[0] || "en";
  const link = (path) => `/${locale}/${path}`;

  return (
    <footer className="site-footer site-footer-modern">
      <div className="site-footer-inner">
        <div className="site-footer-brand">
          <BrandLogo variant="horizontal" className="site-footer-logo" />
          <p>{t("p")}</p>
          <div className="site-footer-socials" aria-label={uiT("socialMedia")}>
            {socialLinks.map(({ Icon, label, url, color }) => (
              <a key={label} href={url} aria-label={label} title={label} target="_blank" rel="noopener noreferrer" style={{ "--social-color": color }}>
                <Icon aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>

        <div className="site-footer-column">
          <p className="site-footer-label">{uiT("explore")}</p>
          <Link href={`/${locale}`}>{t("Home")}</Link>
          <Link href={link("trips")}>{t("Tours")}</Link>
          <Link href={link("about")}>{t("AboutUs")}</Link>
          <Link href={link("contact")}>{t("Contact")}</Link>
        </div>

        <div className="site-footer-column">
          <p className="site-footer-label">{uiT("support")}</p>
          <Link href={link("privacyPolicy")}>{t("privacyPolicy")}</Link>
          <Link href={link("cancellationPolicy")}>{t("cancellationPolicy", { defaultValue: "Cancellation Policy" })}</Link>
          <a href="tel:+201100507802">+20 110 050 7802</a>
          <a href="mailto:BasttetTravel@outlook.com">BasttetTravel@outlook.com</a>
        </div>

        <div className="site-footer-cta">
          <span className="site-footer-kicker">{uiT("planWithConfidence")}</span>
          <h2>{uiT("egyptIsWaiting")}</h2>
          <p>{uiT("footerCta")}</p>
          <Link href={link("contact")} className="site-footer-cta-link">{uiT("talkToOurTeam")} <span aria-hidden="true">↗</span></Link>
        </div>
      </div>
      <div className="site-footer-bottom">
        <span>{t("Footer")}</span>
        <span className="site-footer-mark" aria-hidden="true">𓂀</span>
      </div>
    </footer>
  );
}
