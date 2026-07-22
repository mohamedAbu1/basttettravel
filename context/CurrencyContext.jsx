"use client";
import { createContext, useContext, useState, useEffect } from "react";

const CurrencyContext = createContext();

export function CurrencyProvider({ children }) {
  const [rates, setRates] = useState({ USD: 49.56, EUR: 59.65 });
  const [ids, setIds] = useState({ USD: null, EUR: null });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const res = await fetch("/api/currency");
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data = await res.json();

        const usdRow = data.find((r) => r.currency === "USD");
        const eurRow = data.find((r) => r.currency === "EUR");

        setRates({
          USD: usdRow?.rate || 49.56,
          EUR: eurRow?.rate || 59.65,
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
      if (ids.USD) {
        await fetch("/api/currency", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: ids.USD, rate: rates.USD }),
        });
      }
      if (ids.EUR) {
        await fetch("/api/currency", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ id: ids.EUR, rate: rates.EUR }),
        });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <CurrencyContext.Provider value={{ rates, setRates, loading, saving, error, saveRates }}>
      {children}
    </CurrencyContext.Provider>
  );
}

export const useCurrency = () => useContext(CurrencyContext);
