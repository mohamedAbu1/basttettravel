// file: context/TripContext.js
"use client";

import React, { createContext, useContext, useState, useCallback } from "react";

const TripContext = createContext();

const emptyTrip = {
  title: { en: "", es: "", fr: "", de: "", it: "", zh: "" },
  description: { en: "", es: "", fr: "", de: "", it: "", zh: "" },
  currency: "USD",
  duration: 0,
  duration_unit: "days",
  priceLevel: "",
  cover_image: "",
  gallery_images: [],
  cities: [],
  categories: [],
  includes: [],
  itinerary: [],
  solo_price: 0,
  group_price: 0,
};

export function TripProvider({ children }) {
  const [tripData, setTripData] = useState(emptyTrip);
  const [trips, setTrips] = useState([]);
  const [loadingTrips, setLoadingTrips] = useState(false);
  const [error, setError] = useState(null);

  // ✅ تحديث أي جزء من بيانات الرحلة
  const updateTripField = (field, value) => {
    setTripData((prev) => ({ ...prev, [field]: value }));
  };

  // ✅ إضافة Include جديد
  const addInclude = (include) => {
    setTripData((prev) => ({
      ...prev,
      includes: [...prev.includes, include],
    }));
  };

  // ✅ إضافة يوم جديد في الـ Itinerary
  const addDay = (day) => {
    setTripData((prev) => ({
      ...prev,
      itinerary: [...prev.itinerary, day],
    }));
  };

  // ✅ رفع ملف إلى السيرفر (بدل Supabase)
  const uploadFile = async (file, folder = "gallery") => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const result = await res.json();
    if (!result.success) throw new Error(result.error || "Upload failed");
    return result.url; // رابط الصورة بعد الرفع
  };

  // ✅ إرسال البيانات للـ API (إنشاء رحلة جديدة في MySQL)
  const saveTrip = async () => {
    try {
      setError(null);
      const res = await fetch("/api/trips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tripData),
      });
      return res.json();
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  // ✅ جلب جميع الرحلات من MySQL
  const fetchTrips = useCallback(async () => {
    setLoadingTrips(true);
    setError(null);
    try {
      const res = await fetch("/api/trips", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        },
      });
      const result = await res.json();
      if (result.success) {
        setTrips(result.trips);
        localStorage.setItem("trips", JSON.stringify(result.trips));
      }
    } catch (err) {
      console.error("Error fetching trips:", err);
      setError(err.message);
    } finally {
      setLoadingTrips(false);
    }
  }, []);

  // ✅ جلب رحلة من الذاكرة المحلية أولاً
  const getTripById = (id) => {
    return trips.find((trip) => String(trip.id) === String(id));
  };

  return (
    <TripContext.Provider
      value={{
        tripData,
        updateTripField,
        addInclude,
        addDay,
        saveTrip,
        setTripData,
        trips,
        fetchTrips,
        loadingTrips,
        getTripById,
        uploadFile,
        error,
      }}
    >
      {children}
    </TripContext.Provider>
  );
}

// Hook للاستخدام داخل أي كومبوننت
export const useTrip = () => useContext(TripContext);
