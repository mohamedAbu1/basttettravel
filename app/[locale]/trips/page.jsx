"use client";
import React, { useState, useEffect } from "react";
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
import { useTrip } from "@/context/TripContext";
import { useCitiesCategories } from "@/context/CitiesCategoriesContext";
import { useQueryFilters } from "@/context/QueryContext";
import { useRouter } from "next/navigation";
import CurrencySelector from "../../../components/layout/CurrencySelector";
import AdminDashboardButton from "@/components/layout/AdminDashboardButton";
import AdminChatWindow from "@/components/layout/AdminChatWindow";
import { usePurchase } from "@/context/PurchaseContext";
export default function TripsPage() {
  const { trips, fetchTrips, loadingTrips } = useTrip();
  const {
    cities: allCities,
    categories: allCategories,
    loading,
  } = useCitiesCategories();
  const { lang } = useLanguage();
  const meta = tripsMetadata[lang] || tripsMetadata.en;
  const { userData, chatUser, setChatUser } = useAuth();
  const router = useRouter();
  const { purchases } = usePurchase(); // ✅ استدعاء الدالة
  const [currentPage, setCurrentPage] = useState(1);
  const [cardStyle, setCardStyle] = useState("vertical");
  const tripsPerPage = cardStyle === "vertical" ? 9 : 8;
  const [search, setSearch] = useState("");
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  const { city, category, group_price, popular } = useQueryFilters();

  useEffect(() => {
    fetchTrips();
  }, []);

  useEffect(() => {
    const checkScreen = () => setIsSmallScreen(window.innerWidth <= 1024);
    checkScreen();
    window.addEventListener("resize", checkScreen);
    return () => window.removeEventListener("resize", checkScreen);
  }, []);

  if (loadingTrips)
    return <p className="text-center text-gray-500">Loading trips...</p>;
  // فلترة الرحلات
  const filteredTrips = trips.filter((trip) => {
    const lowerSearch = search.trim().toLowerCase();

    const matchesSearch =
      !lowerSearch ||
      (trip.title?.[lang] &&
        trip.title[lang].toLowerCase().includes(lowerSearch));

    const tripCities =
      trip.cities
        ?.map((c) => {
          let nameObj;
          try {
            nameObj =
              typeof c?.name === "string" ? JSON.parse(c.name) : c?.name;
          } catch {
            nameObj = {};
          }
          return typeof nameObj === "object" ? nameObj.en || "" : "";
        })
        .filter((n) => n !== "") || [];

    const matchesCity =
      !city || city === "all"
        ? true
        : Array.isArray(city)
          ? tripCities.some((c) =>
              city.some((x) => c.toLowerCase() === x.toLowerCase()),
            )
          : tripCities.some((c) => c.toLowerCase() === city.toLowerCase());

    const tripCategories =
      trip.categories
        ?.map((cat) => {
          let nameObj;
          try {
            nameObj =
              typeof cat?.name === "string" ? JSON.parse(cat.name) : cat?.name;
          } catch {
            nameObj = {};
          }
          return typeof nameObj === "object" ? nameObj.en || "" : "";
        })
        .filter((n) => n !== "") || [];

    const matchesCategory =
      !category || category === "all"
        ? true
        : Array.isArray(category)
          ? tripCategories.some((c) =>
              category.some((x) => c.toLowerCase() === x.toLowerCase()),
            )
          : tripCategories.some(
              (c) => c.toLowerCase() === category.toLowerCase(),
            );

    const ranges = {
      Economy: { min: 0, max: 199 },
      Standard: { min: 200, max: 599 },
      Luxury: { min: 600, max: Infinity },
    };
    const selectedRange = ranges[group_price];

    const matchesPrice =
      group_price === "All" || !group_price
        ? true
        : selectedRange
          ? trip.group_price >= selectedRange.min &&
            trip.group_price <= selectedRange.max
          : true;

    return matchesSearch && matchesCity && matchesCategory && matchesPrice;
  });

  // ✅ لو popular مفعّل → اربط المشتريات بالرحلات بدون تكرار
  // نفترض إن عندك purchases = [ { trip_id: "...", ... }, { trip_id: "...", ... } ]

  let finalTrips;
  if (popular) {
    // نجمع عدد المشتريات لكل trip_id
    const purchaseMap = new Map();
    purchases.forEach((p) => {
      const currentCount = purchaseMap.get(p.trip_id) || 0;
      purchaseMap.set(p.trip_id, currentCount + 1);
    });

    // نربط الرحلات بالمشتريات مرة واحدة فقط
    finalTrips = trips.map((trip) => {
      const count = purchaseMap.get(trip.id) || 0;
      return { ...trip, purchase_count: count };
    });
  } else {
    finalTrips = filteredTrips;
  }

  // تقسيم الصفحات
  const indexOfLastTrip = currentPage * tripsPerPage;
  const indexOfFirstTrip = indexOfLastTrip - tripsPerPage;
  const currentTrips = finalTrips.slice(indexOfFirstTrip, indexOfLastTrip);
  const totalPages = Math.ceil(finalTrips.length / tripsPerPage);

  return (
    <>
      <Head>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
        <meta name="keywords" content={meta.keywords} />
        <link rel="canonical" href="https://basttettravel.com/" />
        <img
          src="/Nile_Cruise/Dahabeya-program-SOBEK-900x600.webp"
          alt="Nile Cruise with Basttet Travel"
        />
      </Head>

      <main className="relative flex flex-col min-h-screen justify-center items-center mt-7">
        <EgyptianBackground />
        <Header />

        {isSmallScreen ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, rotateY: 90 }}
            animate={{ opacity: 1, scale: 1, rotateY: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="flex flex-col items-center justify-center h-[70vh] text-center gap-6"
          >
            <h2 className="text-4xl font-extrabold text-[var(--primary-color)] drop-shadow-lg">
              🚫 This page is not available on phones.
            </h2>
            <p className="text-lg text-gray-600">
              You should go to the homepage to follow your trips
            </p>
            <button onClick={() => router.push("/")} className="btn-theme">
              Return to home page
            </button>
          </motion.div>
        ) : (
          <motion.section
            style={{ marginTop: "105px", paddingBottom: "20px" }}
            className="container flex flex-1 gap-6 px-6 relative z-10"
          >
            <div className="w-1/4 max-h-fit bg-[url('/HomePageImage/427421070_8ee61396-b440-41b5-af8d-619e23dd51b5.svg')] bg-cover bg-center rounded-2xl">
              <TripsFilter
                allCities={allCities}
                allCategories={allCategories}
                loading={loading}
              />
            </div>

            <div className="flex-1 flex flex-col gap-6">
              <TripsSearch
                search={search}
                setSearch={setSearch}
                cardStyle={cardStyle}
                setCardStyle={setCardStyle}
              />
              <TripsGrid trips={currentTrips} cardStyle={cardStyle} />

              {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-4">
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setCurrentPage(i + 1);
                        window.scrollTo({ top: 30, behavior: "smooth" });
                      }}
                      className={`px-3 py-1 rounded-lg font-bold cursor-pointer transition ${
                        currentPage === i + 1
                          ? "bg-[var(--primary-color)] text-white"
                          : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.section>
        )}

        <Footer />
        <SignUpButton />
        <LoginModal />
        {userData && <ChatWidget />}
        {userData && <AdminDashboardButton />}
        {chatUser && (
          <AdminChatWindow
            user={chatUser}
            admin={userData}
            messages={messages}
            onClose={() => setChatUser(null)}
          />
        )}
        <CurrencySelector />
      </main>
    </>
  );
}
