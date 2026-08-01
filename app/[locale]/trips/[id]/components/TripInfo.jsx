"use client";
import { FaDollarSign, FaEuroSign, FaPoundSign, FaClock } from "react-icons/fa";
import { useTheme } from "@/context/ThemeContext";
import { usePurchase } from "@/context/PurchaseContext"; 
import { motion } from "framer-motion";
import { useCurrency } from "@/context/CurrencyContext"; // ✅ استدعاء الكونتكست

const translations = {
  en: {
    title: "Trip Info",
    AdultPrivate: "Adult Private",
    AdultGroup: "Adult In Group",
    Child: "Child",
    ChildrenUnder6: "Children under 6 years old",
    Free: "Free",
    duration: "Duration"
  },
  de: {
    title: "Reiseinformationen",
    AdultPrivate: "Erwachsene Privat",
    AdultGroup: "Erwachsene in Gruppe",
    Child: "Kind",
    ChildrenUnder6: "Kinder unter 6 Jahren",
    Free: "Kostenlos",
    duration: "Dauer"
  },
  it: {
    title: "Informazioni sul viaggio",
    AdultPrivate: "Adulto Privato",
    AdultGroup: "Adulto in gruppo",
    Child: "Bambino",
    ChildrenUnder6: "Bambini sotto i 6 anni",
    Free: "Gratis",
    duration: "Durata"
  },
  es: {
    title: "Información del viaje",
    AdultPrivate: "Adulto Privado",
    AdultGroup: "Adulto en grupo",
    Child: "Niño",
    ChildrenUnder6: "Niños menores de 6 años",
    Free: "Gratis",
    duration: "Duración"
  },
  zh: {
    title: "行程信息",
    AdultPrivate: "成人私人",
    AdultGroup: "成人团体",
    Child: "孩子",
    ChildrenUnder6: "6岁以下儿童",
    Free: "免费",
    duration: "持续时间"
  },
  fr: {
    title: "Informations sur le voyage",
    AdultPrivate: "Adulte Privé",
    AdultGroup: "Adulte en groupe",
    Child: "Enfant",
    ChildrenUnder6: "Enfants de moins de 6 ans",
    Free: "Gratuit",
    duration: "Durée"
  }
};

export default function TripInfo({ trip, lang }) {
  const { themeName, theme } = useTheme();
  const { currency } = usePurchase();
  const { rates, loading, error } = useCurrency(); // ✅ جلب أسعار العملات
  const t = translations[lang] || translations.en;

  if (loading) return <p className="text-center">⏳ Loading currency rates...</p>;
  if (error) return <p className="text-center text-red-500">❌ {error}</p>;

  // ✅ تحويل الأسعار باستخدام CurrencyContext
  let displayedSolo = trip.solo_price;
  if (currency === "EUR" && trip.currency === "USD") {
    displayedSolo = (trip.solo_price * (rates.USD_EUR || 0.85)).toFixed(2);
  } else if (currency === "USD" && trip.currency === "EUR") {
    displayedSolo = (trip.solo_price * (rates.EUR_USD || 1.18)).toFixed(2);
  } else if (currency === "EGP" && trip.currency === "USD") {
    displayedSolo = (trip.solo_price * (rates.USD || 49.1)).toFixed(2);
  } else if (currency === "USD" && trip.currency === "EGP") {
    displayedSolo = (trip.solo_price / (rates.USD || 49.1)).toFixed(2);
  }

  let displayedGroup = trip.group_price;
  if (currency === "EUR" && trip.currency === "USD") {
    displayedGroup = (trip.group_price * (rates.USD_EUR || 0.85)).toFixed(2);
  } else if (currency === "USD" && trip.currency === "EUR") {
    displayedGroup = (trip.group_price * (rates.EUR_USD || 1.18)).toFixed(2);
  } else if (currency === "EGP" && trip.currency === "USD") {
    displayedGroup = (trip.group_price * (rates.USD || 49.1)).toFixed(2);
  } else if (currency === "USD" && trip.currency === "EGP") {
    displayedGroup = (trip.group_price / (rates.USD || 49.1)).toFixed(2);
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
        <PriceRow label={`${t.AdultPrivate}`} value={displayedSolo} currency={currency} theme={theme} />
        <PriceRow label={`${t.AdultGroup}`} value={displayedGroup} currency={currency} theme={theme} />
        <PriceRow label={t.Child} value={displayedChild} currency={currency} theme={theme} />
        <PriceRow label={t.ChildrenUnder6} value={t.Free} currency={currency} theme={theme} />
        
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
    color = theme.usdColor || "#2ecc71";
  } else if (currency === "EUR") {
    Icon = FaEuroSign;
    color = theme.eurColor || "#3498db";
  } else if (currency === "EGP") {
    Icon = FaPoundSign;
    color = theme.egpColor || "#b8860b";
  }

  return (
    <motion.div className="flex items-center gap-2">
      <Icon style={{ color }} />
      <span className={theme.text}>{label}: {value} {currency}</span>
    </motion.div>
  );
}
