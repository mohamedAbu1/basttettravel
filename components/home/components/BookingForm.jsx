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
import { usePathname, useRouter } from "next/navigation";
import { useQueryFilters } from "@/context/QueryContext";
import { useTranslation } from "react-i18next";

const encodeData = (obj) => btoa(JSON.stringify(obj));

export default function BookingForm({ setShowTrips, trips = [], compact = false }) {
  const { theme } = useTheme();
  const { cities, categories } = useCitiesCategories();
  const { updateValue } = useQueryFilters();
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname.split("/").filter(Boolean)[0] || "en";
  const [showCities, setShowCities] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const { t } = useTranslation("home");
  const { t: commonT } = useTranslation("common");

  const [selectedCities, setSelectedCities] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [arrival, setArrival] = useState(null);
  const [departure, setDeparture] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const specialDates = [];

  const handleClick = () => {
    const queryObj = {
      city: selectedCities.length ? selectedCities.map((c) => c.name) : ["all"],
      category: selectedCategories.length
        ? selectedCategories.map((c) => c.name)
        : ["all"],
      group_price: "All",
      popular: false,
    };
    // ✅ اطبع القيم علشان نعرف السبب
    const encoded = encodeData(queryObj);

  

    updateValue("city", queryObj.city);
    updateValue("category", queryObj.category);
    updateValue("group_price", queryObj.group_price);
    updateValue("popular", queryObj.popular);

    router.push("/" + locale + "/trips?data=" + encoded);
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
  const isFormValid = Boolean(arrival && departure);

  const CustomInput = ({ value, onClick }) => (
    <button
      type="button"
      onClick={onClick}
      aria-label={value || t("SelectDate")}
      className={`hero-booking-trigger flex w-full items-center rounded-[10px] px-4 py-2 cursor-pointer
                  backdrop-blur-md border ${theme.logoBorder} shadow-md hover:shadow-lg 
                  transition-all duration-300 relative overflow-hidden`}
    >
      <FaCalendarAlt className={`mr-3 text-xl ${theme.iconHover}`} />
      <span className={`flex-1 p-2 tracking-wide font-medium ${theme.text}`}>
        {value || t("SelectDate")}
      </span>
    </button>
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 2 }}
      className={`${compact ? "hero-booking-form" : `mt-6 shadow-lg w-[95%] max-w-6xl p-6 md:p-7 backdrop-blur-md border ${theme.logoBorder} rounded-xl`} h-auto relative`}
    >
      {/* ✅ الصف الأول: المدن + الكاتجري */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div
          className={`flex items-center border ${theme.logoBorder}  ${theme.shadow} rounded-[4px] px-3 `}
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
          className={`flex items-center border ${theme.logoBorder} border-amber-200 ${theme.shadow} rounded-[4px] px-3 `}
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
        <div className="flex flex-col gap-2">
          <span className="booking-field-label">{t("checkin")}</span>
          <DatePicker
            selected={arrival}
            onChange={(date) => {
              setArrival(date);
              setStartDate(date);
            }}
            onCalendarOpen={() => setShowTrips(true)}
            onCalendarClose={() => setShowTrips(false)}
            dateFormat="dd/MM/yyyy"
            placeholderText={t("checkin")}
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

        <div className="flex flex-col gap-2">
          <span className="booking-field-label">{t("checkout")}</span>
          <DatePicker
            selected={departure}
            onChange={(date) => setDeparture(date)}
            onCalendarOpen={() => setShowTrips(true)}
            onCalendarClose={() => setShowTrips(false)}
            minDate={startDate ? addDays(startDate, 7) : addDays(new Date(), 4)}
            dateFormat="dd/MM/yyyy"
            placeholderText={t("checkout")}
            customInput={<CustomInput />}
          />
        </div>
      </div>

      <motion.button
        type="button"
        whileHover={isFormValid ? { scale: 1.05 } : {}}
        whileTap={isFormValid ? { scale: 0.95 } : {}}
        onClick={handleClick}
        disabled={!isFormValid} // ✅ تعطيل الزر لو الفورم ناقص
        className={`w-full hero-secondary-action
    ${isFormValid ? theme.buttonPrimary : "bg-gray-400 cursor-not-allowed"}`}
        style={{
          color: isFormValid ? "#211b12" : "#b8b1a4",
          border: `2px solid ${theme.logoBorder}`,
        }}
      >
        {t("experience")}
      </motion.button>
      {!isFormValid && (
        <p className="booking-form-hint" role="status">
          {commonT("selectDatesToContinue", {
            defaultValue: "Select both dates to continue",
          })}
        </p>
      )}
    </motion.div>
  );
}
