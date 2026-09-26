"use client";
import dynamic from "next/dynamic";
import React, { useState, useEffect } from "react";
import TripsFilter from "@/components/trips/TripsFilter";
import TripsSearch from "@/components/trips/TripsSearch";
import TripsGrid from "@/components/trips/TripsGrid";
import Header from "@/components/header/Header";
const Footer = dynamic(() => import("@/components/Footer/Footer"), { ssr: false });
import EgyptianBackground from "@/components/layout/EgyptianBackground";
import LoginModal from "@/components/home/components/LoginModal";
import SignUpButton from "@/components/home/components/SignUpButton";
import { motion } from "framer-motion";
const ChatWidget = dynamic(() => import("@/components/layout/ChatWidget"), { ssr: false });
import { useAuth } from "@/context/AuthContext";
import { useLanguage } from "@/context/LanguageContext";
import { useTrip } from "@/context/TripContext";
import { useCitiesCategories } from "@/context/CitiesCategoriesContext";
import { useQueryFilters } from "@/context/QueryContext";
import { useRouter } from "next/navigation";
const CurrencySelector = dynamic(
  () => import("../../../components/layout/CurrencySelector"),
  { ssr: false },
);
const AdminDashboardButton = dynamic(
  () => import("@/components/layout/AdminDashboardButton"),
  { ssr: false },
);
const AdminChatWindow = dynamic(
  () => import("@/components/layout/AdminChatWindow"),
  { ssr: false },
);
import { usePurchase } from "@/context/PurchaseContext";
import { useMessages } from "@/context/MessageContext";
import { useTranslation } from "react-i18next";
export default function TripsPage() {
  const { trips, fetchTrips, loadingTrips } = useTrip();
  const {
    cities: allCities,
    categories: allCategories,
    loading,
  } = useCitiesCategories();
  const { lang } = useLanguage();
  const { userData, chatUser, setChatUser } = useAuth();
  const { purchases } = usePurchase(); // ✅ استدعاء الدالة
  const [currentPage, setCurrentPage] = useState(1);
  const [cardStyle, setCardStyle] = useState("vertical");
  const tripsPerPage = cardStyle === "vertical" ? 9 : 8;
  const [search, setSearch] = useState("");
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const { messages  } = useMessages();
  const { t: commonT } = useTranslation("common");
  const { t: uiT } = useTranslation("ui");

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

  useEffect(() => {
    setCurrentPage(1);
  }, [search, city, category, group_price, popular, cardStyle]);

  if (loadingTrips)
    return (
      <main className="public-page trips-loading-state" aria-live="polite" aria-busy="true">
        <div className="trips-loading-card">
          <span className="trips-loading-mark" aria-hidden="true">𓂀</span>
          <h1>{commonT("loadingTrips")}</h1>
          <p>{uiT("preparingJourneys")}</p>
          <span className="trips-loading-bar" aria-hidden="true" />
        </div>
      </main>
    );
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
    finalTrips = filteredTrips.map((trip) => {
      const count = purchaseMap.get(trip.id) || 0;
      return { ...trip, purchase_count: count };
    }).sort((a, b) => b.purchase_count - a.purchase_count);
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

      <main className="trips-page public-page relative flex flex-col min-h-screen justify-center items-center mt-7">
        <EgyptianBackground />
        <Header />

       
          <motion.section
            className="trips-content container flex flex-1 gap-6 px-6 relative z-10"
          >
            <div className="trips-filter-shell hidden lg:flex w-1/4 max-h-fit bg-[url('/HomePageImage/427421070_8ee61396-b440-41b5-af8d-619e23dd51b5.svg')] bg-cover bg-center rounded-2xl">
              <TripsFilter
                allCities={allCities}
                allCategories={allCategories}
                loading={loading}
              />
            </div>

            <div className="flex-1 flex flex-col gap-6">
              <details className="lg:hidden card-theme trips-mobile-filter rounded-xl p-4">
                <summary className="cursor-pointer font-semibold">{uiT("filters")}</summary>
                <div className="pt-4">
                  <TripsFilter allCities={allCities} allCategories={allCategories} loading={loading} />
                </div>
              </details>
              <TripsSearch
                search={search}
                setSearch={setSearch}
                cardStyle={cardStyle}
                setCardStyle={setCardStyle}
              />
              <TripsGrid trips={currentTrips} cardStyle={cardStyle} />

              {!currentTrips.length && (
                <div className="card-theme rounded-xl p-10 text-center" role="status">
                  <h2 className="text-xl font-semibold">{uiT("noTripsFound")}</h2>
                  <p className="mt-2 opacity-75">{uiT("changeSearchFilters")}</p>
                </div>
              )}

              {totalPages > 1 && (
                <nav className="trips-pagination mt-4" aria-label={uiT("tripPages")}>
                  <button type="button" disabled={currentPage === 1} onClick={() => { setCurrentPage((page) => Math.max(1, page - 1)); window.scrollTo({ top: 30, behavior: "smooth" }); }}>
                    {uiT("previous")}
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => (
                    <button
                      type="button"
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
                      aria-current={currentPage === i + 1 ? "page" : undefined}
                    >
                      {i + 1}
                    </button>
                  ))}
                  <button type="button" disabled={currentPage === totalPages} onClick={() => { setCurrentPage((page) => Math.min(totalPages, page + 1)); window.scrollTo({ top: 30, behavior: "smooth" }); }}>
                    {uiT("next")}
                  </button>
                </nav>
              )}
            </div>
          </motion.section>

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
