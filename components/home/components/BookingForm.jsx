"use client";
import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import { FaCalendarAlt } from "react-icons/fa";
import { useState } from "react";
import CitiesInput from "./components/CitiesInput";
import CategoriesInput from "./components/CategoriesInput";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { addDays } from "date-fns";
import { useCitiesCategories } from "@/context/CitiesCategoriesContext";
import { useRouter } from "next/navigation";
import { useQueryFilters } from "@/context/QueryContext";

const encodeData = (obj) => btoa(JSON.stringify(obj));

export default function BookingForm({ setShowTrips, trips = [] }) {
  const { theme } = useTheme();
  const { cities, categories } = useCitiesCategories();
  const { updateValue } = useQueryFilters();
  const router = useRouter();
  const [showCities, setShowCities] = useState(false);
  const [showCategories, setShowCategories] = useState(false);

  const [selectedCities, setSelectedCities] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [arrival, setArrival] = useState(null);
  const [departure, setDeparture] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const specialDates = [];

  const handleClick = () => {
    const queryObj = {
      city: selectedCities.length
        ? selectedCities.map((c) => c.name.en)
        : ["all"],
      category: selectedCategories.length
        ? selectedCategories.map((c) => c.name)
        : ["all"],
      price: "All",
      popular: false,
    };

    // ✅ اطبع القيم علشان نعرف السبب
    console.log("Query object:", queryObj);
    const encoded = encodeData(queryObj);
    console.log("Encoded query:", encoded);

    // ✅ اطبع القيم الحقيقية للرحلات
    trips.forEach((trip) => {
      console.log("Trip city:", trip.city);
      console.log("Trip category:", trip.category);
    });

    updateValue("city", queryObj.city);
    updateValue("category", queryObj.category);
    updateValue("price", queryObj.price);
    updateValue("popular", queryObj.popular);

    router.push(`/trips?data=${encoded}`);
  };

  const toggleCity = (city) => {
    setSelectedCities((prev) =>
      prev.some((c) => c.id === city.id)
        ? prev.filter((c) => c.id !== city.id)
        : [...prev, city],
    );
  };

  const toggleCategory = (cat) => {
    setSelectedCategories((prev) =>
      prev.some((c) => c.id === cat.id)
        ? prev.filter((c) => c.id !== cat.id)
        : [...prev, cat],
    );
  };

  const CustomInput = ({ value, onClick }) => (
    <div
      onClick={onClick}
      className={`flex w-full items-center rounded-[10px] px-4 py-2 cursor-pointer 
                  backdrop-blur-md border ${theme.logoBorder} shadow-md hover:shadow-lg 
                  transition-all duration-300 relative overflow-hidden ${theme.card}`}
    >
      <FaCalendarAlt className={`mr-3 text-xl ${theme.iconHover}`} />
      <span className={`flex-1 p-2 tracking-wide font-medium ${theme.text}`}>
        {value || "Select Date"}
      </span>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 2 }}
      className={`mt-6 ${theme.card} h-auto shadow-lg w-[95%] max-w-6xl p-6 
                  backdrop-blur-md border ${theme.logoBorder} rounded-xl relative`}
    >
      {/* ✅ الصف الأول: المدن + الكاتجري */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div
          className={`flex items-center border ${theme.logoBorder} rounded-[4px] px-3 ${theme.card}`}
        >
          <CitiesInput
            selectedCities={selectedCities}
            setSelectedCities={setSelectedCities}
            confirmSelection={() => setShowCities(false)}
            setShowCities={setShowCities}
            toggleCity={toggleCity}
            showCities={showCities}
            cities={cities}
          />
        </div>

        <div
          className={`flex items-center border ${theme.logoBorder} rounded-[4px] px-3 ${theme.card}`}
        >
          <CategoriesInput
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
            confirmSelection={() => setShowCategories(false)}
            setShowCategories={setShowCategories}
            toggleCategory={toggleCategory}
            showCategories={showCategories}
            categories={categories}
          />
        </div>
      </div>

      {/* ✅ الصف الثاني: موعد الدخول + موعد الخروج */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="flex flex-col">
          <DatePicker
            selected={arrival}
            onChange={(date) => {
              setArrival(date);
              setStartDate(date);
            }}
            onCalendarOpen={() => setShowTrips(true)}
            onCalendarClose={() => setShowTrips(false)}
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

        <div className="flex flex-col">
          <DatePicker
            selected={departure}
            onChange={(date) => setDeparture(date)}
            onCalendarOpen={() => setShowTrips(true)}
            onCalendarClose={() => setShowTrips(false)}
            minDate={startDate ? addDays(startDate, 7) : addDays(new Date(), 4)}
            dateFormat="dd/MM/yyyy"
            placeholderText="Checkout"
            customInput={<CustomInput />}
          />
        </div>
      </div>

      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleClick}
        className={`w-full rounded-[6px] px-6 py-3 font-semibold tracking-wide cursor-pointer 
              transition-all duration-300 shadow-lg ${theme.buttonPrimary}`}
        style={{
          color: `${theme.subText}`,
          border: `2px solid ${theme.logoBorder}`,
        }}
      >
        EXPERIENCE THE LEGEND
      </motion.button>
    </motion.div>
  );
}
