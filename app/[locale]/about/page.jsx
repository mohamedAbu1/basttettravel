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
// app/about/page.tsx
export const metadata = {
  title: {
    ar: "عن Basttet Travel – رحلات فاخرة بروح التراث",
    en: "About Basttet Travel – Luxury journeys with heritage",
    de: "Über Basttet Travel – Luxusreisen mit Tradition",
    es: "Acerca de Basttet Travel – Viajes de lujo con herencia",
    fr: "À propos de Basttet Travel – Voyages de luxe avec héritage",
    it: "Informazioni su Basttet Travel – Viaggi di lusso con tradizione",
    zh: "关于 Basttet Travel – 以传承打造的奢华旅程",
  },
  description: {
    ar: "نصمم تجارب غامرة عبر مصر – من أناقة النيل الأبدية إلى جمال الصحراء البيضاء. كل تفصيلة تعكس الراحة والثقافة والعناية.",
    en: "We design immersive experiences across Egypt – from the Nile’s timeless elegance to the White Desert’s quiet wonder.",
    de: "Wir gestalten eindrucksvolle Erlebnisse in ganz Ägypten – von der zeitlosen Eleganz des Nils bis zur stillen Schönheit der Weißen Wüste.",
    es: "Diseñamos experiencias inmersivas por todo Egipto – desde la elegancia eterna del Nilo hasta la maravilla silenciosa del Desierto Blanco.",
    fr: "Nous créons des expériences immersives à travers l'Égypte – de l'élégance intemporelle du Nil à la beauté silencieuse du désert blanc.",
    it: "Progettiamo esperienze immersive in tutto l’Egitto – dall’eleganza senza tempo del Nilo al silenzioso splendore del Deserto Bianco.",
    zh: "我们在埃及设计沉浸式体验——从尼罗河的永恒优雅到白色沙漠的静谧奇观。",
  },
  keywords: {
    ar: "عن Basttet Travel, رحلات تراثية, رحلات فاخرة",
    en: "About Basttet Travel, Egypt heritage tours, luxury journeys",
    de: "Über Basttet Travel, Ägypten Kulturreisen, Luxusreisen",
    es: "Acerca de Basttet Travel, Viajes culturales Egipto, Viajes de lujo",
    fr: "À propos Basttet Travel, Voyages culturels Égypte, Voyages de luxe",
    it: "Informazioni Basttet Travel, Viaggi culturali Egitto, Viaggi di lusso",
    zh: "关于 Basttet Travel, 埃及文化之旅, 豪华旅行",
  },
};

export default function AboutPage() {
  const { theme } = useTheme();
  const { user } = useAuth(); // ✅ جلب المستخدم الحالي
  const { lang } = useLanguage();
  const meta = aboutMetadata[lang] || aboutMetadata.en;
  return (
    <>
      <Head>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
        <meta name="keywords" content={meta.keywords} />
      </Head>
      <main
       className="relative flex flex-col min-h-screen justify-center items-center "
      >
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
        {user && <ChatWidget />}
      </main>
    </>
  );
}
