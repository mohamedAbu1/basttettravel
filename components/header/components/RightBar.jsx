"use client";
import { Avatar, Button, Typography, Select, MenuItem } from "@mui/material";
import { motion } from "framer-motion";
import ThemeToggle from "../../ThemeToggle";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "react-i18next";
import { usePurchase } from "@/context/PurchaseContext";
import { usePathname } from "next/navigation";
import Image from "next/image";

export default function RightBar({ scrolled }) {
  const { isLoggedIn, logout, user, handleOpen } = useAuth();
  const { themeName } = useTheme();
  const { t } = useTranslation("header");

  const { currency, setCurrency } = usePurchase();
  const pathname = usePathname();
  // ✅ حالة العملة
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
        <div className="hidden lg:flex items-center gap-2">
          {" "}
          <img
            alt={`${user?.user_metadata?.name}` || "User Avatar"}
            src={`${user?.user_metadata?.avatar}` || "/default-avatar.png"}
            width={40}
            height={40}
            style={{ border: "2px solid #c9a34a", borderRadius: "50%" }}
          />{" "}
          <Typography
            variant="subtitle1"
            sx={{
              textTransform: "capitalize",
              fontWeight: "600",
              color:
                themeName === "dark"
                  ? "#fff"
                  : !isHome
                    ? "#333"
                    : scrolled
                      ? "#333"
                      : "#fff",
            }}
          >
            {" "}
            {user?.user_metadata?.name}{" "}
          </Typography>{" "}
        </div>
      )}
    </div>
  );
}
