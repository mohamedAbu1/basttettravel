"use client"
import React from "react";
import { FaSearch, FaThLarge, FaBars } from "react-icons/fa";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "react-i18next";

export default function TripsSearch({ search, setSearch, cardStyle, setCardStyle }) {
  const { themeName } = useTheme();
  const { t } = useTranslation("trips");

  return (
    <div
      className={`flex w-full items-center gap-3 p-4 rounded-xl shadow transition ${
        themeName === "dark"
          ? "bg-[#0f0f0f] border border-gold/30 text-white"
          : "bg-white/80 border border-[#c9a34a]/30 text-[#3a2c0a] backdrop-blur-sm"
      }`}
    >
      {/* أيقونة البحث + input */}
      <FaSearch className={`text-xl ${themeName === "dark" ? "text-gold" : "text-[#3a2c0a]"}`} />
      <input
        type="text"
        placeholder={t("Searchtrips")}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className={`flex-1 p-2 rounded-lg border outline-none transition ${
          themeName === "dark"
            ? "bg-[#1a1a1a] text-white border-gold/30 focus:border-gold"
            : "bg-white text-[#3a2c0a] border-[#c9a34a]/30 focus:border-[#c9a34a]"
        }`}
      />

      {/* أزرار تغيير الاستايل */}
      <div className="flex gap-2">
        <button
          onClick={() => setCardStyle("vertical")}
          className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-bold transition ${
            cardStyle === "vertical"
              ? themeName === "dark"
                ? "bg-[#C2A878] text-black hover:bg-yellow-500"
                : "bg-[#C2A878] text-white hover:bg-[#b5892e]"
              : themeName === "dark"
                ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          <FaThLarge /> {t("Vertical")}
        </button>

        <button
          onClick={() => setCardStyle("horizontal")}
          className={`flex items-center gap-1 px-3 py-2 rounded-lg text-sm font-bold transition ${
            cardStyle === "horizontal"
              ? themeName === "dark"
                ? "bg-[#C2A878] text-black hover:bg-yellow-500"
                : "bg-[#C2A878] text-white hover:bg-[#b5892e]"
              : themeName === "dark"
                ? "bg-gray-700 text-gray-300 hover:bg-gray-600"
                : "bg-gray-200 text-gray-700 hover:bg-gray-300"
          }`}
        >
          <FaBars /> {t("Horizontal")} 
        </button>
      </div>
    </div>
  );
}
