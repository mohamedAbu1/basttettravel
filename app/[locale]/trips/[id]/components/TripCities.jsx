"use client";
import { FaMapMarkerAlt } from "react-icons/fa";
import { useTheme } from "@/context/ThemeContext";
import { useCitiesCategories } from "@/context/CitiesCategoriesContext";
import { motion } from "framer-motion";

const translations = {
  en: { title: "Cities" },
  de: { title: "Städte" },
  it: { title: "Città" },
  es: { title: "Ciudades" },
  zh: { title: "城市" },
  fr: { title: "Villes" },
};

export default function TripCities({ trip, lang }) {
  const { theme } = useTheme(); // ✅ جلب الثيم من الكونتكست
  const { cities: allCities } = useCitiesCategories();
  const t = translations[lang] || translations.en;

  const getLocalizedText = (obj) => {
    if (!obj) return "Unknown";
    if (typeof obj === "string") {
      try {
        const parsed = JSON.parse(obj);
        return parsed?.[lang] || parsed?.en || Object.values(parsed)[0];
      } catch {
        return obj;
      }
    }
    if (typeof obj === "object") {
      return obj?.[lang] || obj?.en || Object.values(obj)[0];
    }
    return "Unknown";
  };

  let cities = [];
  try {
    if (Array.isArray(trip.cities)) {
      cities = trip.cities;
    } else if (typeof trip.cities === "string") {
      const parsed = JSON.parse(trip.cities);
      cities = Array.isArray(parsed) ? parsed : [parsed];
    } else if (typeof trip.cities === "object" && trip.cities !== null) {
      cities = [trip.cities];
    }
  } catch {
    cities = [];
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`p-6 rounded-xl shadow-lg transition ${theme.card} ${theme.text}`}
      style={{ boxShadow: theme.shadow }}
    >
      {/* العنوان */}
      <motion.h2
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className={`text-2xl font-bold flex items-center gap-2 mb-4 border-b p-2 ${theme.border}`}
      >
        <FaMapMarkerAlt className={theme.icon} />
        {t.title}
      </motion.h2>

      {/* المدن */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {cities.filter(Boolean).map((c, idx) => {
          const cityId = c?.id || c?.city_id || c?.cityId || idx;
          const cityName =
            getLocalizedText(c?.name) ||
            getLocalizedText(allCities.find((city) => city.id === cityId)?.name);

          return (
            <motion.div
              key={cityId}
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              whileHover={{ scale: 1.05, rotate: 1 }}
              className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer ${theme.card} ${theme.hover}`}
            >
              <FaMapMarkerAlt className={theme.icon} />
              <span className="text-sm md:text-base font-medium">
                {cityName}
              </span>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
}
