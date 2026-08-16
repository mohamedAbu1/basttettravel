"use client";
import { useTrip } from "@/context/TripContext";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { useEffect } from "react";
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
import { useTranslation } from "react-i18next";
import TripExclusions from "./components/TripExclusions";

export default function TripPage({ params }) {
  const { id } = params;
  const { trips, fetchTrips, getTripById } = useTrip();
  const { lang } = useLanguage();
  const { theme, themeName } = useTheme();
  const { userData, chatUser, setChatUser } = useAuth();
  const { purchases } = usePurchase();
  const { t } = useTranslation("header");

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

  return (
    <main className={`min-h-screen relative ${theme.text}`}>
      <Header />
      <EgyptianBackground />

      {/* ✅ تصميم للشاشات الكبيرة */}
      <div
        className="hidden lg:grid max-w-7xl mx-auto pt-29 p-6 relative z-10 gap-8 
                   grid-cols-1 lg:grid-cols-2 auto-rows-min"
      >
        {/* العنوان */}
        <div className="col-span-1 lg:col-span-3">
          <TripHeader trip={trip} lang={lang} theme={theme} />
        </div>

        {/* معلومات الرحلة */}
        <div className="col-span-3 flex flex-row gap-8">
          <div className="col-span-3 flex flex-col gap-2.5">
            <TripInfo trip={trip} lang={lang} theme={theme} themeName={themeName} />
            <TripCities trip={trip} lang={lang} theme={theme} themeName={themeName} />
            <TripCategories trip={trip} lang={lang} theme={theme} themeName={themeName} />
          </div>
          <TripVideo trip={trip} lang={lang} theme={theme} />
          <AccessibilityInfo theme={themeName} themeName={themeName} />
        </div>

        {/* المميزات */}
        <div className="col-span-4 flex flex-row gap-8">
          <TripIncludes trip={trip} lang={lang} theme={theme} themeName={themeName} />
          <TripExclusions trip={trip} lang={lang} theme={theme} themeName={themeName} />
        </div>

        {/* الجدول */}
        <div className="col-span-1 lg:col-span-3">
          <TripItinerary trip={trip} lang={lang} theme={theme} themeName={themeName} />
        </div>

        {/* المراجعات + الأزرار */}
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
                  {t("PrivacyPolicy")}
                </Link>
              </>
            ))}
        </div>
      </div>

      {/* ✅ تصميم احترافي للموبايل */}
      <div className="block lg:hidden p-4 pt-29 space-y-6">
        <TripHeader trip={trip} lang={lang} theme={theme} />
        <TripInfo trip={trip} lang={lang} theme={theme} themeName={themeName} />
        <TripCities trip={trip} lang={lang} theme={theme} themeName={themeName} />
        <TripCategories trip={trip} lang={lang} theme={theme} themeName={themeName} />
        <TripIncludes trip={trip} lang={lang} theme={theme} themeName={themeName} />
        <TripExclusions trip={trip} lang={lang} theme={theme} themeName={themeName} />
        <TripItinerary trip={trip} lang={lang} theme={theme} themeName={themeName} />
        <TripReviews trip={trip} lang={lang} theme={theme} />

        {/* أزرار واضحة وكبيرة */}
        {userData &&
          userData?.role !== "ADMIN" &&
          (hasActivePurchase ? (
            <CancelButton trip={trip} theme={theme} />
          ) : (
            <button className="w-full py-4 bg-[#C2A878] text-white font-bold rounded-lg shadow-md">
              شراء الرحلة
            </button>
          ))}
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
