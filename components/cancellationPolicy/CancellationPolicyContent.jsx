"use client";
import { motion } from "framer-motion";
import DividerWithIcon from "../layout/DividerWithIcon";
import { useTranslation } from "react-i18next";

export default function CancellationPolicyContent({ theme }) {
  const { t } = useTranslation("cancellationPolicy");

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.5 }}
      className={`${theme.card} shadow-lg p-10 mt-[-4rem] relative z-10 max-w-5xl mx-auto`}
    >
      <article className={`prose max-w-none prose-lg leading-relaxed ${theme.text} flex flex-col gap-3`}>
        
        <h1 className={`${theme.title} text-3xl pt-5 capitalize`}>
          {t("title")}
        </h1>
        <DividerWithIcon />

        <p>
          <strong className="capitalize">{t("effectiveDateLabel", { defaultValue: "Effective date:" })}</strong> {t("effectiveDate")}
        </p>

        {/* Cancellation Policy */}
        <h2 className={theme.heading}>{t("cancellationPolicy")}</h2>
        <p>{t("cancellationText")}</p>
        <ul>
          {t("cancellationRules", { returnObjects: true }).map((rule, i) => (
            <li key={i}>{rule}</li>
          ))}
        </ul>
        <p><strong>{t("noteLabel", { defaultValue: "Note:" })}</strong> {t("note")}</p>
        <DividerWithIcon />

        {/* Refunds */}
        <h2 className={theme.heading}>{t("refunds")}</h2>
        <p>{t("refundsText")}</p>
        <DividerWithIcon />

        {/* Accommodation */}
        <h2 className={theme.heading}>{t("accommodation")}</h2>
        <p>{t("accommodationText")}</p>
        <DividerWithIcon />

        {/* Responsibility */}
        <h2 className={theme.heading}>{t("responsibility")}</h2>
        <p>{t("responsibilityText")}</p>
        <ul>
          {t("responsibilityList", { returnObjects: true }).map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
        <DividerWithIcon />

        {/* Special Requests */}
        <h2 className={theme.heading}>{t("specialRequests")}</h2>
        <p>{t("specialRequestsText")}</p>
        <DividerWithIcon />

        {/* Children Policy */}
        <h2 className={theme.heading}>{t("childrenPolicy")}</h2>
        <h4 className={theme.subText}>{t("packages")}</h4>
        <ul>
          {t("packagesList", { returnObjects: true }).map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
        <h4 className={theme.subText}>{t("tours")}</h4>
        <ul>
          {t("toursList", { returnObjects: true }).map((item, i) => (
            <li key={i}>{item}</li>
          ))}
        </ul>
        <DividerWithIcon />

        {/* Tipping */}
        <h2 className={theme.heading}>{t("tipping")}</h2>
        <p>{t("tippingText")}</p>
        <DividerWithIcon />

        {/* Complaints */}
        <h2 className={theme.heading}>{t("complaints")}</h2>
        <p>{t("complaintsText")}</p>
        <DividerWithIcon />

        {/* Acceptance */}
        <h2 className={theme.heading}>{t("acceptance")}</h2>
        <p>{t("acceptanceText")}</p>
        <DividerWithIcon />

        {/* Contact */}
        <h2 className={theme.heading}>{t("contact")}</h2>
        <ul>
          <li><strong>{t("ownerLabel")}</strong> {t("owner")}</li>
          <li><strong>{t("emailLabel")}</strong> {t("email")}</li>
          <li><strong>{t("phoneLabel")}</strong> {t("phone")}</li>
        </ul>
      </article>
    </motion.div>
  );
}
