"use client";
import React from "react";
import { motion } from "framer-motion";

// أيقونة أنخ
const AnkhIcon = () => (
  <span className="text-[#C2A878] dark:text-gold text-xl font-bold">☥</span>
);

export default function Divider({ fadeUp, themeName }) {
  return (
    <motion.div
      variants={fadeUp}
      className="relative flex items-center justify-center my-4"
    >
      <hr
        className={`w-full border-t-2 ${
          themeName === "dark"
            ? "border-[#C2A878]/40"
            : "border-[#C2A878]/40"
        }`}
      />
      <div className="absolute bg-inherit px-2">
        <AnkhIcon />
      </div>
    </motion.div>
  );
}
