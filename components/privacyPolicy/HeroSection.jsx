"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";

export default function HeroSection({ themeName, theme }) {
  return (
    <div className="relative h-[60vh] w-full">
      <Image
        src={
          themeName === "dark"
            ? "/HomePageImage/ChatGPT Image Jul 28, 2026, 10_24_30 PM.png"
            : "/HomePageImage/ChatGPT Image Jul 28, 2026, 10_24_30 PM.png"
        }
        alt="Great Sphinx of Giza"
        fill
        className="object-cover brightness-75"
      />
      <div className={`absolute inset-0 flex flex-col items-center justify-center text-center`}>
        <motion.h1
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className={`${theme.title} text-5xl px-6 py-3 rounded-md shadow-lg`}
        >
          BASTTET TRAVEL
        </motion.h1>
        <motion.h2
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
          className={`${theme.heading} mt-4 text-4xl md:text-4xl`}
        >
          Privacy Policy
        </motion.h2>
      </div>
    </div>
  );
}
