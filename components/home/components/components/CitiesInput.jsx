"use client";
import React from "react";
import { MdLocationCity } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "react-i18next";
const CitiesInput = ({
  selectedCities,
  confirmSelection,
  toggleCity,
  showCities,
  cities,
  setShowCities,
  rightValue,
  topValue,
}) => {
  const { theme } = useTheme();
  const { i18n } = useTranslation(); // ✅ اللغة الحالية
  const normalizedLang = i18n.language.split("-")[0]; // مثل en أو ar أو fr

  return (
    <>
      <MdLocationCity className={`mr-2 text-xl ${theme.iconHover}`} />
      <input
        type="text"
        placeholder="City"
        value={(selectedCities || [])
          .map((c) => c.name?.[normalizedLang] || c.name?.["en"] || c.name)
          .join(" - ")}
        onFocus={() => setShowCities(true)}
        readOnly
        className={`flex-1 p-3 bg-transparent ${theme.text} ${theme.placeholder} 
                   focus:outline-none cursor-pointer`}
      />

      <AnimatePresence>
        {showCities && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            style={{ zIndex: 999, right: rightValue, top: topValue }}
            className={`flex flex-wrap gap-3 w-[400px] absolute 
                       ${theme.card} backdrop-blur-md border ${theme.logoBorder} 
                       rounded-xl shadow-lg z-50 p-4`}
          >
            {cities.map((city) => (
              <motion.div
                key={city.id}
                whileHover={{
                  scale: 1.1,
                  rotate: -2,
                  boxShadow: `0 6px 15px ${theme.logoBorderColor || "rgba(194,168,120,0.6)"}`,
                }}
                onMouseDown={() => toggleCity(city)}
                className={`px-4 py-2 rounded-lg cursor-pointer transition-all duration-300 
                  ${
                    (selectedCities || []).some(
                      (c) => c.id === city.id || c.name === city.name,
                    )
                      ? `${theme.buttonPrimary} text-black shadow-lg`
                      : `${theme.text} ${theme.card} hover:${theme.buttonSecondary}`
                  }`}
              >
                {city.name?.[normalizedLang] || city.name?.["en"] || city.name}
              </motion.div>
            ))}

            <motion.div
              whileHover={{ scale: 1.05 }}
              onMouseDown={confirmSelection}
              className={`w-full rounded-[6px] px-6 py-3 text-center font-semibold tracking-wide 
                          cursor-pointer transition-all duration-300 shadow-lg ${theme.buttonPrimary}`}
              style={{ border: `2px solid ${theme.logoBorder}` }}
            >
              ✅ Confirm
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CitiesInput;
