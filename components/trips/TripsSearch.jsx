"use client"
import React from "react";
import { FaSearch, FaThLarge, FaBars } from "react-icons/fa";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "react-i18next";

export default function TripsSearch({ search, setSearch, cardStyle, setCardStyle }) {
  const { themeName } = useTheme();
  const { t } = useTranslation("trips");

  return (
    <div className={`search-bar ${themeName === "dark" ? "card-dark" : "card-light"}`}>
      {/* أيقونة البحث + input */}
      <FaSearch className="search-icon" />
      <input
        type="text"
        placeholder={t("Searchtrips")}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className={`search-input ${themeName === "dark" ? "input-dark" : "input-light"}`}
      />

      {/* أزرار تغيير الاستايل */}
      <div className="flex gap-2">
        <button
          onClick={() => setCardStyle("vertical")}
          className={`style-btn ${cardStyle === "vertical" ? "btn-active" : "btn-inactive"}`}
        >
          <FaThLarge /> {t("Vertical")}
        </button>

        <button
          onClick={() => setCardStyle("horizontal")}
          className={`style-btn ${cardStyle === "horizontal" ? "btn-active" : "btn-inactive"}`}
        >
          <FaBars /> {t("Horizontal")}
        </button>
      </div>
    </div>
  );
}
