"use client";
import Link from "next/link";
import { useTheme } from "@/context/ThemeContext";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";

// دالة بسيطة لتحويل النص لـ Base64
const encodeQuery = (queryObj) => {
  const str = JSON.stringify(queryObj);
  return Buffer.from(str).toString("base64");
};

export default function NavBar({ scrolled }) {
  const { theme, themeName } = useTheme();
  const pathname = usePathname();
  const { t } = useTranslation("header");

  const navItems = ["home", "trips", "about", "contact"];

  const segments = pathname.split("/").filter(Boolean);
  const langPrefix = segments[0];
  const normalizedPath = "/" + segments.slice(1).join("/");

  return (
    <nav
      className="site-nav hidden lg:flex items-center gap-2 font-medium text-lg"
    >
      {navItems.map((item) => {
        let path;
        if (item === "home") {
          path = "/";
        } else if (item === "trips") {
          const encoded = encodeQuery({
            city: "all",
            category: "all",
            group_price: "All",
            popular: true,
          });
          path = `/trips?data=${encoded}`;
        } else {
          path = `/${item}`;
        }

        const isActive =
          (item === "home" && normalizedPath === "/") ||
          (item === "privacyPolicy" &&
            (normalizedPath.startsWith("/privacyPolicy") ||
              normalizedPath.startsWith("/cancellationPolicy"))) ||
          (item !== "home" &&
            item !== "privacyPolicy" &&
            normalizedPath.startsWith(`/${item}`));

        return (
          <div
            key={item}
          >
            <Link
              href={`/${langPrefix}${path}`}
              className={`site-nav-link relative group px-4 py-2 rounded-lg transition-all duration-300 ${
                isActive
                  ? "site-nav-link-active"
                  : themeName === "dark"
                    ? "site-nav-link-dark"
                    : scrolled
                      ? "site-nav-link-scrolled"
                      : "site-nav-link-top"
              }`}
            >
              <span>{t(item)}</span>
              <span
                className={`absolute left-1/2 -translate-x-1/2 -bottom-0.5 h-0.5 bg-[var(--ui-gold)] rounded-full transition-all duration-300 ${isActive ? "w-3/5" : "w-0 group-hover:w-3/5"}`}
              />
            </Link>
          </div>
        );
      })}
    </nav>
  );
}
