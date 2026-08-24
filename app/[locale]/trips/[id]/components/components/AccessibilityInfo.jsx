"use client";
import { FaWheelchair, FaHandsHelping, FaHeart } from "react-icons/fa";
import { useTheme } from "@/context/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";
import translations from "@/constants/images";
import EgyptianBackground from "@/components/layout/EgyptianBackground";
import { motion } from "framer-motion";

export default function AccessibilityInfo() {
  const { theme } = useTheme();
  const { lang } = useLanguage();

  const t = translations[lang] || translations.en; // fallback للإنجليزية

  return (
    <div
      className={`flex flex-col gap-6 p-8 rounded-2xl transition ${theme.card} ${theme.shadow} ${theme.text}`}
    >
      <EgyptianBackground />

      {/* العنوان والوصف */}
      <div className="space-y-2">
        <h3 className={`text-xl font-bold tracking-wide ${theme.title}`}>
          {t.title}
        </h3>
        <p className={`text-sm leading-relaxed opacity-90 ${theme.subText}`}>
          {t.description}
        </p>
      </div>

      {/* البطاقات الثلاثة */}
      <div className="grid grid-rows-3 gap-4">
        {/* بطاقة الوصول */}
        <div
          className={`flex flex-col items-center gap-2 p-4 rounded-xl hover:scale-105 transition transform ${theme.card} ${theme.shadow}`}
        >
          <motion.div
            animate={{ x: [0, 10, 0] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <FaWheelchair className={`${theme.icon} text-4xl`} />
          </motion.div>
          <span className={`text-xs font-semibold ${theme.subText}`}>
            {t.accessible}
          </span>
        </div>

        {/* بطاقة الدعم */}
        <div
          className={`flex flex-col items-center gap-2 p-4 rounded-xl hover:scale-105 transition transform ${theme.card} ${theme.shadow}`}
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          >
            <FaHandsHelping className={`${theme.icon} text-4xl`} />
          </motion.div>
          <span className={`text-xs font-semibold ${theme.subText}`}>
            {t.support}
          </span>
        </div>

        {/* بطاقة الرعاية */}
        <div
          className={`flex flex-col items-center gap-2 p-4 rounded-xl hover:scale-105 transition transform ${theme.card} ${theme.shadow}`}
        >
          <motion.div
            animate={{ scale: [1, 1.3, 1] }}
            transition={{ repeat: Infinity, duration: 1 }}
          >
            <FaHeart className={`${theme.icon} text-4xl`} />
          </motion.div>
          <span className={`text-xs font-semibold ${theme.subText}`}>
            {t.care}
          </span>
        </div>
      </div>
    </div>
  );
}
