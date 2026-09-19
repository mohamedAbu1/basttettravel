"use client";
import Image from "next/image";
import { useTheme } from "@/context/ThemeContext";

const darkImages = [
  "/Luxor/pexels-francesco-ungaro-2325447.webp",
  "/Aswan/pexels-axp-photography-500641970-18934583.webp",
];

const lightImages = [
  "/HomePageImage/frank-mckenna-OD9EOzfSOh0-unsplash.webp",
  "/HomePageImage/rowan-heuvel-U6t80TWJ1DM-unsplash.webp",
  "/Nile_Cruise/pexels-sahilcaptures-35645491.webp",
  "/Nile_Cruise/andres-dallimonti-hOhOltq7gEU-unsplash.webp",
  "/Nile_Cruise/nacho-diaz-latorre-W4Oc4NIL5_U-unsplash.webp",
];

export default function Background() {
  const { themeName } = useTheme();
  // Keep one stable hero asset in the critical path. Rotating the hero on load
  // makes the LCP element change and forces the browser to download more than
  // one large image before the visitor can interact with the page.
  const image = themeName === "dark" ? darkImages[0] : lightImages[0];

  return (
    <div className="absolute inset-0 overflow-hidden">
      <Image
        src={image}
        alt=""
        aria-hidden="true"
        fill
        sizes="100vw"
        quality={50}
        fetchPriority="high"
        className="object-cover"
        priority
      />
      <div
        className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/20 to-black/55"
        aria-hidden="true"
      />
    </div>
  );
}
