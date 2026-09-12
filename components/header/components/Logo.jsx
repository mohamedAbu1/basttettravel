"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";

export default function BasttetTravelLogo() {
  const { theme } = useTheme();

  const darkLogo = "/brand/basttet-travel-mark-dark.svg";
  const lightLogo = "/brand/basttet-travel-mark-light.svg";

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
        width={64}
        height={64}
        className="site-logo object-contain select-none"
        priority
      />
    </motion.div>
  );
}
