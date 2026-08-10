"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

const AppContext = createContext();

export function AppProvider({ children }) {
  const [country, setCountry] = useState(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const { latitude, longitude } = pos.coords;

        // استدعاء API لتحويل الإحداثيات إلى دولة
        const res = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
        );
        const data = await res.json();
        setCountry(data.countryName);
      });
    }
  }, []);

  return (
    <AppContext.Provider value={{ country }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => useContext(AppContext);
