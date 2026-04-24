"use client";
import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import { FaCalendarAlt } from "react-icons/fa";
import { useState } from "react";
import CitiesInput from "./components/CitiesInput";
import CategoriesInput from "./components/CategoriesInput";

export default function BookingForm() {
  const { theme } = useTheme();

  // المدن
  const [showCities, setShowCities] = useState(false);
  const [selectedCities, setSelectedCities] = useState([]);
  const cities = ["Cairo","Alexandria","Luxor","Aswan","Giza","Sharm El-Sheikh","Hurghada","Siwa"];
  const toggleCity = (city) => setSelectedCities((prev) => prev.includes(city) ? prev.filter((c) => c !== city) : [...prev, city]);
  const confirmCities = () => setShowCities(false);

  // الفئات
  const [showCategories, setShowCategories] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const categories = ["Adventure","Culture","Relaxation","Luxury","Family","Nature","Historical","Wellness"];
  const toggleCategory = (cat) => setSelectedCategories((prev) => prev.includes(cat) ? prev.filter((c) => c !== cat) : [...prev, cat]);
  const confirmCategories = () => setShowCategories(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 2 }}
      className={`mt-6 ${theme.card} shadow-lg flex flex-col gap-4 w-[80%] max-w-4xl p-6 
                  bg-transparent backdrop-blur-md border border-white/20 rounded-xl relative`}
    >
      <div className="flex flex-row flex-wrap gap-2.5 flex-1">
        {/* Cities */}
        <div className="flex items-center flex-1 border border-[#C2A878] rounded-[4px] bg-transparent px-3 relative">
          <CitiesInput selectedCities={selectedCities} confirmSelection={confirmCities} setShowCities={setShowCities} toggleCity={toggleCity} showCities={showCities} cities={cities}/>
        </div>

        {/* Categories */}
        <div className="flex items-center flex-1 border border-[#C2A878] rounded-[4px] bg-transparent px-3 relative">
          <CategoriesInput selectedCategories={selectedCategories} confirmSelection={confirmCategories} setShowCategories={setShowCategories} toggleCategory={toggleCategory} showCategories={showCategories} categories={categories}/>
        </div>

        {/* Arrival Date */}
        <div className="flex items-center flex-1 border border-[#C2A878] rounded-[4px] bg-transparent px-3">
          <FaCalendarAlt className="text-[#C2A878] mr-2" />
          <input type="date" placeholder="Arrival Date" className="flex-1 p-3 bg-transparent text-white placeholder-white/70 focus:outline-none"/>
        </div>

        {/* Departure Date */}
        <div className="flex items-center flex-1 border border-[#C2A878] rounded-[4px] bg-transparent px-3">
          <FaCalendarAlt className="text-[#C2A878] mr-2" />
          <input type="date" placeholder="Departure Date" className="flex-1 p-3 bg-transparent text-white placeholder-white/70 focus:outline-none"/>
        </div>
      </div>

      {/* زر الحجز */}
      <button className="w-full rounded-[4px] px-6 py-3 bg-transparent backdrop-blur-md border border-[#C2A878] text-[#C2A878] font-semibold tracking-wide hover:bg-[#C2A878]/20 hover:text-white transition-all duration-300 shadow-lg cursor-pointer">
        EXPERIENCE THE LEGEND
      </button>
    </motion.div>
  );
}
