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
  cities: [], // ✅ IDs للمدن
  categories: [], // ✅ IDs للفئات
  includes: [],
  itinerary: [], // كل يوم فيه activities
};

export function TripProvider({ children }) {
  const [tripData, setTripData] = useState(emptyTrip);
  const [trips, setTrips] = useState([]);
  const [loadingTrips, setLoadingTrips] = useState(false);
  const [error, setError] = useState(null);

  // ✅ تحديث أي حقل
  const updateTripField = (field, value) => {
    setTripData((prev) => ({ ...prev, [field]: value }));
  };

  // ✅ إضافة Include
  const addInclude = (include) => {
    setTripData((prev) => ({
      ...prev,
      includes: [...prev.includes, include],
    }));
  };

  // ✅ إضافة يوم جديد
  const addDay = (day) => {
    setTripData((prev) => ({
      ...prev,
      itinerary: [...prev.itinerary, { ...day, activities: [] }],
    }));
  };

  // ✅ إضافة نشاط ليوم معين
  const addActivity = (dayIndex, activity) => {
    setTripData((prev) => {
      const updatedItinerary = [...prev.itinerary];
      if (!updatedItinerary[dayIndex].activities) {
        updatedItinerary[dayIndex].activities = [];
      }
      updatedItinerary[dayIndex].activities.push({
        time: activity.time || "",
        activity_translations: activity.activity_translations || {
          en: "",
          es: "",
          fr: "",
          de: "",
          it: "",
          zh: "",
        },
      });
      return { ...prev, itinerary: updatedItinerary };
    });
  };

  // ✅ تحديث نشاط معين
  const updateActivity = (dayIndex, activityIndex, updatedActivity) => {
    setTripData((prev) => {
      const updatedItinerary = [...prev.itinerary];
      updatedItinerary[dayIndex].activities[activityIndex] = {
        ...updatedItinerary[dayIndex].activities[activityIndex],
        ...updatedActivity,
      };
      return { ...prev, itinerary: updatedItinerary };
    });
  };

  // ✅ إضافة مدينة
  const addCity = (cityId) => {
    setTripData((prev) => ({
      ...prev,
      cities: [...prev.cities, cityId],
    }));
  };

  // ✅ إضافة فئة
  const addCategory = (categoryId) => {
    setTripData((prev) => ({
      ...prev,
      categories: [...prev.categories, categoryId],
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

  // ✅ حفظ الرحلة
  const saveTrip = async () => {
    try {
      setError(null);

      // رفع صورة الغلاف
      let coverImageUrl = "";
      if (tripData.cover_file) {
        coverImageUrl = await uploadFileToSupabase(
          tripData.cover_file,
          "cover",
        );
      }

      // رفع صور المعرض
      const galleryUrls = await Promise.all(
        tripData.gallery_images.map(async (img, i) => {
          const url = await uploadFileToSupabase(img.file, `gallery_${i}`);
          return { url, name: img.name };
        }),
      );

      const payload = {
        ...tripData,
        cover_image: coverImageUrl,
        gallery_images: galleryUrls,
      };

      const res = await fetch("/api/trips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (data.success) {
        setTripData(emptyTrip); // ✅ Reset بعد الحفظ
      }

      return data;
    } catch (err) {
      console.error("Error saving trip:", err);
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  // ✅ جلب الرحلات (useCallback لمنع loop)
  const fetchTrips = useCallback(async () => {
    setLoadingTrips(true);
    setError(null);
    try {
      const res = await fetch("/api/trips", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      const result = await res.json();
      if (result.success) {
        setTrips(result.trips);
      } else {
        setError("Failed to fetch trips");
      }
    } catch (err) {
      console.error("Error fetching trips:", err);
      setError(err.message);
    } finally {
      setLoadingTrips(false);
    }
  }, []);

  return (
    <TripContext.Provider
      value={{
        tripData,
        updateTripField,
        addInclude,
        addDay,
        addActivity,
        updateActivity,
        addCity,
        addCategory,
        saveTrip,
        setTripData,
        trips,
        fetchTrips,
        loadingTrips,
        error, // ✅ متاح الآن
      }}
    >
      {children}
    </TripContext.Provider>
  );
}

export const useTrip = () => useContext(TripContext);
