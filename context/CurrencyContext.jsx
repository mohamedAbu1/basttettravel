"use client";
import { createContext, useContext, useState, useEffect } from "react";

const CurrencyContext = createContext();

export function CurrencyProvider({ children }) {
  const [rates, setRates] = useState({
    USD_EUR: 0.86,
    EUR_USD: 1.18,
    USD_EGP: 51.34,
    EUR_EGP: 58.60,
  });
  const [ids, setIds] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const res = await fetch("/api/currency");
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();

        // هنا ممكن تجيب القيم من الجدول مباشرة
        const usdRow = data.find((r) => r.currency === "USD");
        const eurRow = data.find((r) => r.currency === "EUR");
setRates({
  USD_EUR: eurRow?.urop_rate || 0.86,   // اليورو مقابل الدولار
  EUR_USD: usdRow?.urop_rate ? 1 / usdRow.urop_rate : 1.18, // الدولار مقابل اليورو
  USD_EGP: usdRow?.eg_rate || 51.34,    // الدولار مقابل الجنيه
  EUR_EGP: eurRow?.eg_rate || 58.60,    // اليورو مقابل الجنيه
});

        setIds({
          USD: usdRow?.id || null,
          EUR: eurRow?.id || null,
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRates();
  }, []);

  const saveRates = async () => {
    setSaving(true);
    try {
      for (const currency of Object.keys(ids)) {
        if (ids[currency]) {
          await fetch("/api/currency", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: ids[currency], rate: rates[currency] }),
          });
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // ✅ دالة التحويل بالشروط المحددة
  const convertPrice = (amount, fromCurrency, toCurrency) => {
    let converted = amount;
console.log("USD_EGP:", rates.USD_EGP);
console.log("EUR_EGP:", rates.EUR_EGP);

    // تحويل من دولار إلى يورو
    if (fromCurrency === "USD" && toCurrency === "EUR") {
      converted = amount * (rates.USD_EUR || 0.86);
    }
    // تحويل من يورو إلى دولار
    else if (fromCurrency === "EUR" && toCurrency === "USD") {
      converted = amount * (rates.EUR_USD || 1.18);
    }
    // تحويل من دولار إلى جنيه مصري
    else if (fromCurrency === "USD" && toCurrency === "EGP") {
      converted = amount * (rates.USD_EGP || 51.34);
    }
    // تحويل من يورو إلى جنيه مصري
    else if (fromCurrency === "EUR" && toCurrency === "EGP") {
      converted = amount * (rates.EUR_EGP || 58.60);
    }
    // تحويل من جنيه مصري إلى دولار
    else if (fromCurrency === "EGP" && toCurrency === "USD") {
      converted = amount / (rates.USD_EGP || 51.34);
    }
    // تحويل من جنيه مصري إلى يورو
    else if (fromCurrency === "EGP" && toCurrency === "EUR") {
      converted = amount / (rates.EUR_EGP || 58.60);
    }

    return converted.toFixed(2);
  };

  return (
    <CurrencyContext.Provider
      value={{
        rates,
        setRates,
        loading,
        saving,
        error,
        saveRates,
        convertPrice, // ✅ متاح الآن في كل المكونات
      }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export const useCurrency = () => useContext(CurrencyContext);
