// i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

// استدعاء ملفات JSON
import en from "./locales/en/translation.json";
import es from "./locales/es/translation.json";
import fr from "./locales/fr/translation.json";
import de from "./locales/de/translation.json";
import it from "./locales/it/translation.json";
import zhCN from "./locales/zh/translation.json";

i18n
  .use(LanguageDetector) // يكتشف لغة المتصفح
  .use(initReactI18next) // يربط i18next بـ React
  .init({
    resources: {
      en: {
        header: en.header,
        home: en.home,
        footer: en.footer,
        trips: en.trips,
        about: en.about,
        contact: en.contact,
      },
      es: {
        header: es.header,
        home: es.home,
        footer: es.footer,
        trips: es.trips,
        about: es.about,
        contact: es.contact,
      },
      fr: {
        header: fr.header,
        home: fr.home,
        footer: fr.footer,
        trips: fr.trips,
        about: fr.about,
        contact: fr.contact,
      },
      de: {
        header: de.header,
        home: de.home,
        footer: de.footer,
        trips: de.trips,
        about: de.about,
        contact: de.contact,
      },
      it: {
        header: it.header,
        home: it.home,
        footer: it.footer,
        trips: it.trips,
        about: it.about,
        contact: it.contact,
      },
      "zh-CN": {
        header: zhCN.header,
        home: zhCN.home,
        footer: zhCN.footer,
        trips: zhCN.trips,
        about: zhCN.about,
        contact: zhCN.contact,
      },
    },
    fallbackLng: "en", // اللغة الافتراضية لو اللغة غير موجودة
    interpolation: { escapeValue: false },
    detection: {
      order: [
        "navigator",
        "htmlTag",
        "cookie",
        "localStorage",
        "path",
        "subdomain",
      ],
      caches: ["cookie"],
    },
  });

export default i18n;
