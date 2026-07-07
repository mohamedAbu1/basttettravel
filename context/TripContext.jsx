// file: context/TripContext.js
"use client";

import React, { createContext, useContext, useState, useCallback } from "react";
import { supabase } from "@/lib/supabaseClient";

const TripContext = createContext();

const emptyTrip = {
  title: { en: "", es: "", fr: "", de: "", it: "", zh: "" },
  description: { en: "", es: "", fr: "", de: "", it: "", zh: "" },
  solo_price: 0,
  group_price: 0,
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

  // ✅ رفع ملف إلى Supabase Storage مع Cache-Control
  const uploadFileToSupabase = async (file, folder = "gallery") => {
    const safeName = file.name.replace(/\s+/g, "_");
    const fileName = `${folder}_${Date.now()}_${safeName}`;
    const { error } = await supabase.storage
      .from("trips-bucket")
      .upload(fileName, file, {
        contentType: file.type,
        cacheControl: "31536000", // سنة كاملة
      });

    if (error) throw error;

    const { data } = supabase.storage
      .from("trips-bucket")
      .getPublicUrl(fileName);
    return data.publicUrl;
  };

  // ✅ إرسال البيانات للـ API (إنشاء رحلة جديدة)
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

  // ✅ جلب جميع الرحلات مع Cache-Control
  const fetchTrips = useCallback(async () => {
    setLoadingTrips(true);
    setError(null);
    try {
      const res = await fetch("/api/trips", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache", // تأكد إن الطلب يجلب أحدث بيانات
        },
      });
      const result = await res.json();
      if (result.success) {
        setTrips(result.trips);
        // ✅ تخزين محلي لتقليل الطلبات المتكررة
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
        uploadFileToSupabase,
        error,
      }}
    >
      {children}
    </TripContext.Provider>
  );
}

// Hook للاستخدام داخل أي كومبوننت
export const useTrip = () => useContext(TripContext);
