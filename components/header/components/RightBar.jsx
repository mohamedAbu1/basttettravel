"use client";
import { Typography } from "@mui/material";
import { motion } from "framer-motion";
import ThemeToggle from "../../ThemeToggle";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "react-i18next";
import { usePurchase } from "@/context/PurchaseContext";
import { usePathname } from "next/navigation";

export default function RightBar({ scrolled }) {
  const { isLoggedIn, user } = useAuth();
  const { theme, themeName } = useTheme();
  const { t } = useTranslation("header");

  const { currency, setCurrency } = usePurchase();
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  const isHome =
    segments.length === 0 ||
    (segments.length === 1 &&
      ["en", "fr", "de", "it", "es", "pt"].includes(segments[0]));

  return (
    <div className="flex items-center gap-4">
      {/* Theme Toggle */}
      <ThemeToggle scrolled={scrolled} />

      {/* عرض المستخدم */}
      {isLoggedIn && user && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="hidden lg:flex items-center gap-3 cursor-pointer group"
        >
          <div
            className="relative w-12 h-12 rounded-full p-[2px] bg-gradient-to-r"
            style={{
              backgroundImage: `linear-gradient(to right, ${theme.logoGradientFrom}, ${theme.logoGradientTo})`,
            }}
          >
            <img
            alt={user?.user_metadata?.name || "User Avatar"}
            src={
              user?.user_metadata?.picture || // صورة جوجل
              user?.user_metadata?.avatar_url || // صورة من Supabase
              user?.user_metadata?.avatar || // صورة من التسجيل العادي
              "/default-avatar.png" // صورة افتراضية
            }
            width={40}
            height={40}
            style={{ border: "2px solid #d4af37", borderRadius: "50%" }}
          />
          </div>
          <Typography
            variant="subtitle1"
            sx={{
              textTransform: "capitalize",
              fontWeight: "600",
              color:
                themeName === "dark"
                  ? theme.textColor || "#fff"
                  : !isHome
                  ? theme.textColor || "#333"
                  : scrolled
                  ? theme.textColor || "#333"
                  : theme.subTextColor || "#666",
              transition: "color 0.3s ease",
            }}
            className="group-hover:text-[var(--color-hover)]"
          >
            {user?.user_metadata?.name}
          </Typography>
        </motion.div>
      )}
    </div>
  );
}
