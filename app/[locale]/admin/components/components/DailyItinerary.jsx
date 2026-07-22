"use client";
import React from "react";
import { useTheme } from "@/context/ThemeContext";
import { useTrip } from "../../context/TripContext";
import { v4 as uuidv4 } from "uuid";

export default function DailyItinerary() {
  const { themeName } = useTheme();
  const { tripData, updateTripField } = useTrip();
  const languages = ["en", "es", "fr", "de", "it", "zh"];

  const safeItinerary = Array.isArray(tripData.itinerary) ? tripData.itinerary : [];

  // ✅ إضافة يوم جديد مع UUID
  const addDay = () => {
    const newDay = {
      id: uuidv4(),
      day_number: safeItinerary.length + 1,
      activities: []
    };
    console.log("➡️ Adding new day:", newDay);
    updateTripField("itinerary", [...safeItinerary, newDay]);
    console.log("✅ Itinerary after addDay:", [...safeItinerary, newDay]);
  };

  // ✅ إضافة نشاط جديد مع UUID
  const addActivity = (dayIndex) => {
    const next = safeItinerary.map((d, i) =>
      i === dayIndex
        ? {
            ...d,
            activities: [
              ...(Array.isArray(d.activities) ? d.activities : []),
              {
                id: uuidv4(),
                time: "",
                activity_translations: { en: "", es: "", fr: "", de: "", it: "", zh: "" }
              }
            ]
          }
        : d
    );
    console.log("➡️ Adding activity to day:", dayIndex, next[dayIndex].activities);
    updateTripField("itinerary", next);
    console.log("✅ Itinerary after addActivity:", next);
  };

  // ✅ تحديث نشاط معين
  const updateActivity = (dayIndex, actIndex, field, value, lang = null) => {
    const next = safeItinerary.map((d, i) => {
      if (i !== dayIndex) return d;
      const acts = Array.isArray(d.activities) ? d.activities : [];
      const updatedActs = acts.map((a, j) => {
        if (j !== actIndex) return a;
        if (field === "activity_translations" && lang) {
          return {
            ...a,
            activity_translations: { ...a.activity_translations, [lang]: value }
          };
        }
        return { ...a, [field]: value };
      });
      return { ...d, activities: updatedActs };
    });
    console.log("➡️ Updating activity:", { dayIndex, actIndex, field, value, lang });
    updateTripField("itinerary", next);
    console.log("✅ Itinerary after updateActivity:", next);
  };

  return (
    <div>
      <h3
        className={`text-xl font-bold mb-3 ${
          themeName === "dark" ? "text-gold" : "text-[#3a2c0a]"
        }`}
      >
        Daily Itinerary
      </h3>

      {safeItinerary.length === 0 ? (
        <p className={themeName === "dark" ? "text-gray-300" : "text-gray-700"}>
          No days yet.
        </p>
      ) : (
        safeItinerary.map((day, dayIndex) => {
          const activities = Array.isArray(day?.activities) ? day.activities : [];

          return (
            <div key={day.id} className="mb-6 p-4 rounded-lg border">
              <h4 className="font-semibold mb-2">Day {day?.day_number ?? dayIndex + 1}</h4>

              {activities.map((act, actIndex) => (
                <div key={act.id} className="space-y-2 mb-4">
                  <input
                    type="time"
                    value={act?.time ?? ""}
                    onChange={(e) =>
                      updateActivity(dayIndex, actIndex, "time", e.target.value)
                    }
                  />

                  <div className="grid grid-cols-2 gap-2">
                    {languages.map((lang) => (
                      <input
                        key={lang}
                        type="text"
                        value={act?.activity_translations?.[lang] ?? ""}
                        onChange={(e) =>
                          updateActivity(
                            dayIndex,
                            actIndex,
                            "activity_translations",
                            e.target.value,
                            lang
                          )
                        }
                        placeholder={`Activity (${lang.toUpperCase()})`}
                      />
                    ))}
                  </div>
                </div>
              ))}

              <button type="button" onClick={() => addActivity(dayIndex)}>
                + Add Activity
              </button>
            </div>
          );
        })
      )}

      <button type="button" onClick={addDay}>
        + Add Day
      </button>
    </div>
  );
}
