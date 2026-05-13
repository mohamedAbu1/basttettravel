"use client";
import { FaShoppingCart } from "react-icons/fa";
import { useTheme } from "@/context/ThemeContext";
import { useRouter } from "next/navigation"; // ✅ استدعاء الرواتر

export default function PurchaseButton({ trip }) {
  const { themeName } = useTheme();
  const router = useRouter();

  const handleClick = () => {
    // ✅ تحويل المستخدم لصفحة شراء الرحلات مع تمرير الـ trip.id
    router.push(`/purchase/${trip.id}`);
  };

  return (
    <>
      <button
        onClick={handleClick}
        className="fixed bottom-6 left-6 flex-row rounded-[8px] px-6 py-3 bg-transparent backdrop-blur-md 
                   border border-[#C2A878] text-[#C2A878] font-semibold tracking-wide 
                   hover:bg-[#C2A878]/20 hover:text-white transition-all duration-300 
                   shadow-lg cursor-pointer"
      >
        <FaShoppingCart className="w-5 h-5 animate-bounce" />
        Buy Trip
      </button>
    </>
  );
}
