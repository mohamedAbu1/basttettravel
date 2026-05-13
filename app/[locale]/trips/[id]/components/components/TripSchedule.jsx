"use client";
import { FaPlaneArrival, FaPlaneDeparture } from "react-icons/fa";
import { useTheme } from "@/context/ThemeContext";
import { useState } from "react";

export default function TripSchedule({
  arrivalDate,
  setArrivalDate,
  departureDate,
  setDepartureDate,
}) {
  const { theme } = useTheme(); // ✅ جلب الثيم
  const [alreadyInEgypt, setAlreadyInEgypt] = useState(false);

  const today = new Date();
  const minArrival = new Date(today);
  minArrival.setDate(today.getDate() + 2); // الوصول يبدأ من بعد غد

  const minDeparture = arrivalDate ? new Date(arrivalDate) : minArrival;
  minDeparture.setDate(minDeparture.getDate() + 2); // المغادرة بعد الوصول بيومين

  return (
    <div className={`mb-6 p-4 border-b ${theme.border}`}>
      <h3 className={`text-lg font-semibold mb-3 ${theme.title}`}>
        Trip Schedule
      </h3>

      {/* ✅ Checkbox */}
      <div className="flex items-center gap-2 p-4">
        <input
          type="checkbox"
          checked={alreadyInEgypt}
          onChange={(e) => setAlreadyInEgypt(e.target.checked)}
          className="w-4 h-4 accent-[#c9a34a]"
        />
        <label className={`font-medium ${theme.subText}`}>
          I am already in Egypt
        </label>
      </div>

      {/* ✅ إخفاء الحقول لو المستخدم بالفعل في مصر */}
      {!alreadyInEgypt && (
        <div className="flex flex-row gap-5">
          {/* موعد الوصول */}
          <div className="flex items-center gap-2 mb-3">
            <FaPlaneArrival className={theme.icon} />
            <label className={`block font-medium ${theme.subText}`}>
              Arrival Date
            </label>
            <input
              type="date"
              value={arrivalDate}
              onChange={(e) => setArrivalDate(e.target.value)}
              min={minArrival.toISOString().split("T")[0]}
              className={`ml-2 p-2 rounded focus:outline-none focus:ring-2 ${theme.border} ${theme.text}`}
            />
          </div>

          {/* موعد المغادرة */}
          <div className="flex items-center gap-2">
            <FaPlaneDeparture className={theme.icon} />
            <label className={`block font-medium ${theme.subText}`}>
              Departure Date
            </label>
            <input
              type="date"
              value={departureDate}
              onChange={(e) => setDepartureDate(e.target.value)}
              min={minDeparture.toISOString().split("T")[0]}
              className={`ml-2 p-2 rounded focus:outline-none focus:ring-2 ${theme.border} ${theme.text}`}
            />
          </div>
        </div>
      )}
    </div>
  );
}
