// file: context/CitiesCategoriesContext.js
"use client"
import React, { createContext, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { usePathname } from "next/navigation";

const CitiesCategoriesContext = createContext();

export function CitiesCategoriesProvider({
  children,
  initialCities = null,
  initialCategories = null,
}) {
  const hasInitialData = Array.isArray(initialCities) && Array.isArray(initialCategories);
  const pathname = usePathname();
  const isLocalizedHome = /^\/(en|es|fr|de|it|zh)\/?$/.test(pathname || "");
  const [cities, setCities] = useState(hasInitialData ? initialCities : []);
  const [categories, setCategories] = useState(hasInitialData ? initialCategories : []);
  const [loading, setLoading] = useState(!hasInitialData && !isLocalizedHome);
  const [error, setError] = useState(null);

  const { i18n } = useTranslation(); // اللغة الحالية للموقع
  const getLangKey = (lang) => lang.split("-")[0];
  const normalizedLang = getLangKey(i18n.language);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [citiesRes, categoriesRes] = await Promise.all([
          fetch("/api/cities"),
          fetch("/api/categories"),
        ]);

        if (!citiesRes.ok || !categoriesRes.ok) {
          throw new Error("Unable to load travel collections");
        }

        const citiesData = await citiesRes.json();
        const categoriesData = await categoriesRes.json();

        if (!citiesData.success || !categoriesData.success) {
          throw new Error("Travel collections are unavailable");
        }
        setCities(Array.isArray(citiesData.cities) ? citiesData.cities : []);
        setCategories(Array.isArray(categoriesData.categories) ? categoriesData.categories : []);
      } catch (err) {
        console.error("Error fetching cities/categories:", err);
        setError(err.message || "Unable to load travel collections");
      } finally {
        setLoading(false);
      }
    };

    if (!hasInitialData && !isLocalizedHome) fetchData();
  }, [hasInitialData, isLocalizedHome]);

  const retry = () => {
    setLoading(true);
    setError(null);
    Promise.all([fetch("/api/cities"), fetch("/api/categories")])
      .then(async ([citiesRes, categoriesRes]) => {
        if (!citiesRes.ok || !categoriesRes.ok) throw new Error("Unable to load travel collections");
        const [citiesData, categoriesData] = await Promise.all([citiesRes.json(), categoriesRes.json()]);
        if (!citiesData.success || !categoriesData.success) throw new Error("Travel collections are unavailable");
        setCities(Array.isArray(citiesData.cities) ? citiesData.cities : []);
        setCategories(Array.isArray(categoriesData.categories) ? categoriesData.categories : []);
      })
      .catch((err) => setError(err.message || "Unable to load travel collections"))
      .finally(() => setLoading(false));
  };

  // ✅ فلترة المدن وتحويل الحقول من JSON string إلى كائن/مصفوفة
 // ✅ فلترة المدن وتحويل الحقول من JSON string إلى كائن/مصفوفة
const localizedCities = cities.map((city) => {
  let parsedName = {};
  let parsedImages = [];

  try {
    parsedName = JSON.parse(city.name); // ← استخدم name بدل translations
  } catch {
    parsedName = { en: city.name };
  }

  try {
    parsedImages = JSON.parse(city.images);
  } catch {
    parsedImages = ["/fallback.jpg"];
  }

  return {
    ...city,
    name:
      parsedName?.[normalizedLang] ||
      parsedName?.["en"] ||
      Object.values(parsedName)[0] ||
      city.name,
    images: Array.isArray(parsedImages) ? parsedImages : ["/fallback.jpg"],
  };
});


  // ✅ فلترة الكاتجري بنفس الأسلوب
  const localizedCategories = categories.map((cat) => {
    let parsedName = {};
    let parsedImages = [];

    try {
      parsedName = JSON.parse(cat.name);
    } catch {
      parsedName = { en: cat.name };
    }

    try {
      parsedImages = JSON.parse(cat.images);
    } catch {
      parsedImages = ["/fallback.jpg"];
    }

    return {
      ...cat,
      name:
        parsedName?.[normalizedLang] ||
        parsedName?.["en"] ||
        Object.values(parsedName)[0] ||
        cat.name,
      images: Array.isArray(parsedImages) ? parsedImages : ["/fallback.jpg"],
    };
  });

  return (
    <CitiesCategoriesContext.Provider
      value={{
        cities: localizedCities,
        categories: localizedCategories,
        loading,
        error,
        retry,
      }}
    >
      {children}
    </CitiesCategoriesContext.Provider>
  );
}

export const useCitiesCategories = () => useContext(CitiesCategoriesContext);
