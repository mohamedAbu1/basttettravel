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
// app/trips/page.tsx
export const metadata = {
  title: {
    ar: "رحلات Basttet Travel – اكتشف الأقصر وقنا",
    en: "Basttet Travel Trips – Explore Luxor & Qena",
    de: "Basttet Travel Reisen – Entdecken Sie Luxor & Qena",
    es: "Viajes Basttet Travel – Explora Luxor y Qena",
    fr: "Voyages Basttet Travel – Explorez Louxor & Qena",
    it: "Viaggi Basttet Travel – Esplora Luxor e Qena",
    zh: "Basttet Travel 旅行 – 探索卢克索和凯纳",
  },
  description: {
    ar: "اكتشف رحلات فريدة عبر مصر مع Basttet Travel. من رحلات النيل الفاخرة إلى مغامرات الصحراء.",
    en: "Discover curated trips across Egypt with Basttet Travel. Luxury Nile cruises and desert adventures await.",
    de: "Entdecken Sie kuratierte Reisen durch Ägypten mit Basttet Travel. Luxuriöse Nilkreuzfahrten und Wüstenabenteuer erwarten Sie.",
    es: "Descubre viajes seleccionados por Egipto con Basttet Travel. Cruceros de lujo por el Nilo y aventuras en el desierto.",
    fr: "Découvrez des voyages uniques en Égypte avec Basttet Travel. Croisières de luxe sur le Nil et aventures dans le désert.",
    it: "Scopri viaggi curati in Egitto con Basttet Travel. Crociere di lusso sul Nilo e avventure nel deserto.",
    zh: "与 Basttet Travel 一起探索埃及精选旅行。豪华尼罗河游轮和沙漠探险正等着你。",
  },
  keywords: {
    ar: "رحلات مصر, رحلات الأقصر, رحلات قنا, رحلات النيل",
    en: "Egypt trips, Luxor tours, Qena tours, Nile cruises",
    de: "Ägypten Reisen, Luxor Touren, Qena Touren, Nilkreuzfahrt",
    es: "Viajes Egipto, Tours Luxor, Tours Qena, Cruceros Nilo",
    fr: "Voyages Égypte, Louxor, Qena, Croisières Nil",
    it: "Viaggi Egitto, Tour Luxor, Tour Qena, Crociere Nilo",
    zh: "埃及旅行, 卢克索旅游, 凯纳旅游, 尼罗河游轮",
  },
};

export default function TripsPage() {
  const { trips, fetchTrips, loadingTrips } = useTrip();
  const {
    cities: allCities,
    categories: allCategories,
    loading,
  } = useCitiesCategories();
  const { lang } = useLanguage();
  const meta = tripsMetadata[lang] || tripsMetadata.en;
  const { user } = useAuth();
  const router = useRouter();

  const [currentPage, setCurrentPage] = useState(1);
  const [cardStyle, setCardStyle] = useState("vertical");
  const tripsPerPage = cardStyle === "vertical" ? 9 : 8;
  const [search, setSearch] = useState("");
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  const { city, category, price, popular } = useQueryFilters();

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

  const filteredTrips = trips.filter((trip) => {
    const lowerSearch = search.trim().toLowerCase();
    const matchesSearch =
      !lowerSearch ||
      (trip.title?.[lang] &&
        trip.title[lang].toLowerCase().includes(lowerSearch));

    const tripCities =
      trip.trip_cities
        ?.map((c) => c?.cities?.name?.[lang] || c?.cities?.name?.en || "")
        .filter((n) => n !== "") || [];

    const matchesCity =
      city === "all"
        ? true
        : Array.isArray(city)
        ? tripCities.some((c) =>
            city.map((x) => x.toLowerCase()).includes(c.toLowerCase())
          )
        : tripCities.some((c) => c.toLowerCase() === city.toLowerCase());

    const tripCategories =
      trip.trip_categories?.map((cat) => {
        const catObj = allCategories.find((c) => c.id === cat.category_id);
        return catObj?.name?.[lang] || catObj?.name?.en || catObj?.name;
      }) || [];
    const matchesCategory =
      category === "all"
        ? true
        : Array.isArray(category)
        ? tripCategories.some((c) => category.includes(c))
        : tripCategories.includes(category);

    const ranges = {
      Economy: { min: 0, max: 199 },
      Standard: { min: 200, max: 599 },
      Luxury: { min: 600, max: Infinity },
    };
    const selectedRange = ranges[price];
    const matchesPrice =
      price === "All" || !price
        ? true
        : selectedRange
        ? trip.price >= selectedRange.min && trip.price <= selectedRange.max
        : true;

    const matchesPopular = popular ? trip.isPopular : true;

    return (
      matchesSearch &&
      matchesCity &&
      matchesCategory &&
      matchesPrice &&
      matchesPopular
    );
  });

  const indexOfLastTrip = currentPage * tripsPerPage;
  const indexOfFirstTrip = indexOfLastTrip - tripsPerPage;
  const currentTrips = filteredTrips.slice(indexOfFirstTrip, indexOfLastTrip);
  const totalPages = Math.ceil(filteredTrips.length / tripsPerPage);

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
            <button
              onClick={() => router.push("/")}
              className="btn-theme"
            >
              Return to home page
            </button>
          </motion.div>
        ) : (
          <motion.section
            style={{ marginTop: "105px", paddingBottom: "20px" }}
            className="container flex flex-1 gap-6 px-6 relative z-10"
          >
            <div className="w-1/4">
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
        {user && <ChatWidget />}
        {user && <AdminDashboardButton />}
        <CurrencySelector />
      </main>
    </>
  );
}
