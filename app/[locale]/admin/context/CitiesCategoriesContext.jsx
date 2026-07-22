// file: context/CitiesCategoriesContext.js
"use client"
import React, { createContext, useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

const CitiesCategoriesContext = createContext();

export function CitiesCategoriesProvider({ children }) {
  const [cities, setCities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const { i18n } = useTranslation(); // اللغة الحالية للموقع
  const getLangKey = (lang) => lang.split("-")[0];
  const normalizedLang = getLangKey(i18n.language);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [citiesRes, categoriesRes] = await Promise.all([
          fetch("/api/cities"),
          fetch("/api/categories"),
        ]);

        const citiesData = await citiesRes.json();
        const categoriesData = await categoriesRes.json();

        if (citiesData.success) setCities(citiesData.cities);
        if (categoriesData.success) setCategories(categoriesData.categories);
      } catch (err) {
        console.error("Error fetching cities/categories:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

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
      }}
    >
      {children}
    </CitiesCategoriesContext.Provider>
  );
}

export const useCitiesCategories = () => useContext(CitiesCategoriesContext);
