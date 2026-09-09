/* eslint-disable react-hooks/set-state-in-effect */
// context/LanguageContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import i18n from "@/i18n";

const LanguageContext = createContext();
const supportedLanguages = ["en", "es", "fr", "de", "it", "zh"];

export function LanguageProvider({ children }) {
  const pathname = usePathname();
  const [lang, setLang] = useState("en");

  useEffect(() => {
    const routeLanguage = pathname?.split("/").filter(Boolean)[0];
    const nextLanguage = supportedLanguages.includes(routeLanguage)
      ? routeLanguage
      : "en";

    setLang(nextLanguage);
    i18n.changeLanguage(nextLanguage);
    document.documentElement.lang = nextLanguage;
    document.documentElement.dir = "ltr";
  }, [pathname]);

  return (
    <LanguageContext.Provider value={{ lang, setLang, supportedLanguages }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
