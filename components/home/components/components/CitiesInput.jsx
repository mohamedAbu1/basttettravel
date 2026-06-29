"use client";
import React from "react";
import * as Popover from "@radix-ui/react-popover";
import { MdLocationCity } from "react-icons/md";
import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "react-i18next";

const CitiesInput = ({ selectedCities, toggleCity, cities }) => {
  const { theme } = useTheme();
  const { i18n } = useTranslation();
  const normalizedLang = i18n.language.split("-")[0]; // مثل en أو ar أو fr

  return (
    <Popover.Root>
      {/* زر الإدخال */}
      <Popover.Trigger asChild>
        <button
          className={`flex items-center w-full px-4 py-2 rounded-lg ${theme.card} shadow-sm cursor-pointer`}
        >
          <MdLocationCity className={`mr-2 text-xl ${theme.iconHover}`} />
          <span className={`flex-1 text-left ${theme.text}`}>
            {(selectedCities || [])
              .map((c) => c.name?.[normalizedLang] || c.name?.["en"] || c.name)
              .join(" - ") || "Select City"}
          </span>
        </button>
      </Popover.Trigger>

      {/* محتوى الـ dropdown */}
      <Popover.Portal>
        <Popover.Content
          side="left"
          align="start"
          sideOffset={45}
          className={`w-[350px] p-4 rounded-xl z-[9999] shadow-lg ${theme.card} flex flex-col gap-3`}
        >
          {cities.map((city) => (
            <motion.button
              key={city.id}
              whileHover={{ scale: 1.05 }}
              onClick={() => toggleCity(city)}
              className={`px-4 py-2 rounded-lg text-left transition-all duration-300 cursor-pointer
                ${
                  (selectedCities || []).some((c) => c.id === city.id)
                    ? `${theme.buttonPrimary} text-black shadow-lg`
                    : `${theme.text} hover:${theme.buttonSecondary}`
                }`}
            >
              {city.name?.[normalizedLang] || city.name?.["en"] || city.name}
            </motion.button>
          ))}

          {/* زر التأكيد */}
          <Popover.Close
            className={`w-full rounded-[6px] px-6 py-3 text-center font-semibold tracking-wide 
                        cursor-pointer transition-all duration-300 shadow-lg ${theme.buttonPrimary}`}
            style={{ border: `2px solid ${theme.logoBorder}` }}
          >
            ✅ Confirm
          </Popover.Close>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};

export default CitiesInput;
