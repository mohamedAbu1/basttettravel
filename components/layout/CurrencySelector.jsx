"use client";
import React, { useEffect } from "react";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import { usePurchase } from "@/context/PurchaseContext";
import { useTheme } from "@/context/ThemeContext";
import { useApp } from "@/context/AppContext";
import { motion } from "framer-motion";

export default function CurrencySelector() {
  const { currency, setCurrency } = usePurchase();
  const { theme } = useTheme();
  const { country } = useApp();

  // 🎨 ألوان مخصصة من الثيم مع fallback
  const usdColor = theme.stone || "#C2A878";
  const eurColor = theme.sandIvory || "#E6E6E6";
  const egpColor = theme.pharaohGold || "#B8860B";

  // 🧩 تحديد العملة الافتراضية بناءً على الدولة
  useEffect(() => {
    if (!country) return;

    const euCountries = [
      "Germany", "France", "Italy", "Spain", "Netherlands", "Belgium",
      "Austria", "Portugal", "Greece", "Finland", "Ireland", "Luxembourg",
      "Slovakia", "Slovenia", "Estonia", "Latvia", "Lithuania", "Cyprus", "Malta"
    ];

    if (country === "Egypt") {
      setCurrency("EGP");
    } else if (euCountries.includes(country)) {
      setCurrency("EUR");
    } else {
      setCurrency("USD");
    }
  }, [country, setCurrency]);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed bottom-6 left-6 z-[99]"
    >
      <Select
        value={currency}
        onChange={(e) => setCurrency(e.target.value)}
        size="small"
        IconComponent={() => null}
        sx={{
          padding: "8px 16px",
          borderRadius: "14px",
          fontWeight: "600",
          background: "rgba(255,255,255,0.15)",
          backdropFilter: "blur(12px)",
          border: `2px solid ${theme.logoBorder}`,
          boxShadow: theme.shadow,
          "& .MuiSelect-select": { color: theme.inputText },
          "& .MuiSelect-icon": { color: theme.iconInactive || "#999" },
          "& .MuiOutlinedInput-notchedOutline": { border: "none" },
          "&:hover": {
            background: theme.inputHoverBg,
            boxShadow: "0 0 12px rgba(194,168,120,0.6)",
          },
        }}
      >
        <MenuItem value="USD" sx={{ color: usdColor, fontWeight: "600" }}>
          $
        </MenuItem>
        <MenuItem value="EUR" sx={{ color: eurColor, fontWeight: "600" }}>
          €
        </MenuItem>
          <MenuItem value="EGP" sx={{ color: egpColor, fontWeight: "600" }}>
          £
        </MenuItem>
      </Select>
    </motion.div>
  );
}
