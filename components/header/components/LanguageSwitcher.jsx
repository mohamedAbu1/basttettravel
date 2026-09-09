"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";
import { useTheme } from "@/context/ThemeContext";

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
  const { theme, themeName } = useTheme();
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
    <label className="relative" aria-label="Select language">
      <span className="sr-only">Select language</span>
      <select
        value={currentLocale}
        onChange={handleChange}
        disabled={isPending}
        className={`cursor-pointer appearance-none rounded-lg border px-2 py-1.5 pr-7 text-xs font-bold outline-none transition ${theme.border} ${themeName === "dark" ? "bg-[#202020] text-[#E6DCCF]" : "bg-white/70 text-[#1A4D5C]"}`}
      >
        {languages.map((language) => (
          <option key={language.code} value={language.code}>
            {language.label}
          </option>
        ))}
      </select>
      <span className="pointer-events-none absolute right-2 top-1/2 -translate-y-1/2 text-xs opacity-70" aria-hidden="true">⌄</span>
    </label>
  );
}
