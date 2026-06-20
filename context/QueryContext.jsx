"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

const encodeData = (obj) => btoa(JSON.stringify(obj));
const decodeData = (encoded) => {
  try {
    return JSON.parse(atob(encoded));
  } catch (err) {
    console.error("❌ Error decoding query:", err);
    return null;
  }
};

const QueryContext = createContext();

export function QueryProvider({ children }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [queryState, setQueryState] = useState({
    city: "all",
    category: "all",
    price: "All",
    popular: false,
  });
const updateValue = (key, value) => {
  console.log(`📝 Updating ${key} to`, value);
  setQueryState((prev) => ({ ...prev, [key]: value }));
};


  const resetFilters = () => {
    console.log("🔄 Resetting filters to default");
    setQueryState({
      city: "all",
      category: "all",
      price: "All",
      popular: false,
    });
  };

  const getEncodedQuery = () => {
    const encoded = encodeData(queryState);
    console.log("📤 Generated encoded query:", encoded);
    return encoded;
  };

  const loadFromQuery = (encoded) => {
    console.log("📥 Raw encoded query from URL:", encoded);
    const decoded = decodeData(encoded);
    console.log("📤 Decoded query object:", decoded);
    if (decoded) {
      setQueryState((prev) => ({
        ...prev,
        ...decoded, // ✅ نقرأ القيم من الكويري
      }));
    } else {
      console.warn("⚠️ Decoded query is null, keeping defaults");
    }
  };

useEffect(() => {
  const current = searchParams.get("data");
  console.log("🔎 Pathname:", pathname);
  console.log("🔎 Raw searchParams:", searchParams.toString());
  console.log("🔎 Current 'data':", current);
  if (current) loadFromQuery(current);
}, [pathname, searchParams]);


  const filterTrips = (trips, allCategories, lang) => {
    console.log("⚙️ Filtering trips with state:", queryState);
    return trips.filter((trip) => {
      if (queryState.city !== "all" && Array.isArray(queryState.city)) {
        const tripCities =
          trip.trip_cities?.map(
            (c) => c.cities?.name?.[lang] || c.city?.name?.[lang] || c.city_name
          ) || [];
        if (!tripCities.some((c) => queryState.city.includes(c))) return false;
      }

      if (queryState.category !== "all" && Array.isArray(queryState.category)) {
        const tripCategories =
          trip.trip_categories?.map((cat) => {
            const catObj = allCategories.find((c) => c.id === cat.category_id);
            return catObj?.name?.[lang] || catObj?.name?.en || catObj?.name;
          }) || [];
        if (!tripCategories.some((c) => queryState.category.includes(c))) return false;
      }

      if (queryState.price === "Economy" && !(trip.price <= 900)) return false;
      if (queryState.price === "Standard" && !(trip.price > 900 && trip.price <= 1500)) return false;
      if (queryState.price === "Luxury" && !(trip.price > 1500)) return false;

      if (queryState.popular === true && !trip.isPopular) return false;

      return true;
    });
  };

  return (
    <QueryContext.Provider
      value={{
        ...queryState,
        updateValue,
        resetFilters,
        getEncodedQuery,
        loadFromQuery,
        filterTrips,
      }}
    >
      {children}
    </QueryContext.Provider>
  );
}

export const useQueryFilters = () => useContext(QueryContext);
