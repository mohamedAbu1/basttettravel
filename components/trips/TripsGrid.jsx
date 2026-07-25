"use client";
import { FaStar, FaDollarSign, FaEuroSign, FaPoundSign } from "react-icons/fa";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useAuth } from "@/context/AuthContext";
import { usePurchase } from "@/context/PurchaseContext";
import { useTranslation } from "react-i18next";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { useCurrency } from "@/context/CurrencyContext"; // ✅ استدعاء الكونتكست

export default function TripsGrid({ trips, cardStyle = "vertical" }) {
  const router = useRouter();
  const { userData } = useAuth();
  const { currency, purchases } = usePurchase();
  const { t } = useTranslation("trips");
  const { lang } = useLanguage();
  const { theme } = useTheme();
  const { rates, loading, error } = useCurrency(); // ✅ جلب أسعار العملات

  const getRandomStars = () => Math.floor(Math.random() * 3) + 3;

  // 🟢 دالة التحويل باستخدام CurrencyContext
  const convertPrice = (group_price, tripCurrency) => {
    let converted = group_price;

    if (currency === "EUR" && tripCurrency === "USD") {
      converted = (group_price * (rates.USD_EUR || 0.85)).toFixed(2);
    } else if (currency === "USD" && tripCurrency === "EUR") {
      converted = (group_price * (rates.EUR_USD || 1.18)).toFixed(2);
    } else if (currency === "EGP" && tripCurrency === "USD") {
      converted = (group_price * (rates.USD || 49.1)).toFixed(2);
    }
    return converted;
  };

  if (loading)
    return <p className="text-center">⏳ Loading currency rates...</p>;
  if (error) return <p className="text-center text-red-500">❌ {error}</p>;

  return (
    <div
      className={`flex-1 z-[0] ${
        cardStyle === "vertical"
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          : "grid grid-cols-1 md:grid-cols-2 gap-6"
      } `}
    >
      {trips.map((trip, i) => {
        const avgStars = getRandomStars();
        const displayedPrice = convertPrice(trip.group_price, trip.currency);

        const hasPurchased =
          userData &&
          purchases.some(
            (p) =>
              p.user_id?.toString() === userData.id?.toString() &&
              p.trip_id?.toString() === trip.id?.toString() &&
              p.status !== "Cancelled",
          );
        const hasActivePurchase = purchases.some(
          (p) =>
            p.trip_id === trip.id &&
            p.user_id === userData?.id &&
            p.status !== "Cancelled",
        );
        // 🟢 اختيار الأيقونة حسب العملة
        let CurrencyIcon;
        let currencyColor;
        if (currency === "USD") {
          CurrencyIcon = FaDollarSign;
          currencyColor = theme.usdColor || "#2ecc71";
        } else if (currency === "EUR") {
          CurrencyIcon = FaEuroSign;
          currencyColor = theme.eurColor || "#3498db";
        } else if (currency === "EGP") {
          CurrencyIcon = FaPoundSign;
          currencyColor = theme.egpColor || "#b8860b";
        }

        return (
          <motion.div
            key={trip.id || i}
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            whileHover={{
              scale: 1.05,
              boxShadow: theme.shadow,
            }}
            className={`relative overflow-hidden ${theme.card} ${
              cardStyle === "vertical" ? "h-[400px]" : "h-[300px]"
            }`}
          >
            <Image
              src={trip.cover_image || "/default.jpg"}
              alt={trip.title?.[lang] || trip.title?.en || "Trip image"}
              width={660}
              height={400}
              className="object-cover w-full h-full rounded-lg"
              priority
            />

            <div
              className={`absolute bottom-0 p-4 w-full flex flex-col gap-2 ${theme.overlay} text-white`}
            >
              <h4 className={`text-lg font-bold ${theme.title}`}>
                {trip.title?.[lang] || trip.title?.en || "Untitled"}
              </h4>
              <p className={`${theme.subText} text-sm`}>
                {Array.isArray(trip.cities) && trip.cities.length > 0
                  ? trip.cities
                      .filter(Boolean)
                      .map((c) => {
                        let cityName = "Unknown City";

                        try {
                          // ✅ لو الاسم عبارة عن JSON string → نحوله لكائن
                          const parsed = JSON.parse(c.name);

                          // ✅ نعرض حسب اللغة الحالية أو الإنجليزية أو أول قيمة
                          cityName =
                            parsed?.[lang] ||
                            parsed?.["en"] ||
                            Object.values(parsed)[0] ||
                            "Unknown City";
                        } catch {
                          // ✅ لو الاسم مش JSON → نعرضه مباشرة
                          cityName = c.name || "Unknown City";
                        }

                        return cityName;
                      })
                      .join(", ")
                  : "Unknown City"}
              </p>

              <p className={`${theme.subText} text-sm`}>
                {Array.isArray(trip.categories) &&
                trip.categories.length > 0
                  ? trip.categories
                      .filter(Boolean)
                      .map((cat) => {
                        let categoryName = "Unknown Category";

                        try {
                          // ✅ نحاول تحويل الاسم من JSON string إلى كائن
                          const parsed = JSON.parse(cat.name);

                          // ✅ نعرض حسب اللغة الحالية أو الإنجليزية أو أول قيمة
                          categoryName =
                            parsed?.[lang] ||
                            parsed?.["en"] ||
                            Object.values(parsed)[0] ||
                            "Unknown Category";
                        } catch {
                          // ✅ لو الاسم مش JSON نعرضه مباشرة
                          categoryName =
                            cat.name || "Unknown Category";
                        }

                        return categoryName;
                      })
                      .join(", ")
                  : t("NoCategory")}
              </p>

              <p className="text-md font-semibold flex items-center gap-2">
                <span
                  className={`px-3 py-2 rounded-lg flex items-center gap-2 
              bg-white/10 dark:bg-black/20 
              backdrop-blur-md border border-[#C2A878]/40 
              shadow-sm`}
                >
                  <CurrencyIcon style={{ color: currencyColor }} />
                  {displayedPrice} {currency}
                </span>
              </p>

              <div className="flex items-center gap-2">
                {[...Array(5)].map((_, idx) => (
                  <FaStar
                    key={idx}
                    className={idx < avgStars ? theme.icon : theme.iconInactive}
                  />
                ))}
                <span className={`${theme.subText} text-sm`}>
                  ({t("reviews")})
                </span>
              </div>
              {hasActivePurchase === true ? (
                <button
                  onClick={() => router.push(`/trips/${trip.id}`)}
                  className={`mt-3 px-5 py-2 rounded-lg font-bold transition cursor-pointer 
              bg-white/10 dark:bg-black/20 
              backdrop-blur-md border border-[#C2A878]/40 
              text-[#C2A878] hover:bg-[#C2A878]/20 hover:text-white 
              shadow-md`}
                >
                  {hasPurchased ? t("Tripdetails") : t("btn")}
                </button>
              ) : (
                <button
                  onClick={() => router.push(`/trips/${trip.id}`)}
                  className={`mt-3 px-5 py-2 rounded-lg font-bold transition cursor-pointer 
              bg-white/10 dark:bg-black/20 
              backdrop-blur-md border border-[#C2A878]/40 
              text-[#C2A878] hover:bg-[#C2A878]/20 hover:text-white 
              shadow-md`}
                >
                  {hasPurchased ? t("Tripdetails") : t("btn")}
                </button>
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
