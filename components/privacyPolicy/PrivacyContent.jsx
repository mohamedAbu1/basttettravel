"use client";
import { motion } from "framer-motion";
import DividerWithIcon from "../layout/DividerWithIcon";
import Link from "next/link";
import { useTranslation } from "react-i18next";

export default function PrivacyContent({ theme }) {
  const { t } = useTranslation("privacyPolicy");

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.5 }}
      className={`${theme.card} shadow-lg p-10 mt-[-4rem] relative z-10 max-w-5xl mx-auto`}
    >
      <article
        className={`prose max-w-none prose-lg leading-relaxed ${theme.text} flex flex-col gap-3`}
      >
        <h1 className={`${theme.title} text-3xl pt-5`}>
          {t("title")}
        </h1>
        <DividerWithIcon />

        <p>
          <strong className="capitalize">{t("effectiveDate", { defaultValue: "Effective date:" })}</strong> {t("effectiveDate")}
        </p>
        <p>{t("intro")}</p>
        <>
          {t("dataUsage")}{" "}
          {t("consent")}{" "}
          <Link href="/cancellationPolicy" className="text-blue-500 underline">
            Cancellation Policy
          </Link>
        </>
        <DividerWithIcon />
        <DividerWithIcon />

        <h2 className={theme.heading}>
          <strong className="capitalize">{t("informationCollection")}</strong>
        </h2>
        <p>{t("informationCollectionText")}</p>
        <DividerWithIcon />

        <h3 className={theme.heading}>
          <strong className="capitalize">{t("typesOfData")}</strong>
        </h3>
        <h4 className={theme.subText}>{t("personalData")}</h4>
        <ul>
          <li>{t("emailAddress")}</li>
          <li>{t("fullName")}</li>
          <li>{t("phoneNumber")}</li>
          <li>{t("address")}</li>
          <li>{t("cookiesUsage")}</li>
        </ul>

        <h4 className={theme.subText}>{t("usageData")}</h4>
        <p>{t("usageDataText")}</p>

        <h4 className={theme.subText}>{t("cookiesData")}</h4>
        <p>{t("cookiesDataText")}</p>
        <DividerWithIcon />

        <h2 className={theme.heading}>
          <strong className="capitalize">{t("useOfData")}</strong>
        </h2>
        <ul>
          <li>{t("provideService")}</li>
          <li>{t("notifyChanges")}</li>
          <li>{t("interactiveFeatures")}</li>
          <li>{t("customerCare")}</li>
          <li>{t("monitorUsage")}</li>
          <li>{t("preventIssues")}</li>
        </ul>
        <DividerWithIcon />

        <h2 className={theme.heading}>
          <strong className="capitalize">{t("contactUs")}</strong>
        </h2>
        <ul>
          <li><strong>{t("ownerLabel")}</strong> {t("owner")}</li>
          <li><strong>{t("emailLabel")}</strong> {t("email")}</li>
          <li><strong>{t("phoneLabel")}</strong> {t("phone")}</li>
        </ul>
      </article>
    </motion.div>
  );
}
