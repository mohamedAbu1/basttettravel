"use client";
import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import { FaMapMarkerAlt, FaCalendarAlt, FaUserFriends } from "react-icons/fa";
import { MdFlightTakeoff, MdFlightLand } from "react-icons/md";

export default function BookingForm() {
  const { theme } = useTheme();

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 2 }}
      className={`mt-8 ${theme.card} shadow-lg flex flex-col gap-4 w-[80%] max-w-4xl p-6 
                  bg-transparent backdrop-blur-md border border-white/20 rounded-xl`}
    >
      {/* الحقول */}
      <div className="flex flex-row flex-wrap gap-2.5 flex-1">
        {/* FROM */}
        <div className="flex items-center flex-1 border border-[#C2A878] rounded-[4px] bg-transparent px-3">
          <MdFlightTakeoff className="text-[#C2A878] mr-2" />
          <input
            type="text"
            placeholder="FROM"
            className="flex-1 p-3 bg-transparent text-white placeholder-white/70 focus:outline-none"
          />
        </div>

        {/* TO */}
        <div className="flex items-center flex-1 border border-[#C2A878] rounded-[4px] bg-transparent px-3">
          <MdFlightLand className="text-[#C2A878] mr-2" />
          <input
            type="text"
            placeholder="TO"
            className="flex-1 p-3 bg-transparent text-white placeholder-white/70 focus:outline-none"
          />
        </div>

        {/* DATE */}
        <div className="flex items-center flex-1 border border-[#C2A878] rounded-[4px] bg-transparent px-3">
          <FaCalendarAlt className="text-[#C2A878] mr-2" />
          <input
            type="date"
            className="flex-1 p-3 bg-transparent text-white placeholder-white/70 focus:outline-none"
          />
        </div>

        {/* PASSENGERS */}
        <div className="flex items-center flex-1 border border-[#C2A878] rounded-[4px] bg-transparent px-3">
          <FaUserFriends className="text-[#C2A878] mr-2" />
          <input
            type="number"
            placeholder="PASSENGERS"
            className="flex-1 p-3 bg-transparent text-white placeholder-white/70 focus:outline-none"
          />
        </div>
      </div>

      {/* زر الحجز */}
      <button
        className="w-full rounded-[4px] px-6 py-3 
             bg-transparent backdrop-blur-md 
             border border-[#C2A878] 
             text-[#C2A878] font-semibold tracking-wide
             hover:bg-[#C2A878]/20 hover:text-white 
             transition-all duration-300 shadow-lg cursor-pointer"
      >
        EXPERIENCE THE LEGEND
      </button>
    </motion.div>
  );
}
