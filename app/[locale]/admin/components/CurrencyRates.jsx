"use client";
import React from "react";
import { useTheme } from "@/context/ThemeContext";
import { useCurrency } from "@/context/CurrencyContext";

export default function CurrencyRates() {
  const { themeName } = useTheme();
  const { rates, setRates, loading, saving, error, saveRates } = useCurrency();

  if (loading) return <p className="text-center">⏳ Loading currency rates...</p>;
  if (error) return <p className="text-center text-red-500">❌ {error}</p>;

  return (
    <div
      className={`p-6 rounded-xl shadow-lg ${
        themeName === "dark"
          ? "bg-black/40 border border-gold/30 text-white"
          : "bg-white/70 border border-[#c9a34a]/30 text-[#3a2c0a] backdrop-blur-sm"
      }`}
    >
      <h2
        className={`text-3xl font-bold mb-6 text-center ${
          themeName === "dark"
            ? "text-gold"
            : "bg-gradient-to-r from-[#c9a34a] to-[#eab308] bg-clip-text text-transparent"
        }`}
      >
        💱 Currency Rates
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ✅ USD Card */}
        <div
          className={`flex flex-col items-center justify-center p-6 rounded-xl shadow-lg ${
            themeName === "dark"
              ? "bg-gradient-to-r from-gray-800 to-gray-900 border border-gold/30"
              : "bg-gradient-to-r from-blue-100 to-blue-200 border border-blue-300"
          }`}
        >
          <span className="text-5xl">🇺🇸</span>
          <h3 className="text-xl font-semibold mt-2">USD → EGP</h3>
          <input
            type="number"
            value={rates.USD}
            onChange={(e) =>
              setRates((prev) => ({ ...prev, USD: parseFloat(e.target.value) }))
            }
            className="mt-3 border rounded px-3 py-2 w-40 text-center dark:bg-gray-800 dark:text-white"
          />
        </div>

        {/* ✅ EUR Card */}
        <div
          className={`flex flex-col items-center justify-center p-6 rounded-xl shadow-lg ${
            themeName === "dark"
              ? "bg-gradient-to-r from-gray-800 to-gray-900 border border-gold/30"
              : "bg-gradient-to-r from-yellow-100 to-yellow-200 border border-yellow-300"
          }`}
        >
          <span className="text-5xl">🇪🇺</span>
          <h3 className="text-xl font-semibold mt-2">EUR → EGP</h3>
          <input
            type="number"
            value={rates.EUR}
            onChange={(e) =>
              setRates((prev) => ({ ...prev, EUR: parseFloat(e.target.value) }))
            }
            className="mt-3 border rounded px-3 py-2 w-40 text-center dark:bg-gray-800 dark:text-white"
          />
        </div>
      </div>

      {/* ✅ زر الحفظ */}
      <div className="mt-6 flex justify-center">
        <button
          onClick={saveRates}
          disabled={saving}
          className={`px-6 py-2 rounded-lg shadow-md font-semibold transition-transform ${
            themeName === "dark"
              ? "from-[#c9a34a] to-[#eab308] text-white hover:scale-105"
              : "bg-gradient-to-r from-[#c9a34a] to-[#eab308] text-white hover:scale-105"
          }`}
        >
          {saving ? "⏳ Saving..." : "💾 Save Changes"}
        </button>
      </div>
    </div>
  );
}
