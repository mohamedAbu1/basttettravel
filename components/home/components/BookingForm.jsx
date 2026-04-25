"use client";
import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import { FaCalendarAlt } from "react-icons/fa";
import { useState } from "react";
import CitiesInput from "./components/CitiesInput";
import CategoriesInput from "./components/CategoriesInput";

// استيراد DatePicker و الأدوات المساعدة
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { addDays } from "date-fns";

export default function BookingForm() {
  const { theme } = useTheme();

  // المدن
  const [showCities, setShowCities] = useState(false);
  const [selectedCities, setSelectedCities] = useState([]);
  const cities = [
    "Cairo",
    "Alexandria",
    "Luxor",
    "Aswan",
    "Giza",
    "Sharm El-Sheikh",
    "Hurghada",
    "Siwa",
  ];
  const toggleCity = (city) =>
    setSelectedCities((prev) =>
      prev.includes(city) ? prev.filter((c) => c !== city) : [...prev, city],
    );
  const confirmCities = () => setShowCities(false);

  // الفئات
  const [showCategories, setShowCategories] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const categories = [
    "Adventure",
    "Culture",
    "Relaxation",
    "Luxury",
    "Family",
    "Nature",
    "Historical",
    "Wellness",
  ];
  const toggleCategory = (cat) =>
    setSelectedCategories((prev) =>
      prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat],
    );
  const confirmCategories = () => setShowCategories(false);

  // التواريخ
  const [arrival, setArrival] = useState(null);
  const [departure, setDeparture] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const specialDates = []; // لو عندك أيام خاصة ممكن تضيفها هنا

  // مكون مخصص للإنبت (شفاف واحترافي)
  const CustomInput = ({ value, onClick }) => (
    <div
      onClick={onClick}
      className="flex w-[325px] items-center border border-[#C2A878] rounded-[10px] 
             bg-[rgba(255,255,255,0.08)] backdrop-blur-md px-6 cursor-pointer 
             shadow-[0_0_15px_rgba(194,168,120,0.3)] hover:shadow-[0_0_25px_rgba(194,168,120,0.6)] 
             transition-all duration-300 relative overflow-hidden"
    >
      {/* أيقونة التقويم */}
      <FaCalendarAlt className="text-[#C2A878] mr-3 text-xl drop-shadow-[0_0_6px_rgba(194,168,120,0.7)]" />

      {/* النص */}
      <span className="flex-1 p-2 text-white/90 tracking-wide font-medium">
        {value || "Select Date"}
      </span>

      {/* لمعة ذهبية خفيفة */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[rgba(194,168,120,0.15)] to-transparent opacity-0 hover:opacity-100 transition-opacity duration-500"></div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 2 }}
      className={`mt-6 ${theme.card} shadow-lg flex flex-col gap-4 w-[80%] max-w-4xl p-6 
                  bg-transparent backdrop-blur-md border border-white/20 rounded-xl relative`}
    >
      <div className="flex flex-row flex-wrap gap-5 flex-1">
        {/* Cities */}
        <div className="flex items-center flex-1 border border-[#C2A878] rounded-[4px] hover:shadow-[0_0_25px_rgba(194,168,120,0.6)] bg-transparent px-3 relative">
          <CitiesInput
            selectedCities={selectedCities}
            confirmSelection={confirmCities}
            setShowCities={setShowCities}
            toggleCity={toggleCity}
            showCities={showCities}
            cities={cities}
          />
        </div>

        {/* Categories */}
        <div className="flex items-center flex-1 border border-[#C2A878] rounded-[4px] hover:shadow-[0_0_25px_rgba(194,168,120,0.6)] bg-transparent px-3 relative">
          <CategoriesInput
            selectedCategories={selectedCategories}
            confirmSelection={confirmCategories}
            setShowCategories={setShowCategories}
            toggleCategory={toggleCategory}
            showCategories={showCategories}
            categories={categories}
          />
        </div>

        {/* Arrival Date */}
        <div className="flex-1 max-w-[120px] xl:min-w-[325px] flex flex-col">
          <DatePicker
            selected={arrival}
            onChange={(date) => {
              setArrival(date);
              setStartDate(date);
            }}
            dateFormat="dd/MM/yyyy"
            placeholderText="Checkin"
            customInput={<CustomInput />}
            minDate={addDays(new Date(), 2)}
            dayClassName={(day) => {
              const special = specialDates.find(
                (item) => item.date.toDateString() === day.toDateString(),
              );
              return special ? "special-day" : "";
            }}
          />
        </div>

        {/* Departure Date */}
        <div className="flex-1 max-w-[120px] xl:min-w-[325px] flex flex-col">
          <DatePicker
            selected={departure}
            onChange={(date) => setDeparture(date)}
            minDate={startDate ? addDays(startDate, 7) : addDays(new Date(), 4)}
            dateFormat="dd/MM/yyyy"
            placeholderText="Checkout"
            ؤ
            customInput={<CustomInput />}
          />
        </div>
      </div>

      {/* زر الحجز */}
      <button
        className="w-full rounded-[4px] px-6 py-3 bg-transparent backdrop-blur-md 
                   border border-[#C2A878] text-[#C2A878] font-semibold tracking-wide 
                   hover:bg-[#C2A878]/20 hover:text-white transition-all duration-300 
                   shadow-lg cursor-pointer"
      >
        EXPERIENCE THE LEGEND
      </button>
    </motion.div>
  );
}
