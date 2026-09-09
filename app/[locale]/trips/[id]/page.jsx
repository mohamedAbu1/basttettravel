"use client";
import dynamic from "next/dynamic";
import { useTrip } from "@/context/TripContext";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { useEffect } from "react";
const Footer = dynamic(() => import("@/components/Footer/Footer"), { ssr: false });
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
const TripReviews = dynamic(() => import("./components/TripReviews"), { ssr: false });
const ChatWidget = dynamic(() => import("@/components/layout/ChatWidget"), { ssr: false });
import { useAuth } from "@/context/AuthContext";
import PurchaseButton from "./components/PurchaseButton";
import CancelButton from "./components/CancelButton";
import { usePurchase } from "@/context/PurchaseContext";
import AccessibilityInfo from "./components/components/AccessibilityInfo";
const AdminChatWindow = dynamic(
  () => import("@/components/layout/AdminChatWindow"),
  { ssr: false },
);
import Link from "next/link";
import { useTranslation } from "react-i18next";
import TripExclusions from "./components/TripExclusions";
const CalendarWidget = dynamic(() => import("./components/CalendarWidget"), { ssr: false });
import { useMessages } from "@/context/MessageContext";

export default function TripPage({ params }) {
  const { id } = params;
  const { trips, fetchTrips, getTripById } = useTrip();
  const { lang } = useLanguage();
  const { theme, themeName } = useTheme();
  const { userData, chatUser, setChatUser } = useAuth();
  const { purchases } = usePurchase();
  const { t } = useTranslation("header");
  const { t: commonT } = useTranslation("common");
  const { messages  } = useMessages();

  useEffect(() => {
    if (!trips.length) {
      fetchTrips();
    }
  }, []);

  const trip = getTripById(id);
  if (!trip) {
    return <p className={`${theme.text}`}>{commonT("tripNotFound")}</p>;
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
            <TripCities
              trip={trip}
              lang={lang}
              theme={theme}
              themeName={themeName}
            />
            <TripCategories
              trip={trip}
              lang={lang}
              theme={theme}
              themeName={themeName}
            />
            <AccessibilityInfo theme={themeName} themeName={themeName} />
          </div>
          <CalendarWidget trip={trip} id={id} />
        </div>

        {/* المميزات */}
        <div className="col-span-4 flex flex-row gap-8">
          <TripIncludes
            trip={trip}
            lang={lang}
            theme={theme}
            themeName={themeName}
          />
          <TripExclusions
            trip={trip}
            lang={lang}
            theme={theme}
            themeName={themeName}
          />
        </div>

        {/* الجدول */}
        <div className="col-span-1 lg:col-span-3">
          <TripItinerary
            trip={trip}
            lang={lang}
            theme={theme}
            themeName={themeName}
          />
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
        <TripCities
          trip={trip}
          lang={lang}
          theme={theme}
          themeName={themeName}
        />
        <TripCategories
          trip={trip}
          lang={lang}
          theme={theme}
          themeName={themeName}
        />
        <TripIncludes
          trip={trip}
          lang={lang}
          theme={theme}
          themeName={themeName}
        />
        <TripExclusions
          trip={trip}
          lang={lang}
          theme={theme}
          themeName={themeName}
        />

        <TripItinerary
          trip={trip}
          lang={lang}
          theme={theme}
          themeName={themeName}
        />
        <CalendarWidget trip={trip} id={id} />

        <TripReviews trip={trip} lang={lang} theme={theme} />

        {/* أزرار واضحة وكبيرة */}
        {userData &&
          userData?.role !== "ADMIN" &&
          (hasActivePurchase ? <CancelButton trip={trip} theme={theme} /> : "")}
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
