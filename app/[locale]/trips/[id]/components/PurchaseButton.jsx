"use client";
import { useState } from "react";
import { FaShoppingCart } from "react-icons/fa";
import PurchaseModal from "./components/PurchaseModal";
import { useTheme } from "@/context/ThemeContext";

export default function PurchaseButton({ trip }) {
  const [open, setOpen] = useState(false);
  const { themeName } = useTheme();

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 left-6 flex-row rounded-[8px] px-6 py-3 bg-transparent backdrop-blur-md 
                   border border-[#C2A878] text-[#C2A878] font-semibold tracking-wide 
                   hover:bg-[#C2A878]/20 hover:text-white transition-all duration-300 
                   shadow-lg cursor-pointer"
      >
        <FaShoppingCart className="w-5 h-5 animate-bounce" />
        Buy Trip
      </button>

      {open && <PurchaseModal trip={trip} onClose={() => setOpen(false)} />}
    </>
  );
}
