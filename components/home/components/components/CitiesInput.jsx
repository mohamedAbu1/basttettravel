import React from "react";
import { MdLocationCity } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";

const CitiesInput = ({
  selectedCities,
  confirmSelection,
  toggleCity,
  showCities,
  cities,
  setShowCities,
}) => {
  return (
    <>
      <MdLocationCity className="text-[#C2A878] mr-2" />
      <input
        type="text"
        placeholder="City"
        value={selectedCities.join(" - ")}
        onFocus={() => setShowCities(true)}
        readOnly
        className="flex-1 p-3 bg-transparent text-white placeholder-white/70 
                   focus:outline-none cursor-pointer"
      />

      {/* القائمة الجانبية مع أنيمشن وشفافية */}
      <AnimatePresence>
        {showCities && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex flex-wrap gap-3 w-[400px] absolute left-0 top-full mt-2 
                       bg-[rgba(255,255,255,0.13)] backdrop-blur-md border border-[#C2A878]/50 
                       rounded-xl shadow-[0_8px_25px_rgba(194,168,120,0.4)] z-99 p-4"
          >
            {cities.map((city, i) => (
              <motion.div
                key={i}
                whileHover={{
                  scale: 1.1,
                  rotate: -2,
                  boxShadow: "0 6px 15px rgba(194,168,120,0.6)",
                }}
                onMouseDown={() => toggleCity(city)}
                className={`px-4 py-2 rounded-lg cursor-pointer transition-all duration-300 
                  ${
                    selectedCities.includes(city)
                      ? "bg-gradient-to-r from-[#C2A878] to-[#b5892e] text-black shadow-lg"
                      : "text-[#C2A878] bg-[rgba(35,35,35,0.69)] hover:bg-[#C2A878]/20 hover:text-white"
                  }`}
              >
                {city}
              </motion.div>
            ))}

            {/* زر التأكيد ✅ */}
            <motion.div
              whileHover={{ scale: 1.05 }}
              onMouseDown={confirmSelection}
              className="w-full rounded-[4px] px-6 py-3 
             bg-transparent backdrop-blur-md 
             border border-[#C2A878] 
             text-[#C2A878] font-semibold tracking-wide
             hover:bg-[#C2A878]/20 hover:text-white 
             transition-all duration-300 shadow-lg cursor-pointer text-center"
            >
              ✅ Confirm
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default CitiesInput;
