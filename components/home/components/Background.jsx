"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useTheme } from "@/context/ThemeContext";

export default function Background() {
  const { themeName } = useTheme();
  const [index, setIndex] = useState(0);
  const [isLargeScreen, setIsLargeScreen] = useState(false);

  // ✅ صور خاصة بالـ Dark Mode للشاشات الكبيرة
  const darkImagesLarge = [
    "/Luxor/pexels-francesco-ungaro-2325447.webp",
    "/Aswan/pexels-axp-photography-500641970-18934583.webp",
  ];

  // ✅ صور خاصة بالـ Dark Mode للشاشات الصغيرة والمتوسطة
  const darkImagesSmall = [
    "/HomePageImage/magnific__create-an-ultrarealistic-8k-background-image-insid__39338.png",
    "/HomePageImage/magnific__create-an-ultrarealistic-8k-background-image-inspi__39335.png",
    "/HomePageImage/magnific__create-an-ultrarealistic-8k-background-image-insid__39337.png",
  ];

  // ✅ صور خاصة بالـ Light Mode
  const lightImages = [
    "/HomePageImage/frank-mckenna-OD9EOzfSOh0-unsplash.webp",
    "/HomePageImage/rowan-heuvel-U6t80TWJ1DM-unsplash.webp",
    "/Nile_Cruise/pexels-sahilcaptures-35645491.webp",
    "/Nile_Cruise/andres-dallimonti-hOhOltq7gEU-unsplash.webp",
    "/Nile_Cruise/nacho-diaz-latorre-W4Oc4NIL5_U-unsplash.webp",
  ];

  // ✅ تحديد الصور حسب الثيم وحجم الشاشة
  const images =
    themeName === "dark"
      ? isLargeScreen
        ? darkImagesLarge
        : darkImagesSmall
      : lightImages;

  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 1536); // Tailwind breakpoint 2xl = 1536px
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

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
