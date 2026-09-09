// i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

import en from "./locales/en/translation.json";
import es from "./locales/es/translation.json";
import fr from "./locales/fr/translation.json";
import de from "./locales/de/translation.json";
import it from "./locales/it/translation.json";
import zhCN from "./locales/zh/translation.json";
import enCommon from "./locales/en/common.json";
import esCommon from "./locales/es/common.json";
import frCommon from "./locales/fr/common.json";
import deCommon from "./locales/de/common.json";
import itCommon from "./locales/it/common.json";
import zhCommon from "./locales/zh/common.json";

const resources = {
  en,
  es,
  fr,
  de,
  it,
  zh: zhCN,
  // Keep the regional alias for browsers that report zh-CN.
  "zh-CN": zhCN,
};

resources.en.common = enCommon;
resources.es.common = esCommon;
resources.fr.common = frCommon;
resources.de.common = deCommon;
resources.it.common = itCommon;
resources.zh.common = zhCommon;
resources["zh-CN"].common = zhCommon;

i18n
  .use(LanguageDetector) // يكتشف لغة المتصفح
  .use(initReactI18next) // يربط i18next بـ React
  .init({
    resources,
    ns: [
      "header",
      "home",
      "footer",
      "trips",
      "about",
      "contact",
      "tripsId",
      "privacyPolicy",
      "cancellationPolicy",
      "common",
    ],
    defaultNS: "home",
    fallbackLng: "en", // اللغة الافتراضية لو اللغة غير موجودة
    interpolation: { escapeValue: false },
    detection: {
      order: ["path", "htmlTag", "cookie", "localStorage", "navigator"],
      caches: ["cookie", "localStorage"],
    },
  });

export default i18n;
