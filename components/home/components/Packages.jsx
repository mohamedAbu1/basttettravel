"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";

export default function Packages() {
  const { theme } = useTheme();

  const packages = [
    {
      title: "Valley of the Kings",
      price: "$1,899",
      img: "/Luxor/pexels-axp-photography-500641970-18991548.webp",
    },
    {
      title: "Aswan Oasis",
      price: "$1,499",
      img: "/HomePageImage/pexels-ozgomz-7566888.webp",
    },
    {
      title: "Cairo History",
      price: "$999",
      img: "/Cairo/pexels-ozgomz-7566890.webp",
    },
    {
      title: "Nubian Adventure",
      price: "$1,299",
      img: "/HomePageImage/pexels-radwa-magdy-1718930-21668633.webp",
    },
    {
      title: "Red Sea Escape",
      price: "$1,599",
      img: "/HomePageImage/pexels-oualid-soussi-2150533856-35050672.webp",
    },
    {
      title: "Alexandria Heritage",
      price: "$1,099",
      img: "/HomePageImage/pexels-spencer-4356143.webp",
    },
  ];

  const [page, setPage] = useState(0);
  const itemsPerPage = 3;
  const totalPages = Math.ceil(packages.length / itemsPerPage);

  // ✅ تغيير الصفحة أوتوماتيكياً كل 6 ثواني
  useEffect(() => {
    const interval = setInterval(() => {
      setPage((prev) => (prev + 1) % totalPages);
    }, 6000);
    return () => clearInterval(interval);
  }, [totalPages]);

  const currentPackages = packages.slice(
    page * itemsPerPage,
    page * itemsPerPage + itemsPerPage,
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2 }}
      className="w-full max-w-3xl mt-2"
    >
      {/* العنوان */}
      <h2 className="hero-title text-2xl md:text-3xl mb-8 uppercase">
        Enjoy with us
      </h2>

      {/* الكروت مع أنيميشن تبديل */}
      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            className="grid grid-cols-1 md:grid-cols-3 gap-8"
          >
            {currentPackages.map((pkg) => (
              <motion.div
                key={pkg.title}
                whileHover={{ scale: 1.05 }}
                transition={{ type: "spring", stiffness: 200 }}
                className={`${theme.card} group relative overflow-hidden shadow-lg hover:shadow-2xl`}
              >
                <img
                  src={pkg.img}
                  alt={pkg.title}
                  className="w-full h-80 object-cover transform group-hover:scale-110 transition duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/30 to-transparent"></div>
                <div className="absolute bottom-0 p-6 text-left">
                  <h3
                    style={{ fontWeight: "700" }}
                    className={`hero-title  drop-shadow-md`}
                  >
                    {pkg.title}
                  </h3>
                  <p className="hero-p font-semibold mt-2">From {pkg.price}</p>
                  <button
                    className="w-full rounded-[9px] px-4 py-2 border-r-4 
             bg-transparent backdrop-blur-md 
             border border-[#C2A878] 
             text-[#C2A878] font-semibold tracking-wide
             hover:bg-[#C2A878]/20 hover:text-white 
             transition-all duration-300 shadow-lg cursor-pointer mt-4"
             style={{borderRadius:"8px"}}
                  >
                    Book Now
                  </button>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
