"use client";
import React from "react";
import { useTheme } from "@/context/ThemeContext";

const symbols = [
  "𓂀","𓋹","𓆣","𓇼","𓇯","𓏏","𓎛","𓊽",
  "𓃾","𓅓","𓈇","𓉐","𓊹","𓌙","𓍿","𓎟",
];

export default function EgyptianBackground() {
  const { theme, themeName } = useTheme();
  const items = symbols.map((symbol, index) => ({
    id: index,
    symbol,
    top: 8 + ((index * 17) % 84),
    left: 4 + ((index * 29) % 92),
    size: 20 + (index % 5) * 7,
    rotate: (index % 4) * 9 - 12,
  }));

  return (
    <div className={`egyptian-background absolute inset-0 pointer-events-none overflow-hidden ${themeName === "light" ? "is-light" : ""}`} aria-hidden="true">
      {items.map((item) => (
        <span
          key={item.id}
          className="egyptian-background-symbol"
          style={{
            position: "absolute",
            top: `${item.top}%`,
            left: `${item.left}%`,
            fontSize: `${item.size}px`,
            transform: `rotate(${item.rotate}deg)`,
            color: theme.icon,
          }}
        >
          {item.symbol}
        </span>
      ))}
    </div>
  );
}
