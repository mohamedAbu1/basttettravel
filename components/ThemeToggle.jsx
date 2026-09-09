"use client";
import React from "react";
import { BsSun, BsMoon } from "react-icons/bs";
import { motion } from "framer-motion";
import { Button } from "@mui/material";
import { useTheme } from "@/context/ThemeContext";
import { usePathname } from "next/navigation";

const ThemeToggle = ({ scrolled }) => {
  const { themeName, toggleThemeFun, theme } = useTheme();
  const pathname = usePathname();

  const segments = pathname.split("/").filter(Boolean);
  const isHome =
    segments.length === 0 ||
    (segments.length === 1 &&
    ["en", "fr", "de", "it", "es", "zh"].includes(segments[0]));

  return (
    <motion.div whileHover={{ scale: 1.1 }}>
      <Button
        sx={{ zIndex: 9999 }}
        onClick={toggleThemeFun}
        aria-label={themeName === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        title={themeName === "dark" ? "Switch to light mode" : "Switch to dark mode"}
        className={`p-3 rounded-full transition-all duration-300 shadow-lg`}
        
      >
        {themeName === "dark" ? (
          <BsSun
            size={22}
            style={{
              color: theme.iconHover,
              filter: "drop-shadow(0 0 6px rgba(194,168,120,0.6))",
            }}
          />
        ) : (
          <BsMoon
            size={22}
            style={{
              color: scrolled ? theme.iconInactive : theme.iconHover,
              filter: "drop-shadow(0 0 4px rgba(0,0,0,0.3))",
            }}
          />
        )}
      </Button>
    </motion.div>
  );
};

export default ThemeToggle;
