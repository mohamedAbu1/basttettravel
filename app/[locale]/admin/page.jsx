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
import SeasonalEvents from "./components/SeasonalEvents";
import { FaBell, FaCompass, FaShieldAlt } from "react-icons/fa";
import { useNotifications } from "@/context/NotificationsContext";

const symbols = ["𓂀","𓋹","𓆣","𓇼","𓇯","𓏏","𓎛","𓊽","𓃾","𓅓","𓈇","𓉐","𓊹","𓌙","𓍿","𓎟"];

const sectionMeta = {
  dashboard: { eyebrow: "Overview", title: "Operations dashboard", description: "Keep every Egypt journey moving smoothly." },
  addTrip: { eyebrow: "Catalog", title: "Create a new trip", description: "Build a polished travel experience ready for your guests." },
  trips: { eyebrow: "Catalog", title: "Trip library", description: "Review, manage, and curate every published experience." },
  editTrip: { eyebrow: "Catalog", title: "Edit trip details", description: "Fine-tune content, media, inclusions, and schedules." },
  users: { eyebrow: "People", title: "Users management", description: "Understand your community and manage access securely." },
  bookings: { eyebrow: "Operations", title: "Booking desk", description: "Track guest reservations and keep status up to date." },
  reports: { eyebrow: "Insights", title: "Reports & performance", description: "Turn your travel activity into clear operational signals." },
  messages: { eyebrow: "Guest care", title: "Guest conversations", description: "Respond to travelers and keep every conversation personal." },
  currency: { eyebrow: "Settings", title: "Currency rates", description: "Keep pricing data consistent across the travel experience." },
  seasonalEvents: { eyebrow: "Merchandising", title: "Seasonal campaigns", description: "Shape timely offers and moments across the platform." },
};

export default function DashboardPage() {
  const [activeSection, setActiveSection] = useState("dashboard");
  const { theme, themeName } = useTheme();
  const { userData, loading } = useAuth();
  const { notifications, requestDesktopNotifications, desktopPermission } = useNotifications();
  const router = useRouter();
  const params = useParams();
  const locale = params?.locale || "en";
  const unreadNotifications = notifications.filter((notification) => Number(notification.is_read) === 0).length;

  const handleNotificationAction = async () => {
    if (desktopPermission === "default") {
      await requestDesktopNotifications();
      return;
    }
    setActiveSection("messages");
  };

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
    return (
      <main className="admin-shell admin-auth-loading min-h-screen" aria-busy="true">
        <div className="admin-loading-card">
          <div className="admin-loading-mark">𓂀</div>
          <span className="admin-section-eyebrow">Basttet Travel</span>
          <h1>Preparing your workspace</h1>
          <p>Checking your secure admin session…</p>
          <div className="admin-loading-bar"><span /></div>
        </div>
      </main>
    );
  }

  return (
    <main className={`admin-shell relative flex min-h-screen ${theme.background} ${theme.text} overflow-hidden`}>
      <EgyptianBackground />

      <div className="admin-symbol-layer absolute inset-0 pointer-events-none z-10" aria-hidden="true">
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
        className={`admin-main-content flex-1 relative z-10 ${
          themeName === "dark" ? "bg-black" : "bg-white"
        } rounded-tl-3xl`}
      >
        <header className="admin-topbar">
          <div>
            <div className="admin-breadcrumb"><FaCompass aria-hidden="true" /> <span>Basttet Travel</span><b>/</b><span>Admin workspace</span></div>
            <p className="admin-topbar-kicker">{sectionMeta[activeSection]?.eyebrow}</p>
            <h1>{sectionMeta[activeSection]?.title}</h1>
            <p>{sectionMeta[activeSection]?.description}</p>
          </div>
          <div className="admin-topbar-actions">
            <button
              className="admin-icon-button admin-notification-button"
              type="button"
              aria-label={desktopPermission === "default" ? "Enable desktop notifications" : "Open notifications"}
              title={desktopPermission === "default" ? "Enable desktop notifications" : "Open notifications"}
              onClick={handleNotificationAction}
            >
              <FaBell />
              {unreadNotifications > 0 && <span className="admin-topbar-notification-count">{unreadNotifications > 99 ? "99+" : unreadNotifications}</span>}
            </button>
            <div className="admin-topbar-status"><span /> Live overview</div>
            <div className="admin-secure-badge"><FaShieldAlt /> Secure</div>
          </div>
        </header>
        <div className="admin-content-stage">
          {activeSection === "dashboard" && <DashboardHome themeName={themeName} onNavigate={setActiveSection} />}
          {activeSection === "addTrip" && <AddTrip themeName={themeName} />}
          {activeSection === "trips" && <TripsList themeName={themeName} />}
          {activeSection === "editTrip" && <EditTrip themeName={themeName} />}
          {activeSection === "users" && <UsersSection themeName={themeName} />}
          {activeSection === "bookings" && <BookingsList themeName={themeName} />}
          {activeSection === "reports" && <Reports themeName={themeName} />}
          {activeSection === "messages" && <MessagesList themeName={themeName} />}
          {activeSection === "currency" && <CurrencyRates themeName={themeName} />}
          {activeSection === "seasonalEvents" && <SeasonalEvents themeName={themeName} />}
        </div>
      </section>
    </main>
  );
}
