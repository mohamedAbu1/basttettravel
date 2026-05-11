"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import LogoLetter from "@/components/LogoLetter";
import { useTrip } from "@/context/TripContext";
import { useCitiesCategories } from "@/context/CitiesCategoriesContext";

export default function Packages() {
  const { theme } = useTheme();
  const { trips, fetchTrips, loadingTrips } = useTrip();
  const {
    cities: allCities,
    categories: allCategories,
    loading,
  } = useCitiesCategories();
  // ✅ جلب الرحلات عند التحميل
  useEffect(() => {
    fetchTrips();
  }, []);

  // ✅ قائمة الترجمات الخاصة بـ Nile Cruises
  // قائمة الترجمات الخاصة بـ Nile Cruises
  const nileCruisesCategories = [
    "Nilkreuzfahrten", // de
    "Nile Cruises", // en
    "Cruceros por el Nilo", // es
    "Croisières sur le Nil", // fr
    "Crociere sul Nilo", // it
    "尼罗河游轮", // zh
  ];

  // فلترة الرحلات
  const nileTrips = trips.filter((trip) => {
    const tripCategories =
      trip.trip_categories?.map((cat) => {
        const catObj = allCategories.find((c) => c.id === cat.category_id);
        return catObj?.name?.[lang] || catObj?.name?.en || catObj?.name;
      }) || [];

    return tripCategories.some((catName) =>
      nileCruisesCategories.includes(catName),
    );
  });

  console.log(nileTrips);
  const [page, setPage] = useState(0);
  const itemsPerPage = 3;
  const totalPages = Math.ceil(nileTrips.length / itemsPerPage);

  // ✅ تغيير الصفحة أوتوماتيكياً كل 6 ثواني
  useEffect(() => {
    if (totalPages > 0) {
      const interval = setInterval(() => {
        setPage((prev) => (prev + 1) % totalPages);
      }, 6000);
      return () => clearInterval(interval);
    }
  }, [totalPages]);

  const currentTrips = nileTrips.slice(
    page * itemsPerPage,
    page * itemsPerPage + itemsPerPage,
  );

  if (loadingTrips) {
    return <p className="text-center text-gray-500">Loading trips...</p>;
  }

  if (nileTrips.length === 0) {
    return (
      <p className="text-center text-gray-500">
        لا توجد رحلات Nile Cruises متاحة حالياً
      </p>
    );
  }

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
        style={{ borderRadius: "6px" }}
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2 },
          },
        }}
        className="hero-title flex flex-wrap gap-4 justify-center font-[Cinzel] mb-5 z-[-1]"
      >
        {["M", "O", "N", "T", "U", "𓂀", "T", "R", "A", "V", "E", "L"].map(
          (char, i) => (
            <LogoLetter key={i} char={char} theme={theme} />
          ),
        )}
      </motion.div>

      {/* الكروت مع أنيميشن تبديل */}
      <div className="relative z-[-1]">
        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8 z-[-1]"
          >
            {currentTrips.map((trip) => (
              <motion.div
                key={trip.id}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 200 }}
                className={`${theme.card} group relative overflow-hidden shadow-lg hover:shadow-2xl z-[-1]`}
              >
                <img
                  src={trip.cover_image || "/fallback.jpg"}
                  alt={trip.title?.en || "Trip image"}
                  className="w-full h-80 object-cover transform group-hover:scale-110 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/30 to-transparent"></div>
                <div className="absolute bottom-0 p-6 text-left">
                  <h3
                    style={{ fontWeight: "700" }}
                    className={`hero-title drop-shadow-md`}
                  >
                    {trip.title?.en}
                  </h3>
                  <p className="hero-p font-semibold mt-2">
                    From {trip.price} {trip.currency}
                  </p>
                  <button
                    className="w-full rounded-[9px] px-4 py-2 border-r-4 
             bg-transparent backdrop-blur-md 
             border border-[#C2A878] 
             text-[#C2A878] font-semibold tracking-wide
             hover:bg-[#C2A878]/20 hover:text-white 
             transition-all duration-300 shadow-lg cursor-pointer mt-4"
                    style={{ borderRadius: "8px" }}
                  >
                    Book Now
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
