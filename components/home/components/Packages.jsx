"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import LogoLetter from "@/components/LogoLetter";
import { useLanguage } from "@/context/LanguageContext";
import { useRouter } from "next/navigation";

export default function Packages({ showTrips }) {
  const { theme, themeName } = useTheme();
  const { lang } = useLanguage();
  const router = useRouter();

  if (showTrips === true) return null;

  // ✅ بيانات ستاتيك
  const staticTrips = {
    lightModeTrips: [
      { id: 1, title: { en: "Nile Cruise Luxor-Aswan" }, price: 250, currency: "USD", cover_image: "/Nile_Cruise/Dahabeya-program-SOBEK-900x600.webp", category_id: 1 },
      { id: 2, title: { en: "Luxury Nile Cruise" }, price: 400, currency: "USD", cover_image: "/Nile_Cruise/5116-900x600.webp", category_id: 1 },
      { id: 3, title: { en: "Budget Nile Cruise" }, price: 150, currency: "USD", cover_image: "/Nile_Cruise/peter-hansen-MeGmdPNe36w-unsplash.webp", category_id: 2 }
    ],
    darkModeTrips: [
      { id: 4, title: { en: "Cairo One Day Tour" }, price: 150, currency: "USD", cover_image: "/Aswan/pexels-girlvsglobe86-300284270-32044045.webp", category_id: 3 },
      { id: 5, title: { en: "Giza Pyramids Day Trip" }, price: 320, currency: "USD", cover_image: "/Aswan/pexels-girlvsglobe86-300284270-32044043.webp", category_id: 3 },
      { id: 6, title: { en: "Alexandria One Day Tour" }, price: 180, currency: "USD", cover_image: "/Aswan/pexels-girlvsglobe86-300284270-30468560.webp", category_id: 4 }
    ]
  };

  // ✅ اختيار الرحلات حسب الـ theme
  const trips = themeName === "dark" ? staticTrips.darkModeTrips : staticTrips.lightModeTrips;

  // ✅ عرض أول 6 رحلات فقط (هنا عندنا 3 فقط)
  const limitedTrips = trips.slice(0, 6);

  const [page, setPage] = useState(0);
  const itemsPerPage = 3;
  const totalPages = Math.ceil(limitedTrips.length / itemsPerPage);

  useEffect(() => {
    if (totalPages > 0) {
      const interval = setInterval(() => {
        setPage((prev) => (prev + 1) % totalPages);
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [totalPages]);

  const currentTrips = limitedTrips.slice(
    page * itemsPerPage,
    page * itemsPerPage + itemsPerPage,
  );

  if (limitedTrips.length === 0)
    return <p className="text-center">لا توجد رحلات متاحة حالياً</p>;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
      className="w-full max-w-3xl mt-2"
    >
      {/* العنوان */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: { opacity: 1, transition: { staggerChildren: 0.2 } },
        }}
        className="hero-title flex flex-wrap gap-4 justify-center font-[Cinzel] mb-5 z-[1]"
      >
        {["B","A","S","T","T","E","T","𓂀","T","R","A","V","E","L"].map((char, i) => (
          <LogoLetter key={i} char={char} theme={theme} />
        ))}
      </motion.div>

      {/* الكروت */}
      <div
        className={`relative z-[1] backdrop-blur-md p-4 border ${theme.logoBorder} ${theme.card} rounded-[40px]`}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 z-[1]"
          >
            {currentTrips.map((trip) => (
              <motion.div
                key={trip.id}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 200 }}
                className={`${theme.card} group relative overflow-hidden shadow-lg hover:shadow-2xl z-[0]`}
              >
                <img
                  src={trip.cover_image || "/fallback.jpg"}
                  alt={trip.title?.[lang] || trip.title?.en || "Trip image"}
                  className="w-full h-80 object-cover transform group-hover:scale-110 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/30 to-transparent"></div>
                <div className="absolute bottom-0 p-6 text-center">
                  <p
                    className={`hero-p font-semibold mt-2`}
                    style={{ color: theme.text }}
                  >
                    From {trip.price} {trip.currency}
                  </p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => router.push(`/trips/${trip.id}`)}
                    className={`w-full rounded-[9px] px-4 py-2 mt-4 font-semibold tracking-wide cursor-pointer transition-all duration-300 shadow-lg ${theme.buttonPrimary}`}
                    style={{ border: `2px solid ${theme.logoBorder}` }}
                  >
                    Book Now
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
