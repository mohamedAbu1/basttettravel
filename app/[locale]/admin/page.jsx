/* eslint-disable react-hooks/purity */
"use client";
import React, { useEffect, useMemo, useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import Sidebar from "./components/Sidebar";
import DashboardHome from "./components/DashboardHome";
import AddTrip from "./components/AddTrip";
import TripsList from "./components/TripsList";
import BookingsList from "./components/BookingsList";
import Reports from "./components/Reports";
import MessagesList from "./components/MessagesList";
import EditTrip from "./components/EditTrip"; 
import EgyptianBackground from "@/components/layout/EgyptianBackground";
import UsersSection from "./components/UsersSection";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "./context/AuthContext";
import CurrencyRates from "./components/CurrencyRates";

const symbols = ["𓂀","𓋹","𓆣","𓇼","𓇯","𓏏","𓎛","𓊽","𓃾","𓅓","𓈇","𓉐","𓊹","𓌙","𓍿","𓎟"];

export default function DashboardPage() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const { theme, themeName } = useTheme();
  const { userData, loading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale || "en";

  useEffect(() => {
    if (!loading && String(userData?.role).toUpperCase() !== "ADMIN") {
      router.replace(`/${locale}`);
    }
  }, [loading, locale, router, userData]);

  // Deterministic positions prevent server/client hydration mismatches.
  const floatingSymbols = useMemo(
    () =>
      Array.from({ length: 25 }, (_, index) => ({
        symbol: symbols[index % symbols.length],
        top: `${(index * 37) % 100}%`,
        left: `${(index * 61) % 100}%`,
        rotation: (index * 47) % 360,
      })),
    [],
  );

  if (loading || String(userData?.role).toUpperCase() !== "ADMIN") {
    return <main className="min-h-screen" aria-busy="true" />;
  }

  return (
    <main className={`relative flex min-h-screen ${theme.background} ${theme.text} overflow-hidden`}>
      <EgyptianBackground />

      <div className="absolute inset-0 pointer-events-none z-10">
        {floatingSymbols.map((item, i) => (
          <span
            key={i}
            className={`absolute ${
              themeName === "dark" ? "text-gray-700" : "text-[#c9a34a]"
            } opacity-20 text-7xl animate-pulse`}
            style={{
              top: item.top,
              left: item.left,
              transform: `rotate(${item.rotation}deg)`,
            }}
          >
            {item.symbol}
          </span>
        ))}
      </div>

      {/* Sidebar */}
      <Sidebar setActiveSection={setActiveSection} activeSection={activeSection} themeName={themeName} />

      {/* Main Content */}
      <section
        className={`flex-1 p-10 relative z-10 ${
          themeName === "dark" ? "bg-black" : "bg-white"
        } rounded-tl-3xl`}
      >
        {activeSection === "dashboard" && <DashboardHome themeName={themeName} />}
        {activeSection === "addTrip" && <AddTrip themeName={themeName} />}
        {activeSection === "trips" && <TripsList themeName={themeName} />}
        {activeSection === "editTrip" && <EditTrip themeName={themeName} />}
        {activeSection === "users" && <UsersSection themeName={themeName} />}
        {activeSection === "bookings" && <BookingsList themeName={themeName} />}
        {activeSection === "reports" && <Reports themeName={themeName} />}
        {activeSection === "messages" && <MessagesList themeName={themeName} />}
        {activeSection === "currency" && <CurrencyRates themeName={themeName} />}
      </section>
    </main>
  );
}
