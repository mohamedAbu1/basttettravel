"use client";

import dynamic from "next/dynamic";
import { use, useEffect } from "react";
import { useTrip } from "@/context/TripContext";
import { useLanguage } from "@/context/LanguageContext";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import { usePurchase } from "@/context/PurchaseContext";
import { useMessages } from "@/context/MessageContext";
import Header from "@/components/header/Header";
import Footer from "@/components/Footer/Footer";
import EgyptianBackground from "@/components/layout/EgyptianBackground";
import LoginModal from "@/components/home/components/LoginModal";
import SignUpButton from "@/components/home/components/SignUpButton";
import TripHeader from "./components/TripHeader";
import TripCities from "./components/TripCities";
import TripCategories from "./components/TripCategories";
import TripIncludes from "./components/TripIncludes";
import TripExclusions from "./components/TripExclusions";
import TripItinerary from "./components/TripItinerary";
import TripInfo from "./components/TripInfo";
import CancelButton from "./components/CancelButton";
import AccessibilityInfo from "./components/components/AccessibilityInfo";
import TripBookingBenefits from "./components/TripBookingBenefits";
import TripFAQ from "./components/TripFAQ";
const TripReviews = dynamic(() => import("./components/TripReviews"), { ssr: false });
const ChatWidget = dynamic(() => import("@/components/layout/ChatWidget"), { ssr: false });
const AdminChatWindow = dynamic(() => import("@/components/layout/AdminChatWindow"), { ssr: false });
const CalendarWidget = dynamic(() => import("./components/CalendarWidget"), { ssr: false });

export default function TripPage({ params }) {
  const { id } = use(params);
  const { trips, fetchTrips, getTripById } = useTrip();
  const { lang } = useLanguage();
  const { theme, themeName } = useTheme();
  const { userData, chatUser, setChatUser } = useAuth();
  const { purchases } = usePurchase();
  const { messages } = useMessages();

  useEffect(() => {
    if (!trips.length) fetchTrips();
  }, [trips.length, fetchTrips]);

  const trip = getTripById(id);
  if (!trip) {
    return (
      <main className="flex min-h-screen items-center justify-center p-8 text-center">
        <p className={theme.text}>This trip could not be found.</p>
      </main>
    );
  }

  const hasActivePurchase = purchases.some(
    (purchase) =>
      purchase.trip_id === trip.id &&
      purchase.user_id === userData?.id &&
      purchase.status !== "Cancelled",
  );

  return (
    <main className={"relative min-h-screen " + theme.text}>
      <Header />
      <EgyptianBackground />

      <div className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-16 pt-28 sm:px-6 lg:px-8">
        <TripHeader trip={trip} lang={lang} />

        <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
          <div className="min-w-0 space-y-8">
            <TripInfo trip={trip} lang={lang} />

            <TripBookingBenefits />

            <div className="grid gap-6 md:grid-cols-2">
              <TripCities trip={trip} lang={lang} theme={theme} themeName={themeName} />
              <TripCategories trip={trip} lang={lang} theme={theme} themeName={themeName} />
            </div>

            <AccessibilityInfo theme={themeName} themeName={themeName} />

            <div className="grid gap-6 md:grid-cols-2">
              <TripIncludes trip={trip} lang={lang} theme={theme} themeName={themeName} />
              <TripExclusions trip={trip} lang={lang} theme={theme} themeName={themeName} />
            </div>

            <TripItinerary trip={trip} lang={lang} theme={theme} themeName={themeName} />
            <TripReviews trip={trip} lang={lang} theme={theme} />
            <TripFAQ />

            {userData && userData.role !== "ADMIN" && hasActivePurchase && (
              <CancelButton trip={trip} theme={theme} />
            )}
          </div>

          <aside className="lg:sticky lg:top-24">
            <div className="mb-3 rounded-2xl border border-[#d4b56f]/30 bg-black/10 px-5 py-4">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[#d4b56f]">Plan your experience</p>
              <p className={"mt-1 text-sm " + theme.subText}>Choose your travelers and preferred dates to see availability.</p>
            </div>
            <CalendarWidget trip={trip} id={id} />
          </aside>
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
