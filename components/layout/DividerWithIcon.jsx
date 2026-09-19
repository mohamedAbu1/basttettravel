"use client";
import React from "react";
import { useTheme } from "@/context/ThemeContext";
import { motion } from "framer-motion";

export default function DividerWithIcon() {
  const { themeName, theme } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="flex items-center gap-3 justify-center w-full"
      aria-hidden="true"
    >
      {/* الخط الأيسر */}
      <div
        className="h-[3px] flex-1 rounded-full"
        style={{
          background: "var(--text-gradient)", // ✅ استخدام CSS variable
          opacity: themeName === "dark" ? 0.25 : 0.4,
        }}
      ></div>

      {/* الأيقونة الفرعونية */}
      <motion.span
        whileHover={{ scale: 1.2, rotate: 10 }}
        transition={{ type: "spring", stiffness: 200 }}
        className="text-2xl font-bold text-gradient" // ✅ استخدام class text-gradient
        style={{
          filter: `drop-shadow(0 0 6px ${theme.logoBorder || "#C2A878"})`,
        }}
      >
        𓂀
      </motion.span>

      {/* الخط الأيمن */}
      <div
        className="h-[3px] flex-1 rounded-full"
        style={{
          background: "var(--text-gradient)", // ✅ استخدام CSS variable
          opacity: themeName === "dark" ? 0.25 : 0.4,
        }}
      ></div>
    </motion.div>
  );
}
