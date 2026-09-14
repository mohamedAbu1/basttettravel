"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { useTheme } from "@/context/ThemeContext";
import { FaGlobe, FaChevronDown } from "react-icons/fa";

const languages = [
  { code: "en", label: "EN" },
  { code: "es", label: "ES" },
  { code: "fr", label: "FR" },
  { code: "de", label: "DE" },
  { code: "it", label: "IT" },
  { code: "zh", label: "中文" },
];

/** Changes only the locale prefix and preserves the current page/query state. */
export default function LanguageSwitcher() {
  const pathname = usePathname() || "/en";
  const searchParams = useSearchParams();
  const router = useRouter();
  const { themeName } = useTheme();
  const [isPending, startTransition] = useTransition();
  const segments = pathname.split("/").filter(Boolean);
  const currentLocale = languages.some(({ code }) => code === segments[0])
    ? segments[0]
    : "en";

  const handleChange = (event) => {
    const nextLocale = event.target.value;
    const nextPath = segments[0] && languages.some(({ code }) => code === segments[0])
      ? `/${nextLocale}/${segments.slice(1).join("/")}`
      : `/${nextLocale}${pathname}`;
    const query = searchParams.toString();
    const destination = query ? `${nextPath}?${query}` : nextPath;

    startTransition(() => router.replace(destination));
  };

  return (
    <label className="language-switcher" aria-label="Select language">
      <span className="sr-only">Select language</span>
      <FaGlobe className="language-switcher-icon" aria-hidden="true" />
      <select
        value={currentLocale}
        onChange={handleChange}
        disabled={isPending}
        className={`language-select ${themeName === "dark" ? "is-dark" : "is-light"}`}
      >
        {languages.map((language) => (
          <option key={language.code} value={language.code}>
            {language.label}
          </option>
        ))}
      </select>
      <FaChevronDown className="language-switcher-chevron" aria-hidden="true" />
    </label>
  );
}
