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
  const language = i18n.language || "en"; // افتراضي إنجليزي لو مش محدد

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

  // فلترة أسماء المدن حسب لغة الموقع الحالي
  const localizedCities = cities.map(city => ({
    ...city,
    name: city.translations?.[language] || city.translations?.["en"] || city.name,
  }));

  // فلترة الكاتجري حسب لغة الموقع الحالي
  const localizedCategories = categories.map(cat => ({
    ...cat,
    name: cat.name?.[language] || cat.name?.["en"] || cat.name,
  }));

  return (
    <CitiesCategoriesContext.Provider
      value={{ cities: localizedCities, categories: localizedCategories, loading }}
    >
      {children}
    </CitiesCategoriesContext.Provider>
  );
}

export const useCitiesCategories = () => useContext(CitiesCategoriesContext);
