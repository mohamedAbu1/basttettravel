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
  cover_image: "", // رابط دائم من السيرفر
  cover_file: null, // الملف نفسه قبل الرفع
  cover_name: "",
  gallery_images: [], // روابط الصور بعد الرفع
  gallery_files: [], // الملفات نفسها قبل الرفع
  cities: [],
  categories: [],
  includes: [],
  exclusions: [],
  itinerary: [],
  solo_price: 0,
  group_price: 0,
  discountPercent: 0,
};

export function TripProvider({ children }) {
  const [tripData, setTripData] = useState(emptyTrip);
  const [trips, setTrips] = useState([]);
  const [loadingTrips, setLoadingTrips] = useState(false);
  const [error, setError] = useState(null);

  const updateTripField = (field, value) => {
    setTripData((prev) => ({ ...prev, [field]: value }));
  };

  // ✅ رفع صورة الغلاف
  const uploadCover = async (file) => {
    const formData = new FormData();
    formData.append("cover_image", file);

    const res = await fetch("/api/cover", {
      method: "POST",
      body: formData,
    });

    const result = await res.json();
    if (!result.success) throw new Error(result.error || "Upload cover failed");
    return result.cover_image; // رابط الغلاف بعد الرفع
  };

  const uploadGallery = async () => {
    const formData = new FormData();

    tripData.gallery_files.forEach((file, index) => {
      formData.append("gallery_images", file);

      const names = tripData.gallery_images[index].name;
      formData.append(`name_en_${file.name}`, names.en);
      formData.append(`name_ar_${file.name}`, names.ar);
      formData.append(`name_fr_${file.name}`, names.fr);
      formData.append(`name_de_${file.name}`, names.de);
      formData.append(`name_it_${file.name}`, names.it);
      formData.append(`name_zh_${file.name}`, names.zh);
      formData.append(`name_es_${file.name}`, names.es);
    });

    const res = await fetch("/api/gallery", {
      method: "POST",
      body: formData,
    });

    const result = await res.json();
    if (!result.success)
      throw new Error(result.error || "Upload gallery failed");
    return result.gallery_images; // ✅ رجّع المصفوفة مباشرة
  };

  const saveTrip = async () => {
    try {
      setError(null);

      let coverUrl = tripData.cover_image;
      if (tripData.cover_file) {
        coverUrl = await uploadCover(tripData.cover_file);
      }

      let galleryData = tripData.gallery_images;
      if (tripData.gallery_files?.length > 0) {
        galleryData = await uploadGallery();
      }

      const payload = {
        ...tripData,
        cover_image: coverUrl,
        gallery_images: galleryData,
        exclusions: tripData.exclusions,
      };

      // ✅ تتبع قبل الإرسال
    

      const res = await fetch("/api/trips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();

      if (result.success) {
        setTripData(emptyTrip);
      }

      return result;
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    }
  };

  // ✅ جلب الرحلات
  const fetchTrips = useCallback(async () => {
    setLoadingTrips(true);
    setError(null);
    try {
      const res = await fetch("/api/trips");
      const result = await res.json();
      if (result.success) {
        setTrips(result.trips);
        localStorage.setItem("trips", JSON.stringify(result.trips));
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingTrips(false);
    }
  }, []);

  const getTripById = (id) => {
    return trips.find((trip) => String(trip.id) === String(id));
  };
  return (
    <TripContext.Provider
      value={{
        tripData,
        updateTripField,
        saveTrip,
        setTripData,
        trips,
        fetchTrips,
        loadingTrips,
        getTripById,
        uploadCover,
        setTrips,
        uploadGallery,
        error,
      }}
    >
      {children}
    </TripContext.Provider>
  );
}

export const useTrip = () => useContext(TripContext);
