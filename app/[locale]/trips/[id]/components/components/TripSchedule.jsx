"use client";
import { FaPlaneArrival, FaPlaneDeparture } from "react-icons/fa";
import { useTheme } from "@/context/ThemeContext";
import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function TripSchedule({
  arrivalDate,
  setArrivalDate,
  departureDate,
  setDepartureDate,
}) {
  const { theme } = useTheme();
  const [alreadyInEgypt, setAlreadyInEgypt] = useState(false);

  const today = new Date();
  const minArrival = new Date(today);
  minArrival.setDate(today.getDate() + 2);

  const minDeparture = arrivalDate ? new Date(arrivalDate) : minArrival;
  minDeparture.setDate(minDeparture.getDate() + 2);

  const customInputStyle = `ml-2 px-4 py-2 rounded-lg shadow-md cursor-pointer 
                            focus:outline-none focus:ring-2 transition-all duration-300 
                            ${theme.card} ${theme.text} ${theme.border}`;

  return (
    <div className={`mb-6 p-6 rounded-xl shadow-lg ${theme.card}`}>
      <h3 className={`text-xl font-bold mb-4 ${theme.title}`}>Trip Schedule</h3>

      {/* ✅ Checkbox */}
      <div className="flex items-center gap-3 mb-6">
        <label className="relative flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={alreadyInEgypt}
            onChange={(e) => setAlreadyInEgypt(e.target.checked)}
            className="peer hidden"
          />
          {/* ✅ تصميم الزجاجي */}
          <span
            className={`w-6 h-6 rounded-md border-2 flex items-center justify-center 
                  bg-white/10 dark:bg-black/20 backdrop-blur-md 
                  border-[#c9a34a]/50 shadow-sm 
                  peer-checked:bg-[#c9a34a]/80 peer-checked:border-[#c9a34a] 
                  transition-all duration-300`}
          >
            {/* علامة الصح */}
            <svg
              className="w-4 h-4 text-white opacity-0 peer-checked:opacity-100 transition-opacity duration-200"
              fill="none"
              stroke="currentColor"
              strokeWidth="3"
              viewBox="0 0 24 24"
            >
              <path d="M5 13l4 4L19 7" />
            </svg>
          </span>
          <span className={`ml-3 font-medium ${theme.subText}`}>
            I am already in Egypt
          </span>
        </label>
      </div>

      {/* ✅ إخفاء الحقول لو المستخدم بالفعل في مصر */}
      {!alreadyInEgypt && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* موعد الوصول */}
          <div className="flex flex-col gap-2">
            <label
              className={`font-semibold flex items-center gap-2 ${theme.subText}`}
            >
              <FaPlaneArrival className={theme.icon} /> Arrival Date
            </label>
            <DatePicker
              selected={arrivalDate ? new Date(arrivalDate) : null}
              onChange={(date) => setArrivalDate(date)}
              minDate={minArrival}
              dateFormat="dd/MM/yyyy"
              className={customInputStyle}
              placeholderText="Select arrival date"
            />
          </div>

          {/* موعد المغادرة */}
          <div className="flex flex-col gap-2">
            <label
              className={`font-semibold flex items-center gap-2 ${theme.subText}`}
            >
              <FaPlaneDeparture className={theme.icon} /> Departure Date
            </label>
            <DatePicker
              selected={departureDate ? new Date(departureDate) : null}
              onChange={(date) => setDepartureDate(date)}
              minDate={minDeparture}
              dateFormat="dd/MM/yyyy"
              className={customInputStyle}
              placeholderText="Select departure date"
            />
          </div>
        </div>
      )}
    </div>
  );
}
