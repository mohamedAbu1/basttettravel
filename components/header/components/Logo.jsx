"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";

export default function BasttetTravelLogo() {
  const { theme } = useTheme();

  // روابط أو مسارات الصور (ضع المسارات الفعلية هنا)
  const darkLogo = "/HomePageImage/Copilot_20260613_134423.png";
  const lightLogo = "/HomePageImage/Copilot_20260613_134550.png";

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="flex items-center justify-center"
    >
      <Image
        src={theme.name === "dark" ? darkLogo : lightLogo}
        alt="Basttet Travel Logo"
        width={120}
        height={120}
        className="object-contain select-none"
        priority
      />
    </motion.div>
  );
}
