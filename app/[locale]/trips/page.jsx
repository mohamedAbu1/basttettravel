/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/purity */
"use client";
import React, { useState } from "react";
import TripsFilter from "@/components/trips/TripsFilter";
import TripsSearch from "@/components/trips/TripsSearch";
import TripsGrid from "@/components/trips/TripsGrid";
import Header from "@/components/header/Header";
import Footer from "@/components/Footer/Footer";
import EgyptianBackground from "@/components/layout/EgyptianBackground";
import LoginModal from "@/components/home/components/LoginModal";
import SignUpButton from "@/components/home/components/SignUpButton";
import { motion } from "framer-motion";
import ChatWidget from "@/components/layout/ChatWidget";
import { useAuth } from "@/context/AuthContext";
import Head from "next/head";
import { useLanguage } from "@/context/LanguageContext";
import { tripsMetadata } from "@/lib/metadata/trips";
import { useTheme } from "@/context/ThemeContext";

export default function TripsPage() {
  const trips = [
    {
      title: "Nile Cruise",
      city: "Cairo",
      category: "Cruise",
      price: 500,
      popular: true,
      img: "/HomePageImage/pexels-radwa-magdy-1718930-21668633.webp",
    },
    {
      title: "Desert Safari",
      city: "Siwa",
      category: "Adventure",
      price: 300,
      popular: false,
      img: "/HomePageImage/pexels-ozgomz-7566890.webp",
    },
    {
      title: "Red Sea Diving",
      city: "Hurghada",
      category: "Diving",
      price: 700,
      popular: true,
      img: "/HomePageImage/pexels-ozgomz-7566888.webp",
    },
    {
      title: "Nile Cruise",
      city: "Cairo",
      category: "Cruise",
      price: 500,
      popular: true,
      img: "/HomePageImage/pexels-oualid-soussi-2150533856-35050672.webp",
    },
    {
      title: "Desert Safari",
      city: "Siwa",
      category: "Adventure",
      price: 300,
      popular: false,
      img: "/HomePageImage/pexels-furknsaglam-1596977-21348185.webp",
    },
    {
      title: "Red Sea Diving",
      city: "Hurghada",
      category: "Diving",
      price: 700,
      popular: true,
      img: "/HomePageImage/pexels-yasmine-qasem-1054896-2034684.webp",
    },
    {
      title: "Luxor Temples",
      city: "Luxor",
      category: "Historical",
      price: 400,
      popular: true,
      img: "/HomePageImage/luxor-temple.webp",
    },
    {
      title: "Aswan Tour",
      city: "Aswan",
      category: "Historical",
      price: 350,
      popular: false,
      img: "/HomePageImage/aswan-tour.webp",
    },
    // 🔥 أضف المزيد من الرحلات هنا للتجربة (مثلاً 20 أو 30 رحلة)
  ];

  const { lang } = useLanguage();
  const meta = tripsMetadata[lang] || tripsMetadata.en;
  const { user } = useAuth();
  const { theme, themeName } = useTheme();

  const [currentPage, setCurrentPage] = useState(1);
  const [cardStyle, setCardStyle] = useState("vertical");
  const tripsPerPage = 9; // ✅ ثابت: 9 رحلات في كل صفحة
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({
    city: "",
    category: "",
    price: "",
    popular: false,
  });

  // ✅ فلترة الرحلات
  const filteredTrips = trips.filter((trip) => {
    const lowerSearch = search.trim().toLowerCase();

    const matchesSearch =
      !lowerSearch ||
      (trip.title && trip.title.toLowerCase().includes(lowerSearch)) ||
      (trip.city && trip.city.toLowerCase().includes(lowerSearch)) ||
      (trip.category && trip.category.toLowerCase().includes(lowerSearch));

    const matchesCity = filters.city ? trip.city === filters.city : true;
    const matchesCategory = filters.category
      ? trip.category === filters.category
      : true;
    const matchesPrice = filters.price
      ? trip.price <= parseInt(filters.price)
      : true;
    const matchesPopular = filters.popular ? trip.popular : true;

    return (
      matchesSearch &&
      matchesCity &&
      matchesCategory &&
      matchesPrice &&
      matchesPopular
    );
  });

  // ✅ الباجينيشن
  const indexOfLastTrip = currentPage * tripsPerPage;
  const indexOfFirstTrip = indexOfLastTrip - tripsPerPage;
  const currentTrips = filteredTrips.slice(indexOfFirstTrip, indexOfLastTrip);
  const totalPages = Math.ceil(filteredTrips.length / tripsPerPage);
  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const staggerContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.2 } },
  };

  return (
    <>
      <Head>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
        <meta name="keywords" content={meta.keywords} />
      </Head>
      <main className="relative flex flex-col min-h-screen justify-center items-center">
        <EgyptianBackground />
        <Header />

        {/* المحتوى الرئيسي */}
        <motion.section
          style={{ marginTop: "105px", paddingBottom: "20px" }}
          className={`container flex flex-1 gap-6 px-6 relative z-10`}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          variants={staggerContainer}
        >
          {/* الفلتر */}
          <motion.div variants={fadeUp} className="w-1/4">
            <TripsFilter filters={filters} setFilters={setFilters} />
          </motion.div>

          {/* البحث + الرحلات */}
          <motion.div variants={fadeUp} className="flex-1 flex flex-col gap-6">
            <TripsSearch
              search={search}
              setSearch={setSearch}
              cardStyle={cardStyle}
              setCardStyle={setCardStyle}
            />
            <TripsGrid
              trips={currentTrips}
              cardStyle={cardStyle}
              search={search}
            />

            {/* الباجينيشن */}
            {totalPages && (
              <motion.div
                variants={fadeUp}
                className="flex justify-center gap-2 mt-4"
              >
                {Array.from({ length: totalPages }, (_, i) => (
                  <button
                    key={i}
                    onClick={() => setCurrentPage(i + 1)}
                    className="rounded-[4px] px-2 py-1 
             bg-transparent backdrop-blur-md 
             border border-[#C2A878] 
             text-[#C2A878] font-semibold tracking-wide
             hover:bg-[#C2A878]/20 hover:text-white 
             transition-all duration-300 shadow-lg cursor-pointer"
                  >
                    {i + 1}
                  </button>
                ))}
              </motion.div>
            )}
          </motion.div>
        </motion.section>

        <Footer />
        <SignUpButton />
        <LoginModal />
        {user && <ChatWidget />}
      </main>
    </>
  );
}
