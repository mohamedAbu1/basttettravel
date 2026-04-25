"use client";
import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";

export default function MontuTravelLogo() {
  const { themeName } = useTheme();

  const goldColor = themeName === "dark" ? "#d4af37" : "#C9A34A";
  const textColor = themeName === "dark" ? "#fff" : "#1F2937";

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="flex items-center justify-center"
    >
      <svg
        width="140"
        height="80"
        viewBox="0 0 800 400"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* الشمس الفرعونية */}
        <circle cx="100" cy="100" r="40" fill={goldColor} />
        <line x1="100" y1="20" x2="100" y2="0" stroke={goldColor} strokeWidth="4" />
        <line x1="160" y1="100" x2="180" y2="100" stroke={goldColor} strokeWidth="4" />
        <line x1="40" y1="100" x2="20" y2="100" stroke={goldColor} strokeWidth="4" />

        {/* الأهرامات */}
        <polygon points="250,180 300,80 350,180" fill={goldColor} />
        <polygon points="320,180 370,100 420,180" fill={goldColor} />

        {/* عين حورس */}
        <path
          d="M500,120 C520,100 560,100 580,120 C560,140 520,140 500,120 Z"
          stroke={goldColor}
          strokeWidth="3"
          fill="none"
        />
        <circle cx="540" cy="120" r="6" fill={goldColor} />

        {/* صولجان واس */}
        <path d="M650,80 L650,160" stroke={goldColor} strokeWidth="6" />
        <circle cx="650" cy="60" r="12" fill={goldColor} />

        {/* اسم الموقع */}
        <text
          x="200"
          y="300"
          fontFamily="Inter"
          fontWeight="700"
          fontSize="48"
          fill={textColor}
        >
          MontuTravel
        </text>
        <text
          x="200"
          y="340"
          fontFamily="Inter"
          fontWeight="500"
          fontSize="24"
          fill={goldColor}
        >
          Discover Egypt
        </text>
      </svg>
    </motion.div>
  );
}
