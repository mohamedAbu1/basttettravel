"use client";
import { createContext, useContext, useEffect, useState } from "react";
import lightTheme from "@/constants/theme/lightTheme";
import darkTheme from "@/constants/theme/darkTheme";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  const [themeName, setThemeName] = useState("light");
  const [theme, setTheme] = useState(lightTheme);

  // ✅ تحميل الثيم المحفوظ
  useEffect(() => {
    const saved = localStorage.getItem("theme") || "light";
    applyTheme(saved);
  }, []);

  // ✅ دالة لتطبيق الثيم
  const applyTheme = (mode) => {
    setThemeName(mode);
    setTheme(mode === "dark" ? darkTheme : lightTheme);

    // تحديث الـ attribute على <html>
    document.documentElement.setAttribute("data-theme", mode);

    // تحديث الـ class الخاصة بـ Tailwind (لو محتاج dark:)
    if (mode === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    // تحديث بعض الـ CSS variables العامة
    document.documentElement.style.setProperty(
      "--color",
      mode === "dark" ? "#c9a34a" : "#ffffff"
    );
    document.documentElement.style.setProperty(
      "--foreground",
      mode === "dark" ? "#ededed" : "#171717"
    );
    document.documentElement.style.setProperty(
      "--background",
      mode === "dark" ? "#0a0a0a" : "#ffffff"
    );
  };

  // ✅ دالة لتبديل الثيم
  const toggleThemeFun = () => {
    const newTheme = themeName === "dark" ? "light" : "dark";
    localStorage.setItem("theme", newTheme);
    applyTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, themeName, toggleThemeFun }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);