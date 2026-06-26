"use client";
import React, { useEffect, useRef, useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { motion } from "framer-motion";

export default function Decor({ pos }) {
  const { theme } = useTheme();
  const containerRef = useRef(null);
  const [symbolsCount, setSymbolsCount] = useState(10);

  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new ResizeObserver((entries) => {
      const width = entries[0].contentRect.width;

      // ✅ حساب عدد الرموز حسب عرض الـ container
      let count = Math.floor(width / 200); // كل 70px رمز واحد
      if (count < 6) count = 6;           // حد أدنى
      if (count > 30) count = 30;         // حد أقصى
      setSymbolsCount(count);
    });

    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className={`absolute ${pos}-0 flex justify-around`}>
      {Array.from({ length: symbolsCount }).map((_, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 0.7, y: 0 }}
          transition={{ duration: 1, delay: i * 0.05 }}
          className="text-4xl md:text-5xl lg:text-6xl text-gradient"
          style={{
            filter: `drop-shadow(0 0 6px ${theme.logoBorder || "#C2A878"})`,
          }}
        >
          𓎛
        </motion.span>
      ))}
    </div>
  );
}
