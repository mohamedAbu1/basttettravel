"use client";
import { useTrip } from "@/context/TripContext";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { useEffect } from "react";
import { use } from "react";
import Footer from "@/components/Footer/Footer";
import Header from "@/components/header/Header";
import EgyptianBackground from "@/components/layout/EgyptianBackground";
import LoginModal from "@/components/home/components/LoginModal";
import SignUpButton from "@/components/home/components/SignUpButton";
import TripHeader from "./components/TripHeader";
import TripCities from "./components/TripCities";
import TripCategories from "./components/TripCategories";
import TripIncludes from "./components/TripIncludes";
import TripItinerary from "./components/TripItinerary";
import TripInfo from "./components/TripInfo";
import TripReviews from "./components/TripReviews";
import ChatWidget from "@/components/layout/ChatWidget";
import { useAuth } from "@/context/AuthContext";
import PurchaseButton from "./components/PurchaseButton";
import CancelButton from "./components/CancelButton";
import TripVideo from "./components/TripVideo";
import { usePurchase } from "@/context/PurchaseContext";
import AccessibilityInfo from "./components/components/AccessibilityInfo";
import AdminChatWindow from "@/components/layout/AdminChatWindow";
import Link from "next/link";

export default function TripPage({ params }) {
  const { id } = use(params);
  const { trips, fetchTrips, getTripById, loadingTrips } = useTrip();
  const { lang } = useLanguage();
  const { theme, themeName } = useTheme();
  const { userData, chatUser, setChatUser } = useAuth();
  const { purchases } = usePurchase();

  useEffect(() => {
    if (!trips.length) {
      fetchTrips();
    }
  }, []);

  const trip = getTripById(id);
  if (!trip) {
    return <p className={`${theme.text}`}>Trip not found</p>;
  }

  const hasActivePurchase = purchases.some(
    (p) =>
      p.trip_id === trip.id &&
      p.user_id === userData?.id &&
      p.status !== "Cancelled",
  );

  const localizedTrip = {
    ...trip,
    title: trip.title?.[lang] || trip.title?.en,
    description: trip.description?.[lang] || trip.description?.en,

    // ✅ المدن
    cities: Array.isArray(trip.cities)
      ? trip.cities.map((c) =>
          typeof c?.name === "object"
            ? c.name[lang] || c.name.en || Object.values(c.name)[0]
            : c?.name || c,
        )
      : trip.cities,

    // ✅ التصنيفات
    categories: Array.isArray(trip.categories)
      ? trip.categories.map((cat) =>
          typeof cat?.name === "object"
            ? cat.name[lang] || cat.name.en || Object.values(cat.name)[0]
            : cat?.name || cat,
        )
      : trip.categories,

    // ✅ الباقي زي ما هو
    includes: Array.isArray(trip.includes)
      ? trip.includes.map((i) =>
          typeof i === "object" ? i?.[lang] || i?.en : i,
        )
      : trip.includes,

    itinerary: Array.isArray(trip.itinerary)
      ? trip.itinerary.map((day) => ({
          ...day,
          activities: Array.isArray(day.activities)
            ? day.activities.map((act) =>
                typeof act === "object" ? act?.[lang] || act?.en : act,
              )
            : day.activities,
        }))
      : trip.itinerary,
  };
  console.log(localizedTrip);
  return (
    <main className={`min-h-screen relative  ${theme.text}`}>
      <Header />
      <EgyptianBackground />

      <div
        style={{ paddingTop: "110px" }}
        className="max-w-7xl mx-auto pt-9 p-6 relative z-10 grid gap-8 
             grid-cols-1 lg:grid-cols-2 auto-rows-min"
      >
        <EgyptianBackground />

        {/* ✅ العنوان */}
        <div className="col-span-1 lg:col-span-3">
          <TripHeader trip={trip} lang={lang} theme={theme} />
        </div>

        {/* ✅ معلومات الرحلة */}
        <div className="col-span-3 flex flex-row gap-8">
          <div className="col-span-3 flex flex-col gap-2.5">
            <TripInfo trip={trip} lang={lang} theme={theme} />
            <TripCities trip={trip} lang={lang} theme={theme} />
            <TripCategories trip={trip} lang={lang} theme={theme} />
          </div>
          <TripVideo trip={trip} lang={lang} theme={theme} />
          <AccessibilityInfo theme={themeName} />
        </div>

        {/* ✅ المميزات */}
        <div className="col-span-3 flex flex-row gap-8">
          <TripIncludes trip={trip} lang={lang} theme={theme} />
        </div>

        {/* ✅ الجدول */}
        <div className="col-span-1 lg:col-span-3">
          <TripItinerary trip={trip} lang={lang} theme={theme} />
        </div>

        {/* ✅ المراجعات + الأزرار */}
        <div className="col-span-1 lg:col-span-3">
          <TripReviews trip={trip} lang={lang} theme={theme} />
          {userData &&
            userData?.role !== "ADMIN" &&
            (hasActivePurchase ? (
              <CancelButton trip={trip} theme={theme} />
            ) : (
              <>
                <PurchaseButton trip={trip} theme={theme} />
                <Link
                  href="/privacyPolicy"
                  className="fixed bottom-29 left-6 flex-row rounded-[8px] px-6 py-3 bg-transparent backdrop-blur-md 
                   border border-[#C2A878] text-[#C2A878] font-semibold tracking-wide 
                   hover:bg-[#C2A878]/20 hover:text-white transition-all duration-300 
                   shadow-lg cursor-pointer"
                >
                  Privacy Policy
                </Link>
              </>
            ))}
        </div>
      </div>

      <Footer />
      <SignUpButton />
      <LoginModal />
      {userData && <ChatWidget />}
      {chatUser && (
        <AdminChatWindow
          user={chatUser}
          admin={userData}
          messages={messages}
          onClose={() => setChatUser(null)}
        />
      )}
    </main>
  );
}
