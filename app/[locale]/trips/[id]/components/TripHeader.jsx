/* eslint-disable react-hooks/purity */
"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { FaChevronLeft, FaChevronRight, FaImages, FaMapMarkerAlt } from "react-icons/fa";
import { motion } from "framer-motion";
import { sites } from "@/constants/images";
import { useTheme } from "@/context/ThemeContext";

export default function TripHeader({ trip, lang }) {
  const { theme } = useTheme();
  const [activeIndex, setActiveIndex] = useState(0);
  const images = Array.isArray(trip?.gallery_images) ? trip.gallery_images : [];

  useEffect(() => {
    setActiveIndex(0);
  }, [trip?.id]);

  useEffect(() => {
    if (images.length < 2) return undefined;
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % images.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [images.length]);

  const description =
    typeof trip?.description?.[lang] === "string"
      ? trip.description[lang]
      : trip?.description?.en || "";

  const copy = {
    en: { brand: "Basttet Travel", location: "Luxor · Aswan · Egypt", fallback: "Discover Egypt through a carefully planned local experience.", noPhotos: "No photos available for this trip.", previous: "Previous image", next: "Next image", gallery: "Trip gallery", image: "Trip image" },
    de: { brand: "Basttet Travel", location: "Luxor · Assuan · Ägypten", fallback: "Entdecken Sie Ägypten mit einer sorgfältig geplanten lokalen Erfahrung.", noPhotos: "Für diese Reise sind keine Fotos verfügbar.", previous: "Vorheriges Bild", next: "Nächstes Bild", gallery: "Reisegalerie", image: "Reisebild" },
    es: { brand: "Basttet Travel", location: "Luxor · Asuán · Egipto", fallback: "Descubre Egipto a través de una experiencia local cuidadosamente planificada.", noPhotos: "No hay fotos disponibles para este viaje.", previous: "Imagen anterior", next: "Siguiente imagen", gallery: "Galería del viaje", image: "Imagen del viaje" },
    fr: { brand: "Basttet Travel", location: "Louxor · Assouan · Égypte", fallback: "Découvrez l'Égypte à travers une expérience locale soigneusement préparée.", noPhotos: "Aucune photo n'est disponible pour ce voyage.", previous: "Image précédente", next: "Image suivante", gallery: "Galerie du voyage", image: "Image du voyage" },
    it: { brand: "Basttet Travel", location: "Luxor · Assuan · Egitto", fallback: "Scopri l'Egitto attraverso un'esperienza locale attentamente organizzata.", noPhotos: "Non sono disponibili foto per questo viaggio.", previous: "Immagine precedente", next: "Immagine successiva", gallery: "Galleria del viaggio", image: "Immagine del viaggio" },
    zh: { brand: "Basttet Travel", location: "卢克索 · 阿斯旺 · 埃及", fallback: "通过精心安排的当地体验探索埃及。", noPhotos: "此行程暂无照片。", previous: "上一张图片", next: "下一张图片", gallery: "行程图库", image: "行程图片" },
  }[lang] || {
    brand: "Basttet Travel",
    location: "Luxor · Aswan · Egypt",
    fallback: "Discover Egypt through a carefully planned local experience.",
    noPhotos: "No photos available for this trip.",
    previous: "Previous image",
    next: "Next image",
    gallery: "Trip gallery",
    image: "Trip image",
  };

  const highlightedDescription = useMemo(() => {
    if (!description) return "";
    const names = sites
      .map((site) => (typeof site.name === "string" ? site.name : site.name?.[lang] || site.name?.en))
      .filter(Boolean);
    if (!names.length) return description;
    const regex = new RegExp("(" + names.join("|") + ")", "gi");
    return description.split(regex).map((part, index) =>
      names.some((name) => name.toLowerCase() === part.toLowerCase()) ? (
        <span key={index} className="font-semibold text-[#d4b56f]">{part}</span>
      ) : (
        <span key={index}>{part}</span>
      ),
    );
  }, [description]);

  const selectImage = (index) => {
    if (!images.length) return;
    setActiveIndex((index + images.length) % images.length);
  };

  if (!images.length) {
    return (
      <section className={theme.card + " rounded-3xl border border-[#d4b56f]/30 p-8 text-center " + theme.text}>
        <h1 className="text-3xl font-bold text-[#d4b56f]">{trip?.title?.[lang] || trip?.title?.en}</h1>
        <p className={"mt-4 leading-7 " + theme.subText}>{copy.noPhotos}</p>
      </section>
    );
  }

  const activeImage = images[activeIndex] || images[0];
  const activeUrl = activeImage?.url || activeImage || "/default.jpg";
  const activeName = activeImage?.name?.[lang] || activeImage?.name?.en || "";

  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className={theme.card + " overflow-hidden rounded-3xl border border-[#d4b56f]/30 shadow-2xl " + theme.text}
    >
      <div className="grid lg:grid-cols-[1.15fr_0.85fr]">
        <div className="relative min-h-[290px] md:min-h-[440px]">
          <motion.div key={activeIndex} initial={{ opacity: 0.5 }} animate={{ opacity: 1 }} className="absolute inset-0">
            <Image
              src={activeUrl}
              alt={activeName || trip?.title?.[lang] || trip?.title?.en || copy.image}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 60vw"
              className="object-cover"
            />
          </motion.div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/15 to-black/10" />
          <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-4 text-white">
            <div>
              <p className="mb-2 flex items-center gap-2 text-sm text-[#ead49e]">
                <FaImages aria-hidden="true" /> {activeIndex + 1} / {images.length}
              </p>
              {activeName && <p className="text-sm font-medium">{activeName}</p>}
            </div>
            {images.length > 1 && (
              <div className="flex gap-2">
                <button type="button" onClick={() => selectImage(activeIndex - 1)} aria-label={copy.previous} className="min-h-11 min-w-11 rounded-full border border-white/40 bg-black/35 p-3 backdrop-blur hover:bg-black/60">
                  <FaChevronLeft aria-hidden="true" />
                </button>
                <button type="button" onClick={() => selectImage(activeIndex + 1)} aria-label={copy.next} className="min-h-11 min-w-11 rounded-full border border-white/40 bg-black/35 p-3 backdrop-blur hover:bg-black/60">
                  <FaChevronRight aria-hidden="true" />
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex flex-col justify-center p-6 md:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#d4b56f]">{copy.brand}</p>
          <h1 className="mt-3 text-3xl font-bold leading-tight md:text-4xl">
            {trip.title?.[lang] || trip.title?.en || "Egypt experience"}
          </h1>
          <div className={"mt-5 flex items-center gap-2 text-sm " + theme.subText}>
            <FaMapMarkerAlt className="text-[#d4b56f]" aria-hidden="true" />
            <span>{copy.location}</span>
          </div>
          <p className={"mt-6 max-h-52 overflow-auto pr-2 text-base leading-8 " + theme.subText}>
            {highlightedDescription || copy.fallback}
          </p>
        </div>
      </div>

      <div className="flex gap-3 overflow-x-auto border-t border-[#d4b56f]/20 bg-black/10 p-4" aria-label={copy.gallery}>
        {images.map((image, index) => {
          const imageUrl = image?.url || image || "/default.jpg";
          const imageName = image?.name?.[lang] || image?.name?.en || copy.image + " " + (index + 1);
          return (
            <button
              key={imageUrl + index}
              type="button"
              onClick={() => selectImage(index)}
              aria-label={"View " + imageName}
              aria-pressed={index === activeIndex}
              className={"relative h-16 w-24 shrink-0 overflow-hidden rounded-xl border-2 transition md:h-20 md:w-32 " + (index === activeIndex ? "border-[#d4b56f] ring-2 ring-[#d4b56f]/30" : "border-transparent opacity-70 hover:opacity-100")}
            >
              <Image src={imageUrl} alt="" fill sizes="128px" className="object-cover" />
            </button>
          );
        })}
      </div>
    </motion.section>
  );
}
