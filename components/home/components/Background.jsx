"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useTheme } from "@/context/ThemeContext";

export default function Background() {
  const { themeName } = useTheme();
  const [index, setIndex] = useState(0);

  // ✅ صور خاصة بالـ Dark Mode
  const darkImages = [
    "/Luxor/pexels-francesco-ungaro-2325447.webp",
    "/Aswan/pexels-axp-photography-500641970-18934583.webp",
    "/Cairo/travco-travel-c4259777-fab7-4d77-bd9f-d99e1d3fc377.webp",
  ];

  // ✅ صور خاصة بالـ Light Mode
  const lightImages = [
     "/HomePageImage/frank-mckenna-OD9EOzfSOh0-unsplash.webp",
    "/HomePageImage/rowan-heuvel-U6t80TWJ1DM-unsplash.webp",
    "/Nile_Cruise/pexels-sahilcaptures-35645491.webp",
    "/Nile_Cruise/andres-dallimonti-hOhOltq7gEU-unsplash.webp",
    "/Nile_Cruise/nacho-diaz-latorre-W4Oc4NIL5_U-unsplash.webp",
  ];

  const images = themeName === "dark" ? darkImages : lightImages;

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [images]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      {images.map((img, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0 }}
          animate={{ opacity: i === index ? 1 : 0 }}
          transition={{ duration: 2 }}
          className="absolute inset-0"
        >
          <Image
            src={img}
            alt="Background"
            fill
            className="object-cover"
            priority={i === index}
          />
          {/* ✅ Overlay مختلف حسب الثيم */}
           <div className="absolute inset-0 bg-black/20"></div>
        </motion.div>
      ))}
    </div>
  );
}
