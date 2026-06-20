"use client";
import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import { FaCalendarAlt } from "react-icons/fa";
import { useState, useEffect } from "react";
import CitiesInput from "./components/CitiesInput";
import CategoriesInput from "./components/CategoriesInput";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { addDays } from "date-fns";
import { useCitiesCategories } from "@/context/CitiesCategoriesContext";
import { useRouter } from "next/navigation";
import { useQueryFilters } from "@/context/QueryContext"; // ✅ ربط مع الكونتكست

const encodeData = (obj) => btoa(JSON.stringify(obj));

export default function BookingForm({ setShowTrips }) {
  const { theme } = useTheme();
  const { cities, categories } = useCitiesCategories();
  const { updateValue } = useQueryFilters(); // ✅ هنستخدمه لتحديث الفلاتر
  const router = useRouter();
    const [screenSize, setScreenSize] = useState({ width: 0, height: 0 });
  let rightValue = screenSize.width * 0.19;
  let topValue = 0; // ✅ لازم يتعرف هنا

  if (screenSize.width >= 1575) {
    rightValue = screenSize.width * 0.2;
  } else if (screenSize.width >= 1000) {
    rightValue = screenSize.width * 0.36;
  }

  const [showCities, setShowCities] = useState(false);
  const [showCategories, setShowCategories] = useState(false);

  const [selectedCities, setSelectedCities] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const confirmCities = () => setShowCities(false);
  const confirmCategories = () => setShowCategories(false);

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

  const [arrival, setArrival] = useState(null);
  const [departure, setDeparture] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const specialDates = [];

  // ✅ زر الحجز
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

    // تحديث القيم في الـ context
    updateValue("city", queryObj.city);
    updateValue("category", queryObj.category);
    updateValue("price", queryObj.price);
    updateValue("popular", queryObj.popular);

    // توجيه المستخدم لصفحة الرحلات مع البيانات
    const encoded = encodeData(queryObj);
    router.push(`/trips?data=${encoded}`);
  };

  const CustomInput = ({ value, onClick }) => (
    <div
      onClick={onClick}
      className={`flex w-[325px] items-center rounded-[10px] px-6 cursor-pointer 
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
      className={`mt-6 ${theme.card} shadow-lg flex flex-col flex-wrap gap-4 w-[80%] max-w-4xl p-6 
                  backdrop-blur-md border ${theme.logoBorder} rounded-xl relative`}
    >
      <div className="flex flex-row flex-wrap gap-5 flex-1">
        <div className="flex flex-row flex-wrap gap-5 flex-1">
          {/* Cities */}
          <div
            className={`flex items-center flex-1 border ${theme.logoBorder} rounded-[4px] px-3 relative ${theme.card}`}
          >
            <CitiesInput
              selectedCities={selectedCities}
              setSelectedCities={setSelectedCities}
              confirmSelection={confirmCities}
              setShowCities={setShowCities}
              toggleCity={toggleCity}
              showCities={showCities}
              cities={cities}
              topValue={topValue}
              rightValue={rightValue}
            />
          </div>

          {/* Categories */}
          <div
            className={`flex items-center flex-1 border ${theme.logoBorder} rounded-[4px] px-3 relative ${theme.card}`}
          >
            <CategoriesInput
              selectedCategories={selectedCategories}
              setSelectedCategories={setSelectedCategories}
              confirmSelection={confirmCategories}
              setShowCategories={setShowCategories}
              toggleCategory={toggleCategory}
              showCategories={showCategories}
              categories={categories}
              topValue={topValue}
              rightValue={rightValue}
            />
          </div>

          {/* Arrival Date */}
          <div className="flex-1 max-w-[120px] xl:min-w-[325px] flex flex-col z-[1]">
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

          {/* Departure Date */}
          <div className="flex-1 max-w-[120px] xl:min-w-[325px] flex flex-col z-50">
            <DatePicker
              selected={departure}
              onChange={(date) => setDeparture(date)}
              onCalendarOpen={() => setShowTrips(true)}
              onCalendarClose={() => setShowTrips(false)}
              minDate={
                startDate ? addDays(startDate, 7) : addDays(new Date(), 4)
              }
              dateFormat="dd/MM/yyyy"
              placeholderText="Checkout"
              customInput={<CustomInput />}
            />
          </div>
        </div>

  
      </div>

      {/* زر الحجز */}
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
