"use client";

import Image from "next/image";
import { useTheme } from "@/context/ThemeContext";

/** Shared brand asset used everywhere outside the compact header mark. */
export default function BrandLogo({ variant = "horizontal", className = "", priority = false }) {
  const { themeName } = useTheme();
  const isMark = variant === "mark";
  const source = `/brand/basttet-travel-${isMark ? "mark" : "logo"}-${themeName === "dark" ? "dark" : "light"}.svg`;

  return (
    <Image
      src={source}
      alt="Basttet Travel logo"
      width={isMark ? 512 : 720}
      height={isMark ? 512 : 220}
      priority={priority}
      className={`object-contain select-none ${className}`}
    />
  );
}
