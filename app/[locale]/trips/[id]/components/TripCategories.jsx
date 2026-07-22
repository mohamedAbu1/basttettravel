"use client";
import { FaTags } from "react-icons/fa";
import { useTheme } from "@/context/ThemeContext";
import { useCitiesCategories } from "@/context/CitiesCategoriesContext";
import { motion } from "framer-motion";

// كائن الترجمات للعناوين
const translations = {
  en: { title: "Categories" },
  de: { title: "Kategorien" },
  it: { title: "Categorie" },
  es: { title: "Categorías" },
  zh: { title: "类别" },
  fr: { title: "Catégories" },
};

export default function TripCategories({ trip, lang }) {
  const { theme } = useTheme();
  const { categories: allCategories } = useCitiesCategories();

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

  // ✅ تأكد إن التصنيفات Array حتى لو جاية كـ string أو object
  let categories = [];
  try {
    if (Array.isArray(trip.categories)) {
      categories = trip.categories;
    } else if (typeof trip.categories === "string") {
      const parsed = JSON.parse(trip.categories);
      categories = Array.isArray(parsed) ? parsed : [parsed];
    } else if (typeof trip.categories === "object" && trip.categories !== null) {
      categories = [trip.categories];
    }
  } catch {
    categories = [];
  }

  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`p-6 rounded-xl transition ${theme.card} ${theme.shadow} ${theme.text}`}
    >
      {/* العنوان */}
      <motion.h2
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className={`text-2xl font-bold flex items-center gap-2 mb-4 border-b p-2 ${theme.title} ${theme.border}`}
      >
        <FaTags className={theme.icon} />
        {t.title}
      </motion.h2>

      {/* التصنيفات */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {categories.filter(Boolean).map((cat, idx) => {
          const catId = cat?.id || cat?.category_id || idx;
          const catObj = allCategories.find((c) => c.id === catId);

          const categoryName =
            getLocalizedText(catObj?.name) ||
            getLocalizedText(cat?.name) ||
            "Unknown";

          return (
            <motion.div
              key={catId}
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.1 }}
              whileHover={{ scale: 1.05, rotate: 1 }}
              className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer ${theme.card}`}
            >
              <FaTags className={theme.icon} />
              <span className={`text-sm md:text-base font-medium ${theme.subText}`}>
                {categoryName}
              </span>
            </motion.div>
          );
        })}
      </div>
    </motion.section>
  );
}
