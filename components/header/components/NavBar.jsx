"use client";
import Link from "next/link";
import { motion } from "framer-motion";
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
    <motion.nav
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.15 } },
      }}
      className="hidden lg:flex items-center gap-10 font-medium text-lg"
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
            popular: false,
          });
          path = `/trips?data=${encoded}`;
        } else {
          path = `/${item}`;
        }

        const isActive =
          (item === "home" && normalizedPath === "/") ||
          (item !== "home" && normalizedPath.startsWith(`/${item}`));

        return (
          <motion.div
            key={item}
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
          >
            <Link
              href={`/${langPrefix}${path}`}
              className={`relative group px-4 py-2 rounded-lg transition-all duration-300 ${
                isActive
                  ? `bg-gradient-to-r from-[${theme.logoGradientFrom}] to-[${theme.logoGradientTo}] text-white font-bold shadow-md scale-105 border-b-4 border-[${theme.logoBorder}]`
                  : themeName === "dark"
                  ? `${theme.text} hover:${theme.icon}`
                  : scrolled
                  ? `${theme.text} hover:${theme.heading}`
                  : `${theme.subText} hover:${theme.iconHover}`
              }`}
            >
              <span>{t(item)}</span>
              <span
                className={`absolute left-0 -bottom-1 h-[3px] ${theme.stone} rounded-full transition-all duration-300 ${
                  isActive ? "w-full" : "w-0 group-hover:w-full"
                }`}
              />
              {isActive && (
                <span
                  className={`absolute -top-2 -right-2 w-3 h-3 ${theme.iconHover} rounded-full shadow-md animate-pulse`}
                ></span>
              )}
            </Link>
          </motion.div>
        );
      })}
    </motion.nav>
  );
}
