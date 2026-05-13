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

export default function TripPage({ params }) {
  const { id } = use(params);
  const { trips, fetchTrips, getTripById, loadingTrips } = useTrip();
  const { lang } = useLanguage();
  const { theme, themeName } = useTheme();
  const { user } = useAuth();
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
      p.user_id === user?.id &&
      p.status !== "Cancelled",
  );
console.log(trip)
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
          {user &&
            (hasActivePurchase ? (
              <CancelButton trip={trip} theme={theme} />
            ) : (
              <PurchaseButton trip={trip} theme={theme} />
            ))}
        </div>
      </div>

      <Footer />
      <SignUpButton />
      <LoginModal />
      {user && <ChatWidget />}
    </main>
  );
}
