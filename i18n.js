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
import enUi from "./locales/en/ui.json";
import esUi from "./locales/es/ui.json";
import frUi from "./locales/fr/ui.json";
import deUi from "./locales/de/ui.json";
import itUi from "./locales/it/ui.json";
import zhUi from "./locales/zh/ui.json";
import uiExtra from "./locales/ui-extra";

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
resources.en.ui = enUi;
Object.assign(resources.en.ui, uiExtra.en);
resources.es.common = esCommon;
resources.es.ui = esUi;
Object.assign(resources.es.ui, uiExtra.es);
resources.fr.common = frCommon;
resources.fr.ui = frUi;
Object.assign(resources.fr.ui, uiExtra.fr);
resources.de.common = deCommon;
resources.de.ui = deUi;
Object.assign(resources.de.ui, uiExtra.de);
resources.it.common = itCommon;
resources.it.ui = itUi;
Object.assign(resources.it.ui, uiExtra.it);
resources.zh.common = zhCommon;
resources.zh.ui = zhUi;
Object.assign(resources.zh.ui, uiExtra.zh);
resources["zh-CN"].common = zhCommon;
resources["zh-CN"].ui = zhUi;

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
      "ui",
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
