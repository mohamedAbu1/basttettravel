"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import { useTheme } from "@/context/ThemeContext";

export default function Background() {
  const { themeName } = useTheme();
  const [index, setIndex] = useState(0);

  // ✅ صور خاصة بالـ Dark Mode للشاشات الكبيرة
  const darkImagesLarge = [
    "/Luxor/pexels-francesco-ungaro-2325447.webp",
    "/Aswan/pexels-axp-photography-500641970-18934583.webp",
  ];

  // ✅ صور خاصة بالـ Dark Mode للشاشات الصغيرة والمتوسطة
  // const darkImagesSmall = [
  //   "/HomePageImage/magnific__create-an-ultrarealistic-8k-background-image-insid__39338.webp",
  //   "/HomePageImage/magnific__create-an-ultrarealistic-8k-background-image-inspi__39335.webp",
  //   "/HomePageImage/magnific__create-an-ultrarealistic-8k-background-image-insid__39337.webp",
  // ];

  // ✅ صور خاصة بالـ Light Mode
  const lightImages = [
    "/HomePageImage/frank-mckenna-OD9EOzfSOh0-unsplash.webp",
    "/HomePageImage/rowan-heuvel-U6t80TWJ1DM-unsplash.webp",
    "/Nile_Cruise/pexels-sahilcaptures-35645491.webp",
    "/Nile_Cruise/andres-dallimonti-hOhOltq7gEU-unsplash.webp",
    "/Nile_Cruise/nacho-diaz-latorre-W4Oc4NIL5_U-unsplash.webp",
  ];

  // ✅ تحديد الصور حسب الثيم وحجم الشاشة
  const images = themeName === "dark" ? darkImagesLarge : lightImages;

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [images]);

  return (
    <div className="absolute inset-0 overflow-hidden">
      <motion.div
        key={images[index]}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2 }}
        className="absolute inset-0"
      >
        <Image
          src={images[index]}
          alt="Egypt travel destination"
          fill
          sizes="100vw"
          quality={70}
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-black/20"></div>
      </motion.div>
    </div>
  );
}
