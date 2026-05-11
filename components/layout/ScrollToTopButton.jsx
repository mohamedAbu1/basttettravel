"use client";
import React, { useState, useEffect } from "react";
import { FaArrowUp } from "react-icons/fa";
import { motion } from "framer-motion";

export default function ScrollToTopButton() {
  const [isVisible, setIsVisible] = useState(false);

  // ✅ مراقبة الاسكرول
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 120) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // ✅ عند الضغط يرجع لأعلى الصفحة بسكرول سموز
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      {isVisible && (
        <div
          onClick={scrollToTop}
          whileHover={{ scale: 1.1 }}
          className="fixed bottom-6 left-1/2 transform -translate-x-1/2 
                     rounded-full p-3 bg-transparent backdrop-blur-md 
                     border border-[#C2A878] text-[#C2A878] font-semibold tracking-wide 
                     hover:bg-[#C2A878]/20 hover:text-white transition-all duration-300 
                     shadow-lg cursor-pointer z-50"
        >
          <FaArrowUp size={20} />
        </div>
      )}
    </>
  );
}
