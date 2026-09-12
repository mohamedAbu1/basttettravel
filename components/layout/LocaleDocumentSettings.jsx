"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const rtlLocales = new Set(["ar"]);

export default function LocaleDocumentSettings() {
  const pathname = usePathname();

  useEffect(() => {
    const locale = pathname?.split("/").filter(Boolean)[0] || "en";
    document.documentElement.lang = locale;
    document.documentElement.dir = rtlLocales.has(locale) ? "rtl" : "ltr";
  }, [pathname]);

  return null;
}
