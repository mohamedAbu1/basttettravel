"use client";
import { FaShoppingCart, FaMoneyBillWave, FaUsers } from "react-icons/fa";
import { useTheme } from "@/context/ThemeContext";
import { usePurchase } from "@/context/PurchaseContext";
import { useLanguage } from "@/context/LanguageContext";

export default function TripDetails({ trip, groupSize }) {
  const { theme } = useTheme(); // ✅ جلب الثيم
  const { currency } = usePurchase();
  const { lang } = useLanguage(); // ✅ اللغة الحالية

  // ✅ حساب السعر للفرد حسب العملة
  let pricePerPerson = trip.price;
  if (currency === "EUR" && trip.currency === "USD") {
    pricePerPerson = (trip.price * 0.85).toFixed(2);
  } else if (currency === "USD" && trip.currency === "EUR") {
    pricePerPerson = (trip.price * 1.18).toFixed(2);
  }
  console.log(pricePerPerson)
  console.log(groupSize)

  // ✅ السعر النهائي = السعر للفرد × عدد الأشخاص
  const totalPrice = (pricePerPerson * groupSize).toFixed(2);
  console.log(totalPrice)

  // ✅ اختيار العنوان حسب اللغة
  const tripTitle =
    trip.title?.[lang] || trip.translations?.[lang] || trip.title?.en || trip.title;

  return (
    <div className="mb-6">
      {/* العنوان */}
      <h2 className={`text-[16px] mb-4 flex items-center gap-2 ${theme.title}`}>
        <FaShoppingCart className={`w-6 h-6 ${theme.icon}`} />
        {tripTitle}
      </h2>

      {/* السعر للفرد */}
      <p className={`mb-2 font-medium flex items-center gap-2 ${theme.subText}`}>
        <FaMoneyBillWave className={theme.icon} />
        Price per person: {pricePerPerson} {currency || trip.currency}
      </p>

      {/* عدد الأشخاص */}
      <p className={`mb-2 font-medium flex items-center gap-2 ${theme.subText}`}>
        <FaUsers className={theme.icon} />
        Group size: {groupSize}
      </p>

      {/* السعر النهائي */}
      <p className={`mb-2 font-bold flex items-center gap-2 ${theme.title}`}>
        <FaMoneyBillWave className={theme.icon} />
        Total price: {totalPrice} {currency || trip.currency}
      </p>
    </div>
  );
}
