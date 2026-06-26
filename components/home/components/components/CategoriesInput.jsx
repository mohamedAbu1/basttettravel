"use client";
import React from "react";
import * as Popover from "@radix-ui/react-popover";
import { MdCategory } from "react-icons/md";
import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "react-i18next";

const CategoriesInput = ({ selectedCategories, toggleCategory, categories }) => {
  const { theme } = useTheme();
  const { i18n } = useTranslation();
  const normalizedLang = i18n.language.split("-")[0];

  return (
    <div className="relative w-full">
      <Popover.Root>
        {/* زر الإدخال */}
        <Popover.Trigger asChild>
          <button
            className={`flex items-center w-full px-4 py-2 rounded-lg border ${theme.logoBorder} ${theme.card} shadow-sm cursor-pointer`}
          >
            <MdCategory className={`mr-2 text-xl ${theme.iconHover}`} />
            <span className={`flex-1 text-left ${theme.text}`}>
              {(selectedCategories || [])
                .map((c) => c.name?.[normalizedLang] || c.name?.["en"] || c.name)
                .join(" - ") || "Select Category"}
            </span>
          </button>
        </Popover.Trigger>

        {/* محتوى الـ dropdown */}
        <Popover.Portal>
          <Popover.Content
            side="left"        // ✅ يظهر بجانب الزر من اليسار
            align="start"      // ✅ يبدأ من أعلى الزر
            sideOffset={10}    // مسافة صغيرة بين الزر والـ Popover
            className={`absolute w-[350px] z-[9999] p-4 rounded-xl shadow-lg border ${theme.logoBorder} ${theme.card} flex flex-col gap-3`}
          >
            {categories.map((cat) => (
              <motion.button
                key={cat.id}
                whileHover={{ scale: 1.05 }}
                onClick={(e) => {
                  e.preventDefault(); // يمنع الإغلاق التلقائي
                  toggleCategory(cat);
                }}
                className={`px-4 py-2 rounded-lg text-left transition-all duration-300 cursor-pointer
                  ${
                    (selectedCategories || []).some((c) => c.id === cat.id)
                      ? `${theme.buttonPrimary} text-black shadow-lg`
                      : `${theme.text} hover:${theme.buttonSecondary}`
                  }`}
              >
                {cat.name?.[normalizedLang] ||
                  cat.name?.["en"] ||
                  cat.displayName ||
                  cat.name}
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
    </div>
  );
};

export default CategoriesInput;
