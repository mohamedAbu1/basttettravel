import React from "react";
import { FaTimesCircle } from "react-icons/fa"; // أيقونة مختلفة للـ Exclusions
import { useTheme } from "@/context/ThemeContext";
import { useTrip } from "../../context/TripContext";

export default function TripExclusions() {
  const { themeName } = useTheme();
  const { tripData, updateTripField } = useTrip();
  const languages = ["en", "es", "fr", "de", "it", "zh"];

  // إضافة عنصر جديد مترجم بست لغات
  const addExclusion = () => {
    const newExclusion = { en: "", es: "", fr: "", de: "", it: "", zh: "" };
    updateTripField("exclusions", [...(tripData.exclusions || []), newExclusion]);
  };

  // تحديث قيمة لغة معينة داخل عنصر معين
  const updateExclusion = (index, lang, value) => {
    const updated = [...tripData.exclusions];
    updated[index] = { ...updated[index], [lang]: value };
    updateTripField("exclusions", updated);
  };

  return (
    <div>
      <h3
        className={`text-xl font-bold mb-3 ${
          themeName === "dark" ? "text-red-400" : "text-[#8b0000]"
        }`}
      >
        Trip Exclusions
      </h3>

      {tripData.exclusions?.map((exc, i) => (
        <div
          key={i}
          className={`mb-4 p-3 rounded-lg border ${
            themeName === "dark"
              ? "bg-[#0f0f0f] border-red-400/30 text-white"
              : "bg-[#fff0f0] border-[#8b0000]/40 text-[#3a2c0a]"
          }`}
        >
          <div className="flex items-center gap-2 mb-2">
            <FaTimesCircle
              className={`text-xl ${
                themeName === "dark" ? "text-red-400" : "text-[#8b0000]"
              }`}
            />
            <span className="font-semibold">Exclusion {i + 1}</span>
          </div>

          {/* حقول إدخال لكل لغة */}
          <div className="grid grid-cols-2 gap-2">
            {languages.map((lang) => (
              <input
                key={lang}
                type="text"
                value={exc[lang] ?? ""}
                onChange={(e) => updateExclusion(i, lang, e.target.value)}
                placeholder={`Exclusion (${lang.toUpperCase()})`}
                className={`p-2 rounded-lg border outline-none ${
                  themeName === "dark"
                    ? "bg-[#1a1a1a] border-red-400/30 text-white"
                    : "bg-white border-[#8b0000]/40 text-[#3a2c0a]"
                }`}
              />
            ))}
          </div>
        </div>
      ))}

      <button
        type="button"
        onClick={addExclusion}
        className={`px-4 py-2 rounded-lg font-bold mt-2 ${
          themeName === "dark"
            ? "bg-red-400 text-black hover:bg-red-500"
            : "bg-[#8b0000] text-white hover:bg-[#a52a2a]"
        }`}
      >
        + Add Exclusion
      </button>
    </div>
  );
}
