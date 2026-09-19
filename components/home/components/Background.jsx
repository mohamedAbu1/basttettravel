"use client";
import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
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
  const slides = themeName === "dark" ? darkImages : lightImages.slice(0, 3);
  const [activeIndex, setActiveIndex] = useState(0);
  const [previousIndex, setPreviousIndex] = useState(null);
  const [paused, setPaused] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    setActiveIndex(0);
    setPreviousIndex(null);
  }, [themeName]);

  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotionPreference = () => setReducedMotion(mediaQuery.matches);
    updateMotionPreference();
    mediaQuery.addEventListener?.("change", updateMotionPreference);
    return () => mediaQuery.removeEventListener?.("change", updateMotionPreference);
  }, []);

  const goToSlide = useCallback((nextIndex) => {
    if (nextIndex === activeIndex || slides.length < 2) return;
    setPreviousIndex(activeIndex);
    setActiveIndex(nextIndex);
    window.setTimeout(() => setPreviousIndex(null), 700);
  }, [activeIndex, slides.length]);

  const goToNext = useCallback(() => {
    goToSlide((activeIndex + 1) % slides.length);
  }, [activeIndex, goToSlide, slides.length]);

  const goToPrevious = useCallback(() => {
    goToSlide((activeIndex - 1 + slides.length) % slides.length);
  }, [activeIndex, goToSlide, slides.length]);

  useEffect(() => {
    if (paused || reducedMotion || slides.length < 2) return undefined;
    const interval = window.setInterval(goToNext, 6500);
    return () => window.clearInterval(interval);
  }, [goToNext, paused, reducedMotion, slides.length]);

  const showControls = slides.length > 1;

  return (
    <div
      className="hero-background absolute inset-0 overflow-hidden"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget)) setPaused(false);
      }}
    >
      {previousIndex !== null && (
        <Image
          key={`previous-${themeName}-${previousIndex}`}
          src={slides[previousIndex]}
          alt=""
          aria-hidden="true"
          fill
          sizes="100vw"
          quality={52}
          unoptimized
          className="hero-slide hero-slide-previous object-cover"
        />
      )}
      <Image
        key={`active-${themeName}-${activeIndex}`}
        src={slides[activeIndex]}
        alt=""
        aria-hidden="true"
        fill
        sizes="100vw"
        quality={52}
        unoptimized
        fetchPriority={activeIndex === 0 ? "high" : "auto"}
        loading={activeIndex === 0 ? "eager" : "lazy"}
        className="hero-slide hero-slide-active object-cover"
        priority={activeIndex === 0}
      />
      <div
        className="hero-background-overlay absolute inset-0 bg-gradient-to-b from-black/45 via-black/20 to-black/55"
        aria-hidden="true"
      />
      {showControls && (
        <div className="hero-slider-controls" role="group" aria-label="Hero image slider">
          <button type="button" onClick={goToPrevious} aria-label="Previous hero image">‹</button>
          <div className="hero-slider-dots">
            {slides.map((slide, index) => (
              <button
                key={slide}
                type="button"
                aria-label={`Show hero image ${index + 1}`}
                aria-current={activeIndex === index ? "true" : undefined}
                className={activeIndex === index ? "is-active" : ""}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>
          <button type="button" onClick={goToNext} aria-label="Next hero image">›</button>
        </div>
      )}
    </div>
  );
}
