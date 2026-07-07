"use client";
import { FaDollarSign, FaEuroSign, FaPoundSign, FaClock } from "react-icons/fa";
import { useTheme } from "@/context/ThemeContext";
import { usePurchase } from "@/context/PurchaseContext"; 
import { motion } from "framer-motion";

const translations = {
  en: { title: "Trip Info", Adult: "Adult", Child:"Child", duration: "Duration" },
  de: { title: "Reiseinformationen", Adult: "Erwachsene", Child:"Kind", duration: "Dauer" },
  it: { title: "Informazioni sul viaggio", Adult: "Adulto", Child:"Bambino", duration: "Durata" },
  es: { title: "Información del viaje", Adult: "Adulto", Child:"Niño", duration: "Duración" },
  zh: { title: "行程信息", Adult: "成人", Child:"孩子", duration: "持续时间" },
  fr: { title: "Informations sur le voyage", Adult: "Adulte", Child:"Enfant", duration: "Durée" },
};

export default function TripInfo({ trip, lang }) {
  const { themeName, theme } = useTheme();
  const { currency } = usePurchase();
  const t = translations[lang] || translations.en;

  // ✅ تحويل الأسعار مع دعم الجنيه المصري
  let displayedSolo = trip.solo_price;
  if (currency === "EUR" && trip.currency === "USD") {
    displayedSolo = (trip.solo_price * 0.85).toFixed(2);
  } else if (currency === "USD" && trip.currency === "EUR") {
    displayedSolo = (trip.solo_price * 1.18).toFixed(2);
  } else if (currency === "EGP" && trip.currency === "USD") {
    displayedSolo = (trip.solo_price * 49.1).toFixed(2);
  } else if (currency === "USD" && trip.currency === "EGP") {
    displayedSolo = (trip.solo_price / 49.1).toFixed(2);
  }

  let displayedGroup = trip.group_price;
  if (currency === "EUR" && trip.currency === "USD") {
    displayedGroup = (trip.group_price * 0.85).toFixed(2);
  } else if (currency === "USD" && trip.currency === "EUR") {
    displayedGroup = (trip.group_price * 1.18).toFixed(2);
  } else if (currency === "EGP" && trip.currency === "USD") {
    displayedGroup = (trip.group_price * 49.1).toFixed(2);
  } else if (currency === "USD" && trip.currency === "EGP") {
    displayedGroup = (trip.group_price / 49.1).toFixed(2);
  }

  const displayedChild = (displayedGroup / 2).toFixed(2);

  const localizedDurationUnit = trip.duration_unit?.[lang] || trip.duration_unit?.en || "";

  return (
    <motion.section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`h-fit p-6 rounded-xl transition ${theme.card}`}
      style={{ boxShadow: theme.shadow }}
    >
      <motion.h2 className={`text-2xl mb-4 border-b pb-2 ${theme.title}`}>
        {t.title}
      </motion.h2>

      <div className="space-y-3">
        <PriceRow label={`${t.Adult} Private`} value={displayedSolo} currency={currency} theme={theme} />
        <PriceRow label={`${t.Adult} In Group`} value={displayedGroup} currency={currency} theme={theme} />
        <PriceRow label={t.Child} value={displayedChild} currency={currency} theme={theme} />
        <PriceRow label={`Children under 6 years old`} value={"Free"} currency={currency} theme={theme} />
        
        <motion.div className="flex items-center gap-2">
          <FaClock className={theme.icon} />
          <span className={theme.text}>{t.duration}: {trip.duration} {localizedDurationUnit}</span>
        </motion.div>
      </div>
    </motion.section>
  );
}

function PriceRow({ label, value, currency, theme }) {
  let Icon;
  let color;

  if (currency === "USD") {
    Icon = FaDollarSign;
    color = theme.usdColor || "#2ecc71"; // أخضر
  } else if (currency === "EUR") {
    Icon = FaEuroSign;
    color = theme.eurColor || "#3498db"; // أزرق
  } else if (currency === "EGP") {
    Icon = FaPoundSign;
    color = theme.egpColor || "#b8860b"; // ذهبي للجنيه المصري
  }

  return (
    <motion.div className="flex items-center gap-2">
      <Icon style={{ color }} />
      <span className={theme.text}>{label}: {value} {currency}</span>
    </motion.div>
  );
}
