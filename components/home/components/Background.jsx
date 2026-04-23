"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

const images = [
  "/HomePageImage/pexels-sahilcaptures-35645491.webp",
  "/HomePageImage/pexels-axp-photography-500641970-18934583.webp",
  "/HomePageImage/pexels-axp-photography-500641970-18934598.webp",
  "/Cairo/travco-travel-c4259777-fab7-4d77-bd9f-d99e1d3fc377.webp",
];

export default function Background() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 8000); // كل 8 ثواني تتغير الصورة
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <AnimatePresence>
        <motion.div
          key={index}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2 }}
          className="absolute inset-0"
        >
          <Image
            src={images[index]}
            alt="Background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/20"></div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
