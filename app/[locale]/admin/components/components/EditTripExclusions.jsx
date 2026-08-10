"use client";
import React from "react";
import { FaTimesCircle } from "react-icons/fa"; // أيقونة مختلفة للـ Exclusions
import { useTheme } from "@/context/ThemeContext";
import { useTripID } from "../../context/TripIDContext";
import { v4 as uuidv4 } from "uuid";

const EditTripExclusions = () => {
  const { themeName } = useTheme();
  const { tripData, updateTripField } = useTripID();

  // اللغات المدعومة
  const languages = ["en", "es", "fr", "de", "it", "zh"];

  // ✅ تحديث نص exclusion معين
  const updateExclusion = (index, lang, value) => {
    const updatedExclusions = [...(tripData?.exclusions || [])];
    updatedExclusions[index] = {
      ...updatedExclusions[index],
      exclusions_translations: {
        ...updatedExclusions[index].exclusions_translations,
        [lang]: value,
      },
    };
    updateTripField("exclusions", updatedExclusions); // ✅ الحقل الصحيح
  };

  // ✅ إضافة exclusion جديد مع UUID صالح
  const addExclusion = () => {
    const updatedExclusions = [
      ...(tripData?.exclusions || []),
      {
        id: uuidv4(), // ✅ توليد UUID صحيح
        exclusions_translations: {
          en: "",
          es: "",
          fr: "",
          de: "",
          it: "",
          zh: "",
        },
      },
    ];
    updateTripField("exclusions", updatedExclusions);
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

      {tripData?.exclusions?.map((exc, i) => (
        <div
          key={exc.id ?? i}
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
                value={exc.exclusions_translations?.[lang] ?? ""}
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
};

export default EditTripExclusions;
