"use client";
import React from "react";
import { useTheme } from "@/context/ThemeContext";
import Header from "@/components/header/Header";
import Footer from "@/components/Footer/Footer";
import EgyptianBackground from "@/components/layout/EgyptianBackground";
import LoginModal from "@/components/home/components/LoginModal";
import SignUpButton from "@/components/home/components/SignUpButton";

// استدعاء الأقسام الجديدة
import AboutHero from "@/components/about/AboutHero";
import MissionValues from "@/components/about/MissionValues";
import StatsSection from "@/components/about/StatsSection";
import HeritageSection from "@/components/about/HeritageSection";
import CTASection from "@/components/about/CTASection";
import ChatWidget from "@/components/layout/ChatWidget";
import { useAuth } from "@/context/AuthContext";
import Head from "next/head";
import { useLanguage } from "@/context/LanguageContext";
import { aboutMetadata } from "@/lib/metadata/about";
import AdminChatWindow from "@/components/layout/AdminChatWindow";

export default function AboutPage() {
  const { theme } = useTheme();
  const { userData, chatUser, setChatUser } = useAuth(); // ✅ جلب المستخدم الحالي
  const { lang } = useLanguage();
  const meta = aboutMetadata[lang] || aboutMetadata.en;
  return (
    <>
      <Head>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
        <meta name="keywords" content={meta.keywords} />
      </Head>
      <main className="relative flex flex-col min-h-screen justify-center items-center ">
        <Header />
        <EgyptianBackground />

        {/* الأقسام */}
        <AboutHero />
        <MissionValues />
        <StatsSection />
        <HeritageSection />
        <CTASection />

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
    </>
  );
}
