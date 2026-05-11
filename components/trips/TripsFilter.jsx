"use client";
import React from "react";
import {
  FaMapMarkerAlt,
  FaDollarSign,
  FaEuroSign,
  FaTags,
  FaFire,
} from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import Divider from "@/components/layout/Divider";
import { usePurchase } from "@/context/PurchaseContext";
import { useQueryFilters } from "@/context/QueryContext"; // ✅ استخدام الكويري كونتكست

export default function TripsFilter({ allCities, allCategories, loading }) {
  const { i18n, t } = useTranslation("trips");
  const normalizedLang = i18n.language.split("-")[0];
  const { themeName } = useTheme();
  const { currency } = usePurchase();

  // ✅ القيم من الكويري كونتكست
  const { city, category, price, popular, updateValue } = useQueryFilters();

  if (loading)
    return <p className="text-center text-gray-500">{t("Loading")}</p>;

  // ✅ أسعار بالدولار كـ base
  const rangesUSD = [
    { label: "0 - 199", value: "Economy" },
    { label: "200 - 599", value: "Standard" },
    { label: "600+", value: "Luxury" },
  ];

  const conversionRate = 0.85;

  // ✅ إضافة خيار All
  const priceRanges = [
    { label: t("All"), value: "All" },
    ...(currency === "EUR"
      ? rangesUSD.map((r) => ({
          ...r,
          label: r.label.includes("+")
            ? `${parseInt(r.label) * conversionRate}+ €`
            : r.label
                .split("-")
                .map((n) => `${(parseInt(n) * conversionRate).toFixed(0)} €`)
                .join(" - "),
        }))
      : rangesUSD.map((r) => ({
          ...r,
          label: r.label.includes("+") ? `${r.label} $` : `${r.label} $`,
        }))),
  ];

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  return (
    <motion.aside
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={fadeUp}
      className={`p-6 rounded-xl shadow-lg transition ${
        themeName === "dark"
          ? "bg-gradient-to-br from-[#0a0a0a] via-[#111] to-[#1a1a1a] text-[#b5892e] border border-[#c9a34a]/40 "
          : "bg-white/0 border border-[#c9a34a]/30 text-[#1a1a1a]"
      }`}
    >
      <h3 className="text-xl font-bold mb-6 text-[#c9a34a]">{t("Filters")}</h3>

      <div className="flex flex-col gap-8">
        {/* المدن */}
        <div>
          <label className="flex items-center gap-2 font-semibold mb-3 text-[#c9a34a]">
            <FaMapMarkerAlt /> {t("Cities")} :
          </label>
          <div className="grid grid-cols-2 gap-2 ml-6">
            {allCities.map((cityObj) => {
              const cityName =
                cityObj.name?.[normalizedLang] ||
                cityObj.name?.["en"] ||
                cityObj.name;
              return (
                <label
                  key={cityObj.id ?? cityName}
                  className="flex items-center gap-2 cursor-pointer hover:text-[#c9a34a] transition"
                >
                  <input
                    type="checkbox"
                    className="accent-[#c9a34a] cursor-pointer"
                    checked={
                      city === "all"
                        ? true
                        : Array.isArray(city)
                        ? city.includes(cityName)
                        : city === cityName
                    }
                    onChange={() => updateValue("city", cityName)}
                  />
                  {cityName}
                </label>
              );
            })}
          </div>
        </div>

        <Divider fadeUp={fadeUp} themeName={themeName} />

        {/* الكاتجري */}
        <div>
          <label className="flex items-center gap-2 font-semibold mb-3 text-[#c9a34a]">
            <FaTags /> {t("Categories")} :
          </label>
          <div className="grid grid-cols-2 gap-2 ml-6">
            {allCategories.map((cat) => {
              const categoryName =
                cat.name?.[normalizedLang] || cat.name?.["en"] || cat.name;
              return (
                <label
                  key={cat.id ?? categoryName}
                  className="flex items-center gap-2 cursor-pointer hover:text-[#c9a34a] transition"
                >
                  <input
                    type="checkbox"
                    className="accent-[#c9a34a] cursor-pointer"
                    checked={
                      category === "all"
                        ? true
                        : Array.isArray(category)
                        ? category.includes(categoryName)
                        : category === categoryName
                    }
                    onChange={() => updateValue("category", categoryName)}
                  />
                  {categoryName}
                </label>
              );
            })}
          </div>
        </div>

        <Divider fadeUp={fadeUp} themeName={themeName} />

        {/* السعر */}
        <div>
          <label className="flex items-center gap-2 font-semibold mb-3 text-[#c9a34a]">
            {currency === "USD" ? <FaDollarSign /> : <FaEuroSign />}{" "}
            {t("PriceRange")} :
          </label>
          <div className="flex flex-col gap-2 ml-6">
            {priceRanges.map((range) => (
              <label
                key={range.value}
                className="flex items-center gap-2 cursor-pointer hover:text-[#c9a34a] transition"
              >
                <input
                  type="radio"
                  name="priceRange"
                  className="accent-[#c9a34a] cursor-pointer"
                  checked={price === range.value} // ✅ هنا لو price = "All" يتحدد تلقائيًا
                  onChange={() => updateValue("price", range.value)}
                />
                {range.label}
              </label>
            ))}
          </div>
        </div>

        <Divider fadeUp={fadeUp} themeName={themeName} />

        {/* الأكثر طلباً */}
        <div>
          <label className="flex items-center gap-2 font-semibold cursor-pointer text-[#c9a34a] hover:text-[#c9a34a] transition">
            <FaFire /> {t("MostPopular")}
            <input
              type="checkbox"
              className="ml-2 accent-[#c9a34a] cursor-pointer"
              checked={popular === true}
              onChange={(e) => updateValue("popular", e.target.checked)}
            />
          </label>
        </div>
      </div>
    </motion.aside>
  );
}
