"use client";

import dynamic from "next/dynamic";
import Footer from "@/components/Footer/Footer";
import Header from "@/components/header/Header";
import HeroSection from "@/components/home/HeroSection";
import LoginModal from "@/components/home/components/LoginModal";
import SignUpButton from "@/components/home/components/SignUpButton";
import { useAuth } from "@/context/AuthContext";
import { useMessages } from "@/context/MessageContext";
import ScrollToTopButton from "@/components/layout/ScrollToTopButton";

const CategoriesSection = dynamic(() => import("@/components/home/CategoriesSection"));
const TopTripsSection = dynamic(() => import("@/components/home/TopTripsSection"));
const CitiesSection = dynamic(() => import("@/components/home/CitiesSection"));
const CarBookingSection = dynamic(() => import("@/components/home/CarBookingSection"));
const OurSection = dynamic(() => import("@/components/home/OurSection"));
const TopReviewsSection = dynamic(() => import("@/components/home/components/TopReviewsSection"));
const ChatWidget = dynamic(() => import("@/components/layout/ChatWidget"), { ssr: false });
const CurrencySelector = dynamic(() => import("@/components/layout/CurrencySelector"), {
  ssr: false,
});
const AdminDashboardButton = dynamic(
  () => import("@/components/layout/AdminDashboardButton"),
  { ssr: false },
);
const AdminChatWindow = dynamic(() => import("@/components/layout/AdminChatWindow"), {
  ssr: false,
});

export default function HomeClient() {
  const { messages } = useMessages();
  const { userData, chatUser, setChatUser } = useAuth();

  return (
    <main
      id="main-content"
      className="home-page public-page w-full flex flex-col items-center justify-center min-h-screen font-sans transition-colors duration-300 overflow-hidden"
    >
      <Header />
      <HeroSection />
      <CategoriesSection />
      <TopTripsSection />
      <CitiesSection />
      <OurSection />
      <TopReviewsSection />
      <CarBookingSection />
      <Footer />

      <SignUpButton />
      <LoginModal />
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
  );
}
