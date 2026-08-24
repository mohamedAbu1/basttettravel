import React, { useState, useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";
import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

const CalendarBooking = ({
  prise,
  setCheckInPrice,
  checkInPrice,
  checkIn,
  setCheckIn,
  checkOut,
  setCheckOut,
}) => {
  const { theme } = useTheme();

  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const year = new Date().getFullYear();

  const months = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December",
  ];

  const daysInMonth = new Date(year, currentMonth + 1, 0).getDate();
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const [prices, setPrices] = useState([]);

  // توليد أسعار جديدة
  const generatePrices = () => {
    return Array.from(
      { length: daysInMonth },
      () => Math.floor(Math.random() * prise) + 5
    );
  };

  // تحميل الأسعار من localStorage أو توليد جديدة لو مر 24 ساعة
  useEffect(() => {
    const savedData = localStorage.getItem("calendarPrices");
    const savedTime = localStorage.getItem("calendarPricesTime");

    if (savedData && savedTime) {
      const lastUpdate = new Date(savedTime);
      const now = new Date();
      const diffHours = (now - lastUpdate) / (1000 * 60 * 60);

      if (diffHours < 24) {
        setPrices(JSON.parse(savedData));
        return;
      }
    }

    const newPrices = generatePrices();
    setPrices(newPrices);
    localStorage.setItem("calendarPrices", JSON.stringify(newPrices));
    localStorage.setItem("calendarPricesTime", new Date().toISOString());
  }, [currentMonth, prise]);

  const handleDateClick = (day, price) => {
    const selectedDate = new Date(year, currentMonth, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) return;

    const selected = `${day} ${months[currentMonth]} ${year}`;

    if (checkIn === selected) {
      setCheckIn(null);
      setCheckInPrice(null);
      return;
    }
    if (checkOut === selected) {
      setCheckOut(null);
      return;
    }

    if (!checkIn || (checkIn && checkOut)) {
      setCheckIn(selected);
      setCheckInPrice(price);
      setCheckOut(null);
    } else if (!checkOut) {
      const checkInDate = new Date(checkIn);
      if (selectedDate > checkInDate) {
        setCheckOut(selected);
      }
    }
  };

  const prevMonth = () =>
    setCurrentMonth((prev) => (prev === 0 ? 11 : prev - 1));
  const nextMonth = () =>
    setCurrentMonth((prev) => (prev === 11 ? 0 : prev + 1));

  return (
    <div className={`${theme.card} max-w-2xl mx-auto p-6 shadow-lg font-sans mb-3`}>
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <button className={`${theme.buttonSecondary} p-2 rounded-full`} onClick={prevMonth}>
          <ChevronLeftIcon className={`${theme.icon} w-5 h-5`} />
        </button>
        <h2 className={`${theme.title} text-lg`}>
          {months[currentMonth]} {year}
        </h2>
        <button className={`${theme.buttonSecondary} p-2 rounded-full`} onClick={nextMonth}>
          <ChevronRightIcon className={`${theme.icon} w-5 h-5`} />
        </button>
      </div>

      {/* Days of Week */}
      <div className="grid grid-cols-7 text-center text-sm mb-2">
        {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((day) => (
          <div key={day} className={theme.subText}>{day}</div>
        ))}
      </div>

      {/* Days Grid */}
      <div className="grid grid-cols-7 gap-2 text-center">
        {days.map((day, index) => {
          const selectedDate = new Date(year, currentMonth, day);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const isPast = selectedDate < today;

          const selected = `${day} ${months[currentMonth]} ${year}`;
          const isCheckIn = checkIn === selected;
          const isCheckOut = checkOut === selected;
          const price = prices[index];

          let isBetween = false;
          if (checkIn && checkOut) {
            const checkInDate = new Date(checkIn);
            const checkOutDate = new Date(checkOut);
            isBetween = selectedDate > checkInDate && selectedDate < checkOutDate;
          }

          let isInvalid = false;
          if (checkIn && !checkOut && selectedDate <= new Date(checkIn)) {
            isInvalid = true;
          }

          return (
            <div key={day} className="flex flex-col items-center">
              <motion.button
                onClick={() => !isPast && !isInvalid && handleDateClick(day, price)}
                disabled={isPast || isInvalid}
                whileHover={{ scale: isPast || isInvalid ? 1 : 1.1 }}
                whileTap={{ scale: isPast || isInvalid ? 1 : 0.9 }}
                className={`w-10 h-10 rounded-lg transition ${
                  isPast || isInvalid
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed border border-dashed border-gray-400"
                    : isCheckIn
                      ? "bg-blue-500 text-white shadow-md"
                      : isCheckOut
                        ? "bg-green-500 text-white shadow-md"
                        : isBetween
                          ? "bg-blue-100 text-blue-700 border border-blue-300"
                          : theme.background
                }`}
              >
                {day}
              </motion.button>
              {!checkIn && !isPast && !isInvalid && (
                <p className={`${theme.subText} text-xs mt-1`}>${price}</p>
              )}
            </div>
          );
        })}
      </div>

      {/* Selected Info */}
      <div className="mt-6 grid grid-cols-2 gap-6 text-center">
        <div className={`${theme.card} p-4`}>
          <h3 className={`${theme.heading} text-sm uppercase tracking-wide`}>
            Check-in
          </h3>
          <p className={`${theme.title} mt-2 text-lg`}>
            {checkIn ? checkIn : "Not Selected"}
          </p>
          {checkInPrice && (
            <p className={`${theme.subText} mt-1 text-sm`}>Price: ${checkInPrice}</p>
          )}
        </div>
        <div className={`${theme.card} p-4`}>
          <h3 className={`${theme.heading} text-sm uppercase tracking-wide`}>
            Check-out
          </h3>
          <p className={`${theme.title} mt-2 text-lg`}>
            {checkOut ? checkOut : "Not Selected"}
          </p>
        </div>
      </div>

      {/* Reset Button */}
      {(checkIn || checkOut) && (
        <div className="mt-6 flex justify-center">
          <button
            onClick={() => {
              setCheckIn(null);
              setCheckInPrice(null);
              setCheckOut(null);
            }}
            className={`${theme.buttonSecondary} px-4 py-2`}
          >
            Clear All
          </button>
        </div>
      )}
    </div>
  );
};

export default CalendarBooking;
