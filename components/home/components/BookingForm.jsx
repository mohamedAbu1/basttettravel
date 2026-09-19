"use client";
import dynamic from "next/dynamic";
import { useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { FaCalendarAlt, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import CitiesInput from "./components/CitiesInput";
import CategoriesInput from "./components/CategoriesInput";
import { addDays } from "date-fns";
import { useCitiesCategories } from "@/context/CitiesCategoriesContext";
import { usePathname, useRouter } from "next/navigation";
import { useQueryFilters } from "@/context/QueryContext";
import { useTranslation } from "react-i18next";

const encodeData = (obj) => btoa(JSON.stringify(obj));
const DatePicker = dynamic(() => import("./DatePickerClient"), { ssr: false });

export default function BookingForm({ setShowTrips, trips = [], compact = false }) {
  const { theme } = useTheme();
  const { cities, categories } = useCitiesCategories();
  const { updateValue } = useQueryFilters();
  const router = useRouter();
  const pathname = usePathname();
  const locale = pathname.split("/").filter(Boolean)[0] || "en";
  const { t } = useTranslation("home");
  const { t: commonT } = useTranslation("common");

  const [selectedCities, setSelectedCities] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [arrival, setArrival] = useState(null);
  const [departure, setDeparture] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const handleClick = (event) => {
    event.preventDefault();
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

  const CustomInput = ({ value, onClick, placeholder }) => (
    <button
      type="button"
      onClick={onClick}
      aria-label={value || placeholder}
      className="booking-date-trigger"
    >
      <span className="booking-field-icon"><FaCalendarAlt aria-hidden="true" /></span>
      <span className="booking-date-copy">
        <small>{placeholder}</small>
        <strong>{value || t("SelectDate")}</strong>
      </span>
    </button>
  );

  const renderCalendarHeader = ({ date, decreaseMonth, increaseMonth }) => (
    <div className="booking-calendar-header">
      <button type="button" onClick={decreaseMonth} aria-label="Previous month"><FaChevronLeft /></button>
      <strong>{date.toLocaleDateString(undefined, { month: "long", year: "numeric" })}</strong>
      <button type="button" onClick={increaseMonth} aria-label="Next month"><FaChevronRight /></button>
    </div>
  );

  return (
    <form
      onSubmit={handleClick}
      className={`${compact ? "hero-booking-form" : `mt-6 shadow-lg w-[95%] max-w-6xl p-6 md:p-7 backdrop-blur-md border ${theme.logoBorder} rounded-xl`} h-auto relative`}
    >
      {/* ✅ الصف الأول: المدن + الكاتجري */}
      <div className="booking-filter-grid">
        <div className="booking-filter-field">
          <CitiesInput
            selectedCities={selectedCities}
            setSelectedCities={setSelectedCities}
            confirmSelection={() => setShowCities(false)}
            toggleCity={toggleCity}
            cities={cities}
          />
        </div>

        <div className="booking-filter-field">
          <CategoriesInput
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
            confirmSelection={() => setShowCategories(false)}
            toggleCategory={toggleCategory}
            categories={categories}
          />
        </div>
      </div>

      {/* ✅ الصف الثاني: موعد الدخول + موعد الخروج */}
      <div className="booking-date-grid">
        <div className="booking-date-field">
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
            renderCustomHeader={renderCalendarHeader}
            popperClassName="booking-calendar-popper"
            calendarClassName="booking-calendar"
            minDate={addDays(new Date(), 2)}
          />
        </div>

        <div className="booking-date-field">
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
            renderCustomHeader={renderCalendarHeader}
            popperClassName="booking-calendar-popper"
            calendarClassName="booking-calendar"
          />
        </div>
      </div>

      <button
        type="button"
        disabled={!isFormValid} // ✅ تعطيل الزر لو الفورم ناقص
        className={`booking-submit w-full hero-secondary-action
    ${isFormValid ? theme.buttonPrimary : "bg-gray-400 cursor-not-allowed"}`}
        style={{
          color: isFormValid ? "#211b12" : "#b8b1a4",
          border: `2px solid ${theme.logoBorder}`,
        }}
      >
        {t("experience")}
      </button>
      {!isFormValid && (
        <p className="booking-form-hint" role="status">
          {commonT("selectDatesToContinue", {
            defaultValue: "Select both dates to continue",
          })}
        </p>
      )}
    </form>
  );
}
