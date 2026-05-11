"use client";
import React from "react";
import { Select, MenuItem } from "@mui/material";
import { usePurchase } from "@/context/PurchaseContext";

export default function CurrencySelector() {
  const { currency, setCurrency } = usePurchase();

  return (
    <div className="fixed bottom-6 left-6 z-[99]">
      <Select
        value={currency}
        onChange={(e) => setCurrency(e.target.value)}
        size="small"
        IconComponent={() => null}
        sx={{
          padding: "8px 16px",
          borderRadius: "12px",
          fontWeight: "600",
          background: "linear-gradient(to right, #1f2937, #111827)",
          boxShadow: "0 4px 10px rgba(0,0,0,0.5)",
          "& .MuiSelect-select": {
            color: "#f9fafb",
          },
          "& .MuiSelect-icon": {
            color: "#999",
          },
          "& .MuiOutlinedInput-notchedOutline": {
            border: "none",
          },
          "&:hover": {
            background: "linear-gradient(to right, #374151, #1f2937)",
          },
        }}
      >
        <MenuItem value="USD" sx={{ color: "#c9a34a" }}>
          $
        </MenuItem>
        <MenuItem value="EUR" sx={{ color: "#e6e6e6" }}>
          €
        </MenuItem>
      </Select>
    </div>
  );
}
