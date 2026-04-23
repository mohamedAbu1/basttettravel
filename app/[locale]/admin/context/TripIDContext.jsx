"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const TripIDContext = createContext();

const emptyTrip = {
  title: { en: "", ar: "" },
  description: { en: "", ar: "" },
  price: 0,
  currency: "USD",
  duration: 0,
  duration_unit: "days",
  priceLevel: "",
  cover_image: "",
  gallery_images: [],
  cities: [],       // ✅ IDs للمدن
  categories: [],   // ✅ IDs للفئات
  includes: [],
  itinerary: [],
};

export function TripIDProvider({ children }) {
  const [tripData, setTripData] = useState(null);
  const [tripsList, setTripsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ جلب جميع الرحلات
  const fetchAllTrips = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get("/api/trips");
      const data = res.data;

      if (res.status === 200 && data.success) {
        const titles = (data.trips || []).map((trip) => ({
          id: trip.id,
          title: trip.title,
        }));
        setTripsList(titles);
      } else {
        setError(data.error || "Failed to fetch trips");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ جلب رحلة واحدة بالـ ID مع تحويل المدن والفئات إلى IDs
  const fetchTripById = async (id) => {
    if (!id) {
      setError("No trip ID provided");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const res = await axios.get(`/api/trips/${id}`);
      const data = res.data;

      if (res.status === 200 && data.success) {
        const trip = data.trip;

        // ✅ تحويل المدن والفئات إلى IDs فقط
        const categoriesIds = (trip.trip_categories || []).map(
          (c) => c.category_id
        );
        const citiesIds = (trip.trip_cities || []).map((c) => c.city_id);

        setTripData({
          ...trip,
          categories: categoriesIds,
          cities: citiesIds,
        });
      } else {
        setError(data.error || "Failed to fetch trip");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ تحديث حقل معين
  const updateTripField = (field, value) => {
    setTripData((prev) => ({ ...prev, [field]: value }));
  };

  // ✅ حفظ التعديلات
  const saveTrip = async () => {
    if (!tripData?.id) {
      return { success: false, error: "No trip ID" };
    }

    const tripPayload = {
      title: tripData.title,
      description: tripData.description,
      price: tripData.price,
      duration: tripData.duration,
      priceLevel: tripData.priceLevel,
      cover_image: tripData.cover_image,
      gallery_images: tripData.gallery_images,
      includes: tripData.includes || [],
      itinerary: tripData.itinerary || [],
      cities: tripData.cities || [],         // ✅ IDs مباشرة
      categories: tripData.categories || [], // ✅ IDs مباشرة
    };

    try {
      const res = await axios.put(`/api/trips/${tripData.id}`, tripPayload);
      const data = res.data;

      if (data.success) {
        // ✅ بعد الحفظ، فرّغ جميع الحقول
        setTripData(emptyTrip);
      }
      return data;
    } catch (err) {
      return { success: false, error: err.message };
    }
  };
const deleteTrip = async (id) => {
  try {
    const res = await axios.delete(`/api/trips/${id}`);
    const data = res.data;
    if (data.success) {
      setTripsList((prev) => prev.filter((trip) => trip.id !== id));
    }
    return data;
  } catch (err) {
    return { success: false, error: err.message };
  }
};

  useEffect(() => {
    fetchAllTrips();
  }, []);

  return (
    <TripIDContext.Provider
      value={{
        tripData,
        tripsList,
        setTripData,
        fetchTripById,
        fetchAllTrips,
        updateTripField,
        saveTrip,
        deleteTrip,
        loading,
        error,
      }}
    >
      {children}
    </TripIDContext.Provider>
  );
}

export const useTripID = () => useContext(TripIDContext);
