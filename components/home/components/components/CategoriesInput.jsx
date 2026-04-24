import React from "react";
import { MdCategory } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";

const CategoriesInput = ({
  selectedCategories,
  confirmSelection,
  toggleCategory,
  showCategories,
  categories,
  setShowCategories,
}) => {
  return (
    <>
      <MdCategory className="text-[#C2A878] mr-2" />
      <input
        type="text"
        placeholder="Category"
        value={selectedCategories.join(" - ")}
        onFocus={() => setShowCategories(true)}
        readOnly
        className="flex-1 p-3 bg-transparent text-white placeholder-white/70 
                   focus:outline-none cursor-pointer"
      />

      {/* القائمة الجانبية مع أنيمشن وشفافية */}
      <AnimatePresence>
        {showCategories && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
            className="flex flex-wrap gap-3 w-[400px] absolute left-0 top-full mt-2 
                       bg-[rgba(255,255,255,0.05)] backdrop-blur-md border border-[#C2A878]/50 
                       rounded-xl shadow-[0_8px_25px_rgba(194,168,120,0.4)] z-50 p-4"
          >
            {categories.map((cat, i) => (
              <motion.div
                key={i}
                whileHover={{
                  scale: 1.1,
                  rotate: -2,
                  boxShadow: "0 6px 15px rgba(194,168,120,0.6)",
                }}
                onMouseDown={() => toggleCategory(cat)}
                className={`px-4 py-2 rounded-lg cursor-pointer transition-all duration-300 
                  ${
                    selectedCategories.includes(cat)
                      ? "bg-gradient-to-r from-[#C2A878] to-[#b5892e] text-black shadow-lg"
                      : "text-[#C2A878] bg-[rgba(35,35,35,0.4)] hover:bg-[#C2A878]/20 hover:text-white"
                  }`}
              >
                {cat}
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

export default CategoriesInput;
