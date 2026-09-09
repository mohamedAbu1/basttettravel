"use client";
import React, { useState, useEffect } from "react";
import { FaArrowUp } from "react-icons/fa";
import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";

export default function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);
  const { theme } = useTheme();

  useEffect(() => {
    const handleScroll = () => setIsVisible(window.scrollY > 120);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {isVisible && (
        <motion.button
          type="button"
          onClick={scrollToTop}
          aria-label="Scroll to top"
          title="Scroll to top"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.15 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.4 }}
          className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 
                      rounded-full p-4 cursor-pointer z-50 shadow-lg backdrop-blur-md`}
          style={{
            border: `2px solid ${theme.logoBorder}`,
            background: "rgba(255,255,255,0.08)",
          }}
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          >
            <FaArrowUp
              size={22}
              style={{
                color: theme.iconHover,
                filter: "drop-shadow(0 0 6px rgba(194,168,120,0.6))",
              }}
            />
          </motion.div>
        </motion.button>
      )}
    </>
  );
}
