"use client";
import { FaTimesCircle } from "react-icons/fa";
import { useTheme } from "@/context/ThemeContext";
import { motion } from "framer-motion";

// كائن الترجمات
const translations = {
  en: { title: "Exclusions" },
  de: { title: "Ausschlüsse" },
  it: { title: "Esclusioni" },
  es: { title: "Exclusiones" },
  zh: { title: "不包括" },
  fr: { title: "Exclusions" },
};

export default function TripExclusions({ trip, lang }) {
  const { theme } = useTheme();

  // لو اللغة مش موجودة، نرجع للإنجليزية
  const t = translations[lang] || translations.en;

  // ✅ دالة ترجمة النصوص من JSON أو object
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

  // ✅ تأكد إن exclusions Array حتى لو جاية كـ string أو object
  let exclusions = [];
  try {
    if (Array.isArray(trip.exclusions)) {
      exclusions = trip.exclusions;
    } else if (typeof trip.exclusions === "string") {
      const parsed = JSON.parse(trip.exclusions);
      exclusions = Array.isArray(parsed) ? parsed : [parsed];
    } else if (typeof trip.exclusions === "object" && trip.exclusions !== null) {
      exclusions = [trip.exclusions];
    }
  } catch {
    exclusions = [];
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`w-full lg:w-1/2  p-6 rounded-xl transition ${theme.card} ${theme.shadow} ${theme.text}`}
    >
      {/* العنوان */}
      <motion.h2
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className={`text-2xl font-bold flex items-center gap-2 mb-4 border-b p-2 ${theme.title} ${theme.border}`}
      >
        <FaTimesCircle className={theme.icon} />
        {t.title}
      </motion.h2>

      {/* العناصر */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {exclusions.filter(Boolean).map((exc, idx) => {
          const excId = exc?.id || idx;
          const excText = getLocalizedText(exc?.exclusions_translations);

          return (
            <motion.div
              key={excId}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer ${theme.card}`}
            >
              <motion.div
                whileHover={{ scale: 1.3, rotate: 10 }}
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <FaTimesCircle className={theme.icon} />
              </motion.div>
              <span className={`text-sm md:text-base font-medium ${theme.subText}`}>
                {excText}
              </span>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
}
