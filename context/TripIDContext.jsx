"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

const TripIDContext = createContext();

export function TripIDProvider({ children }) {
  const [tripData, setTripData] = useState(null);
  const [tripsList, setTripsList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ✅ استدعاء جميع الرحلات مع Cache-Control + تخزين محلي
  const fetchAllTrips = async () => {
    setLoading(true);
    setError(null);
    try {
      const cached = localStorage.getItem("tripsList");
      if (cached) {
        setTripsList(JSON.parse(cached));
      }

      const res = await fetch("/api/trips", {
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
        },
      });

      const data = await res.json();

      if (res.ok) {
        const titles = (data.trips || []).map((trip) => ({
          id: trip.id,
          title:
            typeof trip.title === "object"
              ? trip.title.en || Object.values(trip.title)[0]
              : trip.title || "Untitled",
        }));
        setTripsList(titles);
        localStorage.setItem("tripsList", JSON.stringify(titles));
      } else {
        setError(data.error || "Failed to fetch trips");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ استدعاء رحلة واحدة بالـ ID مع Cache-Control
 const fetchTripById = async (id) => {
  if (!id) {
    setError("No trip ID provided");
    return;
  }

  setLoading(true);
  setError(null);

  try {
    const res = await fetch(`/api/trips/${id}`, {
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache",
      },
    });

    const data = await res.json();

    if (res.ok) {
      setTripData({
        ...data.trip,
        title:
          typeof data.trip.title === "object"
            ? data.trip.title
            : { en: data.trip.title },
        description:
          typeof data.trip.description === "object"
            ? data.trip.description
            : { en: data.trip.description },
        gallery_images: Array.isArray(data.trip.gallery_images)
          ? data.trip.gallery_images
          : JSON.parse(data.trip.gallery_images || "[]"),
        // ✅ تحويل المدن والفئات إلى Array جاهز للعرض
        cities: Array.isArray(data.trip.cities)
          ? data.trip.cities
          : JSON.parse(data.trip.cities || "[]"),
        categories: Array.isArray(data.trip.categories)
          ? data.trip.categories
          : JSON.parse(data.trip.categories || "[]"),
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


  const updateTripField = (field, value) => {
    setTripData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const saveTrip = async () => {
    if (!tripData?.id) return { success: false, error: "No trip ID" };

    const tripPayload = {
      title: tripData.title,
      description: tripData.description,
      duration: tripData.duration,
      priceLevel: tripData.priceLevel,
      cover_image: tripData.cover_image,
      gallery_images: tripData.gallery_images,
      solo_price: tripData.solo_price,
      group_price: tripData.group_price,
    };

    try {
      const res = await fetch(`/api/trips/${tripData.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(tripPayload),
      });
      const data = await res.json();

      if (data.success) {
        setTripData(null);
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
        loading,
        error,
      }}
    >
      {children}
    </TripIDContext.Provider>
  );
}

export const useTripID = () => useContext(TripIDContext);
