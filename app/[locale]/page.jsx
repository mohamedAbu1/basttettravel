"use client";
import Footer from "@/components/Footer/Footer";
import Header from "@/components/header/Header";
import CarBookingSection from "@/components/home/CarBookingSection";
import CategoriesSection from "@/components/home/CategoriesSection";
import CitiesSection from "@/components/home/CitiesSection";
import HeroSection from "@/components/home/HeroSection";
import OurSection from "@/components/home/OurSection";
import TopTripsSection from "@/components/home/TopTripsSection";
import LoginModal from "@/components/home/components/LoginModal";
import SignUpButton from "@/components/home/components/SignUpButton";
import TopReviewsSection from "@/components/home/components/TopReviewsSection";
import ChatWidget from "@/components/layout/ChatWidget";
import { useAuth } from "@/context/AuthContext"; // ✅ استدعاء الـ Auth
import Head from "next/head";
import { useLanguage } from "@/context/LanguageContext";
import { homeMetadata } from "@/lib/metadata/home";
import CurrencySelector from "@/components/layout/CurrencySelector";
import ScrollToTopButton from "@/components/layout/ScrollToTopButton";
// import { useQueryFilters } from "@/context/QueryContext";
// app/page.tsx أو app/home/page.tsx
export const metadata = {
  title: {
    ar: "Basttet Travel – رحلات مصر الفاخرة",
    en: "Basttet Travel – Luxury Egypt Tours",
    de: "Basttet Travel – Luxusreisen in Ägypten",
    es: "Basttet Travel – Viajes de lujo en Egipto",
    fr: "Basttet Travel – Voyages de luxe en Égypte",
    it: "Basttet Travel – Viaggi di lusso in Egitto",
    zh: "Basttet Travel – 埃及豪华之旅",
  },
  description: {
    ar: "استمتع برحلات النيل الفاخرة ومغامرات الصحراء مع Basttet Travel. اكتشف الأقصر وقنا مع خدمات احترافية.",
    en: "Enjoy luxury Nile cruises and desert adventures with Basttet Travel. Explore Luxor and Qena with professional services.",
    de: "Erleben Sie luxuriöse Nilkreuzfahrten und Wüstenabenteuer mit Basttet Travel. Entdecken Sie Luxor und Qena mit professionellen Services.",
    es: "Disfruta de cruceros de lujo por el Nilo y aventuras en el desierto con Basttet Travel. Explora Luxor y Qena con servicios profesionales.",
    fr: "Profitez de croisières de luxe sur le Nil et d'aventures dans le désert avec Basttet Travel. Explorez Louxor et Qena avec des services professionnels.",
    it: "Goditi crociere di lusso sul Nilo e avventure nel deserto con Basttet Travel. Esplora Luxor e Qena con servizi professionali.",
    zh: "与 Basttet Travel 一起享受豪华尼罗河游轮和沙漠探险。探索卢克索和凯纳，享受专业服务。",
  },
  keywords: {
    ar: "رحلات مصر, رحلات الأقصر, رحلات النيل, مغامرات الصحراء",
    en: "Egypt tours, Luxor trips, Nile cruises, desert adventures",
    de: "Ägypten Reisen, Luxor Touren, Nilkreuzfahrt, Wüstenabenteuer",
    es: "Viajes Egipto, Luxor, Cruceros Nilo, Aventuras desierto",
    fr: "Voyages Égypte, Louxor, Croisières Nil, Aventures désert",
    it: "Viaggi Egitto, Luxor, Crociere Nilo, Avventure deserto",
    zh: "埃及旅游, 卢克索旅行, 尼罗河游轮, 沙漠探险",
  },
};

export default function Home() {
  const { user } = useAuth(); // ✅ جلب المستخدم الحالي
  const { lang } = useLanguage();
  const meta = homeMetadata[lang] || homeMetadata.en;

  return (
    <>
      <Head>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
        <meta name="keywords" content={meta.keywords} />
      </Head>
      <main
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
        {user && <ChatWidget />}
        <CurrencySelector />
        <ScrollToTopButton />
      </main>
    </>
  );
}
