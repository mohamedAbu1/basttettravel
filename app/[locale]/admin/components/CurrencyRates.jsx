"use client";

import React from "react";
import { FaArrowRight, FaCheck, FaCoins, FaGlobeAfrica, FaSave, FaSyncAlt } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { useCurrency } from "@/context/CurrencyContext";

const currencies = [
  { key: "USD_EGP", code: "USD", name: "US Dollar", flag: "🇺🇸", tone: "blue", description: "United States dollar to Egyptian pound" },
  { key: "EUR_EGP", code: "EUR", name: "Euro", flag: "🇪🇺", tone: "gold", description: "Euro to Egyptian pound" },
];

export default function CurrencyRates() {
  const { rates, setRates, loading, saving, error, saveRates } = useCurrency();
  const { t } = useTranslation("common");

  if (loading) return <div className="currency-rates-page"><div className="currency-loading-card"><FaSyncAlt className="currency-spin" /><span>{t("loadingCurrencyRates")}</span></div></div>;
  if (error) return <div className="currency-rates-page"><div className="currency-error-card"><strong>Unable to load exchange rates</strong><span>{error}</span></div></div>;

  return <div className="currency-rates-page">
    <section className="currency-rates-hero"><div className="currency-hero-icon"><FaGlobeAfrica /></div><div><span className="admin-section-eyebrow">Finance control</span><h2>Exchange rates</h2><p>Keep every trip price aligned with the current Egyptian pound conversion.</p></div><div className="currency-hero-status"><i /><span>Admin only</span></div></section>
    <section className="currency-rate-grid">{currencies.map((currency) => <article className={`currency-rate-card tone-${currency.tone}`} key={currency.key}><div className="currency-rate-card-top"><span className="currency-flag">{currency.flag}</span><span className="currency-code">{currency.code} / EGP</span><span className="currency-card-icon"><FaCoins /></span></div><div className="currency-rate-card-copy"><h3>{currency.name}</h3><p>{currency.description}</p></div><label className="currency-rate-field"><span>1 {currency.code} equals</span><div><input type="number" min="0" step="0.01" value={rates[currency.key] ?? ""} onChange={(event) => setRates((previous) => ({ ...previous, [currency.key]: event.target.value === "" ? "" : Number(event.target.value) }))} /><strong>EGP</strong></div></label><div className="currency-rate-card-footer"><span>Live conversion base</span><FaArrowRight /></div></article>)}</section>
    <section className="currency-rates-footer"><div><span className="currency-footer-check"><FaCheck /></span><div><strong>Ready to publish</strong><p>Changes apply to trip prices after saving.</p></div></div><button type="button" onClick={saveRates} disabled={saving} className="currency-save-button">{saving ? <><FaSyncAlt className="currency-spin" /> Saving</> : <><FaSave /> {t("saveChanges")}</>}</button></section>
  </div>;
}
