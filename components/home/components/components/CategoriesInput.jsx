"use client";
import React, { useEffect, useState } from "react";
import { MdCategory } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "react-i18next"; // ✅ استدعاء اللغة الحالية

const CategoriesInput = ({
  selectedCategories,
  confirmSelection,
  toggleCategory,
  showCategories,
  categories,
  setShowCategories,
}) => {
  const { theme } = useTheme();
  const { i18n } = useTranslation(); // ✅ اللغة الحالية
  const normalizedLang = i18n.language.split("-")[0]; // مثل en أو ar أو fr

  const [screenSize, setScreenSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const handleResize = () => {
      setScreenSize({ width: window.innerWidth, height: window.innerHeight });
    };

    handleResize(); // أول مرة
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // منطق التحكم في القيم حسب حجم الشاشة
  let rightValue = screenSize.width * 0.19;
  let topValue = 0;

  if (screenSize.width >= 1575) {
    rightValue = screenSize.width * 0.38;
  } else if (screenSize.width >= 1000) {
    rightValue = screenSize.width * 0.36;
  }

  return (
    <>
      <MdCategory className={`mr-2 text-xl ${theme.iconHover}`} />
      <input
        type="text"
        placeholder="Category"
       value={(selectedCategories || [])
          .map((c) => c.name?.[normalizedLang] || c.name?.["en"] || c.name)
          .join(" - ")}
        onFocus={() => setShowCategories(true)}
        readOnly
        className={`flex-1 p-3 bg-transparent ${theme.text} ${theme.placeholder} 
                   focus:outline-none cursor-pointer`}
      />

      <AnimatePresence>
        {showCategories && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            style={{ zIndex: 999, right: rightValue, top: topValue }}
            className={`flex flex-wrap gap-3 w-[400px] absolute mt-2 
                       ${theme.card} backdrop-blur-md border ${theme.logoBorder} 
                       rounded-xl shadow-lg z-50 p-4`}
          >
            {categories.map((cat, i) => (
              <motion.div
                key={i}
                whileHover={{
                  scale: 1.1,
                  rotate: -2,
                  boxShadow: `0 6px 15px ${
                    theme.logoBorderColor || "rgba(194,168,120,0.6)"
                  }`,
                }}
                onMouseDown={() => toggleCategory(cat)}
                className={`px-4 py-2 rounded-lg cursor-pointer transition-all duration-300 
                  ${
                    selectedCategories.some(
                      (c) => c.id === cat.id || c.name === cat.name,
                    )
                      ? `${theme.buttonPrimary} text-black shadow-lg`
                      : `${theme.text} ${theme.card} hover:${theme.buttonSecondary}`
                  }`}
              >
                {cat.name?.[normalizedLang] ||
                  cat.name?.["en"] ||
                  cat.displayName ||
                  cat.name}
              </motion.div>
            ))}

            {/* زر التأكيد ✅ */}
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

export default CategoriesInput;
