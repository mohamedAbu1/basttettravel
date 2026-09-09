"use client";
import dynamic from "next/dynamic";
import Footer from "@/components/Footer/Footer";
import Header from "@/components/header/Header";
import CarBookingSection from "@/components/home/CarBookingSection";
import CategoriesSection from "@/components/home/CategoriesSection";
import CitiesSection from "@/components/home/CitiesSection";
import HeroSection from "@/components/home/HeroSection";
// Below-the-fold sections are loaded after the critical home content so the
// first mobile render has less JavaScript to parse and execute.
const OurSection = dynamic(() => import("@/components/home/OurSection"), {
  ssr: false,
});
import TopTripsSection from "@/components/home/TopTripsSection";
import LoginModal from "@/components/home/components/LoginModal";
import SignUpButton from "@/components/home/components/SignUpButton";
const TopReviewsSection = dynamic(
  () => import("@/components/home/components/TopReviewsSection"),
  { ssr: false },
);
const ChatWidget = dynamic(() => import("@/components/layout/ChatWidget"), {
  ssr: false,
});
import { useAuth } from "@/context/AuthContext"; // ✅ استدعاء الـ Auth
const CurrencySelector = dynamic(
  () => import("@/components/layout/CurrencySelector"),
  { ssr: false },
);
import ScrollToTopButton from "@/components/layout/ScrollToTopButton";
const AdminDashboardButton = dynamic(
  () => import("@/components/layout/AdminDashboardButton"),
  { ssr: false },
);
const AdminChatWindow = dynamic(
  () => import("@/components/layout/AdminChatWindow"),
  { ssr: false },
);

// import { useQueryFilters } from "@/context/QueryContext";
import { useMessages } from "@/context/MessageContext";
export default function Home() {
  const { messages } = useMessages();
  const { userData, chatUser, setChatUser } = useAuth();

  return (
    <>
      <main
        id="main-content"
        className={`
        w-full
        flex
        flex-col
        items-center
        justify-center
        min-h-screen font-sans
     
        transition-colors duration-300
        overflow-hidden
      `}
      >
        <Header />

        {/* ================= HERO SECTION ================= */}
        <HeroSection />

        {/* ================= CATEGORIES SECTION ================= */}
        <CategoriesSection />

        {/* ================= TOP TRIPS SECTION ================= */}
        <TopTripsSection />

        {/* ================= CITIES SECTION ================= */}
        <CitiesSection />

        <OurSection />
        <TopReviewsSection />

        <CarBookingSection />

        {/* ================= FOOTER ================= */}
        <Footer />

        <SignUpButton />
        <LoginModal />

        {/* نافذة الدردشة تظهر فقط لو المستخدم مسجل دخول */}
        {userData && <ChatWidget />}
        {userData && <AdminDashboardButton />}

        <CurrencySelector />
        {chatUser && (
          <AdminChatWindow
            user={chatUser}
            admin={userData}
            messages={messages}
            onClose={() => setChatUser(null)}
          />
        )}
        <ScrollToTopButton />
      </main>
    </>
  );
}
