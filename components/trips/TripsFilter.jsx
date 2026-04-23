"use client";
import React from "react";
import {
  FaMapMarkerAlt,
  FaDollarSign,
  FaEuroSign,
  FaTags,
  FaFire,
} from "react-icons/fa";
import { useCitiesCategories } from "@/context/CitiesCategoriesContext";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import Divider from "@/components/layout/Divider";
import { useQueryFilters } from "@/context/QueryContext";
import { usePurchase } from "@/context/PurchaseContext";

export default function TripsFilter() {
  const {
    cities: allCities,
    categories: allCategories,
    loading,
  } = useCitiesCategories();
  const { i18n } = useTranslation();
  const normalizedLang = i18n.language.split("-")[0];
  const { t } = useTranslation("trips");
  const { theme, themeName } = useTheme();

  // ✅ القيم مباشرة من الكويري كونتكست
  const { city, category, price, popular, updateValue } = useQueryFilters();

  // ✅ العملة من PurchaseContext
  const { currency } = usePurchase();

  // ✅ تعديل الدالة بحيث تشيل كلمة "all" عند أول اختيار
  const handleCheckboxChange = (type, value) => {
    let current = (type === "city" ? city : category) || [];

    if (current === "all" || current.includes("all")) {
      current = [];
    }

    if (current.includes(value)) {
      updateValue(
        type,
        current.filter((v) => v !== value),
      );
    } else {
      updateValue(type, [...current, value]);
    }
  };

  // ✅ أسعار بالدولار كـ base
  const rangesUSD = [
    { label: "0 - 900", value: "Economy", min: 0, max: 900 },
    { label: "901 - 1500", value: "Standard", min: 901, max: 1500 },
    { label: "1500+", value: "Luxury", min: 1501, max: Infinity },
  ];

  // ✅ معدل التحويل (مثال: 1 USD = 0.85 EUR)
  const conversionRate = 0.85;

  // ✅ تحويل الأسعار حسب العملة
  const priceRanges =
    currency === "EUR"
      ? rangesUSD.map((r) => ({
          ...r,
          label:
            r.max === Infinity
              ? `${(r.min * conversionRate).toFixed(0)}+ €`
              : `${(r.min * conversionRate).toFixed(0)} - ${(r.max * conversionRate).toFixed(0)} €`,
        }))
      : rangesUSD.map((r) => ({
          ...r,
          label: r.max === Infinity ? `${r.min}+ $` : `${r.min} - ${r.max} $`,
        }));

  if (loading) {
    return <p className="text-center text-gray-500">{t("Loading")}</p>;
  }

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const staggerContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.2 } },
  };

  return (
    <motion.aside
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.2 }}
      variants={staggerContainer}
      style={{border:"1px solid #C2A878",borderRadius:"22px"}} 
      className={`p-6 rounded-xl shadow-lg transition `}
    >
      <motion.h3
        variants={fadeUp}
        className="trips-text text-xl font-bold mb-6 text-[#c9a34a]"
        style={{
          WebkitTextStroke:
            themeName === "dark" ? "1px #C2A878" : "1px #5C4B3B",
          textShadow:
            themeName === "dark"
              ? "2px 2px 6px rgba(0,0,0,0.6)"
              : "2px 2px 6px rgba(255,255,255,0.3)",
        }}
      >
        {t("Filters")}
      </motion.h3>

      <motion.div variants={staggerContainer} className="flex flex-col gap-8">
        {/* المدن */}
        <motion.div variants={fadeUp}>
          <label className=" flex items-center gap-2 font-semibold mb-3 text-[#5C4B3B]">
            <FaMapMarkerAlt />{" "}
            <span
              className="trips-text"
              style={{
                WebkitTextStroke:
                  themeName === "dark" ? "1px #C2A878" : "1px #5C4B3B",
                textShadow:
                  themeName === "dark"
                    ? "2px 2px 6px rgba(0,0,0,0.6)"
                    : "2px 2px 6px rgba(255,255,255,0.3)",
              }}
            >
              {t("Cities")} :
            </span>
          </label>
          <div className="grid grid-cols-2 gap-2 ml-6">
            {allCities.map((cityObj) => {
              const cityName =
                cityObj.name?.[normalizedLang] ||
                cityObj.name?.["en"] ||
                cityObj.name;
              return (
                <motion.label
                  variants={fadeUp}
                  key={cityObj.id ?? cityName}
                  className="flex items-center gap-2 cursor-pointer hover:text-[#5C4B3B] transition"
                >
                  <input
                    type="checkbox"
                    className="accent-[#c9a34a] cursor-pointer"
                    checked={
                      city === "all" || city?.includes(cityName) || false
                    }
                    onChange={() => handleCheckboxChange("city", cityName)}
                  />
                  {cityName}
                </motion.label>
              );
            })}
          </div>
        </motion.div>

        <Divider fadeUp={fadeUp} themeName={themeName} />

        {/* الكاتجري */}
        <motion.div variants={fadeUp}>
          <label className="flex items-center gap-2 font-semibold mb-3 text-[#5C4B3B]">
            <FaTags />{" "}
            <span
              className="trips-text"
              style={{
                WebkitTextStroke:
                  themeName === "dark" ? "1px #C2A878" : "1px #5C4B3B",
                textShadow:
                  themeName === "dark"
                    ? "2px 2px 6px rgba(0,0,0,0.6)"
                    : "2px 2px 6px rgba(255,255,255,0.3)",
              }}
            >
              {t("Categories")} :
            </span>
          </label>
          <div className="grid grid-cols-2 gap-2 ml-6">
            {allCategories.map((cat) => {
              const categoryName =
                cat.name?.[normalizedLang] || cat.name?.["en"] || cat.name;
              return (
                <motion.label
                  variants={fadeUp}
                  key={cat.id ?? categoryName}
                  className="flex items-center gap-2 cursor-pointer hover:text-[#5C4B3B] transition"
                >
                  <input
                    type="checkbox"
                    className="accent-[#c9a34a] cursor-pointer"
                    checked={
                      category === "all" ||
                      category?.includes(categoryName) ||
                      false
                    }
                    onChange={() =>
                      handleCheckboxChange("category", categoryName)
                    }
                  />
                  {categoryName}
                </motion.label>
              );
            })}
          </div>
        </motion.div>

        <Divider fadeUp={fadeUp} themeName={themeName} />

        {/* السعر */}
        <motion.div variants={fadeUp}>
          <label className="flex items-center gap-2 font-semibold mb-3 text-[#5C4B3B]">
            {currency === "USD" ? <FaDollarSign /> : <FaEuroSign />}{" "}
            <span
              className="trips-text"
              style={{
                WebkitTextStroke:
                  themeName === "dark" ? "1px #C2A878" : "1px #5C4B3B",
                textShadow:
                  themeName === "dark"
                    ? "2px 2px 6px rgba(0,0,0,0.6)"
                    : "2px 2px 6px rgba(255,255,255,0.3)",
              }}
            >
              {t("PriceRange")} :
            </span>
          </label>
          <div className="flex flex-col gap-2 ml-6">
            {priceRanges.map((range) => (
              <motion.label
                variants={fadeUp}
                key={range.value}
                className="flex items-center gap-2 cursor-pointer hover:text-[#5C4B3B] transition"
              >
                <input
                  type="radio"
                  name="priceRange"
                  className="accent-[#5C4B3B] cursor-pointer"
                  checked={price === range.value}
                  onChange={() => updateValue("price", range.value)}
                />
                {range.label}
              </motion.label>
            ))}
          </div>
        </motion.div>

        <Divider fadeUp={fadeUp} themeName={themeName} />

        {/* الأكثر طلباً */}
        <motion.div variants={fadeUp}>
          <label className="flex items-center gap-2 font-semibold cursor-pointer text-[#5C4B3B] hover:text-[#5C4B3B] transition">
            <FaFire />
            <span
              className="trips-text"
              style={{
                WebkitTextStroke:
                  themeName === "dark" ? "1px #C2A878" : "1px #5C4B3B",
                textShadow:
                  themeName === "dark"
                    ? "2px 2px 6px rgba(0,0,0,0.6)"
                    : "2px 2px 6px rgba(255,255,255,0.3)",
              }}
            >
              {t("MostPopular")}
            </span>
            <input
              type="checkbox"
              className="ml-2 accent-[#5C4B3B] cursor-pointer"
              checked={popular === true}
              onChange={(e) => updateValue("popular", e.target.checked)}
            />
          </label>
        </motion.div>
      </motion.div>
    </motion.aside>
  );
}
