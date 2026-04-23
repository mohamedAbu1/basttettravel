"use client";
import React from "react";
import { useTheme } from "@/context/ThemeContext";
import { useTripID } from "../../context/TripIDContext";

const EditTripDailyItinerary = () => {
  const { themeName } = useTheme();
  const { tripData, updateTripField } = useTripID();

  // اللغات المدعومة
  const languages = ["en", "es", "fr", "de", "it", "zh"];

  // ضمان وجود مصفوفة الأيام
  const safeItinerary = Array.isArray(tripData?.itinerary) ? tripData.itinerary : [];

  // ✅ تحديث نشاط معين
  const updateActivity = (dayIndex, actIndex, field, value, lang) => {
    const updatedDays = [...safeItinerary];
    const activities = [...(updatedDays[dayIndex]?.activities || [])];

    if (field === "activity") {
      const updatedActivity = {
        ...activities[actIndex],
        activity_translations: {
          ...activities[actIndex].activity_translations,
          [lang]: value,
        },
      };
      activities[actIndex] = updatedActivity;
    } else {
      activities[actIndex] = { ...activities[actIndex], [field]: value };
    }

    updatedDays[dayIndex] = { ...updatedDays[dayIndex], activities };
    updateTripField("itinerary", updatedDays); // ✅ الحقل الصحيح
  };

  // ✅ إضافة نشاط جديد ليوم معين
  const addActivity = (dayIndex) => {
    const updatedDays = [...safeItinerary];
    const activities = [...(updatedDays[dayIndex]?.activities || [])];
    activities.push({
      time: "",
      activity_translations: { en: "", es: "", fr: "", de: "", it: "", zh: "" },
    });
    updatedDays[dayIndex] = { ...updatedDays[dayIndex], activities };
    updateTripField("itinerary", updatedDays); // ✅ الحقل الصحيح
  };

  // ✅ إضافة يوم جديد
  const addDay = () => {
    const updatedDays = [
      ...safeItinerary,
      {
        day_number: safeItinerary.length + 1,
        activities: [],
      },
    ];
    updateTripField("itinerary", updatedDays); // ✅ الحقل الصحيح
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
            <div
              key={dayIndex}
              className={`mb-6 p-4 rounded-lg border ${
                themeName === "dark"
                  ? "bg-[#0f0f0f] border-gold/30 text-white"
                  : "bg-[#fdf6e3] border-[#c9a34a]/40 text-[#3a2c0a]"
              }`}
            >
              <h4 className="font-semibold mb-2">Day {day?.day_number ?? dayIndex + 1}</h4>

              {activities.map((act, actIndex) => (
                <div key={actIndex} className="space-y-2 mb-4">
                  {/* وقت النشاط */}
                  <input
                    type="time"
                    value={act?.time ?? ""}
                    onChange={(e) =>
                      updateActivity(dayIndex, actIndex, "time", e.target.value)
                    }
                    className={`p-2 rounded-lg border ${
                      themeName === "dark"
                        ? "bg-[#1a1a1a] border-gold/30 text-white"
                        : "bg-white border-[#c9a34a]/40 text-[#3a2c0a]"
                    }`}
                  />

                  {/* النشاط مترجم بست لغات */}
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
                            "activity",
                            e.target.value,
                            lang
                          )
                        }
                        placeholder={`Activity (${lang.toUpperCase()})`}
                        className={`p-2 rounded-lg border ${
                          themeName === "dark"
                            ? "bg-[#1a1a1a] border-gold/30 text-white"
                            : "bg-white border-[#c9a34a]/40 text-[#3a2c0a]"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              ))}

                           <button
                type="button"
                onClick={() => addActivity(dayIndex)}
                className={`px-3 py-1 rounded font-bold ${
                  themeName === "dark"
                    ? "bg-[#c9a34a] text-black hover:bg-yellow-500"
                    : "bg-[#c9a34a] text-white hover:bg-[#b5892e]"
                }`}
              >
                + Add Activity
              </button>
            </div>
          );
        })
      )}

      <button
        type="button"
        onClick={addDay}
        className={`px-4 py-2 rounded font-bold ${
          themeName === "dark"
            ? "bg-[#c9a34a] text-black hover:bg-yellow-500"
            : "bg-[#c9a34a] text-white hover:bg-[#b5892e]"
        }`}
      >
        + Add Day
      </button>
    </div>
  );
};

export default EditTripDailyItinerary;
