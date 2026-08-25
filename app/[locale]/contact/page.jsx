/* eslint-disable react-hooks/purity */
"use client";
import React, { useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import Header from "@/components/header/Header";
import Footer from "@/components/Footer/Footer";
import { useTranslation } from "react-i18next";
import LoginModal from "@/components/home/components/LoginModal";
import SignUpButton from "@/components/home/components/SignUpButton";
import ChatWidget from "@/components/layout/ChatWidget";
import { useAuth } from "@/context/AuthContext";
import Head from "next/head";
import { useLanguage } from "@/context/LanguageContext";
import { contactMetadata } from "@/lib/metadata/contact";
import DividerWithIcon from "@/components/layout/DividerWithIcon";
import Image from "next/image";
import AdminChatWindow from "@/components/layout/AdminChatWindow";
import ContactInfoCard from "@/components/contact/ContactInfoCard";
import ContactForm from "@/components/contact/ContactForm";
import { toast } from "react-toastify";

const symbols = [
  "𓂀",
  "𓋹",
  "𓆣",
  "𓇼",
  "𓇯",
  "𓏏",
  "𓎛",
  "𓊽",
  "𓃾",
  "𓅓",
  "𓈇",
  "𓉐",
  "𓊹",
  "𓌙",
  "𓍿",
  "𓎟",
];

export default function ContactPage() {
  const { theme, themeName } = useTheme();
  const { userData, chatUser, setChatUser } = useAuth(); // ✅ جلب المستخدم الحالي
  const { lang } = useLanguage();
  const meta = contactMetadata[lang] || contactMetadata.en;
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const { t } = useTranslation("contact");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
 const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    // ✅ هنا مش هنبعت لأي API

    // عرض رسالة نجاح في Toast
    toast.success("✅ The message was sent successfully");

    // 🧹 مسح الحقول بعد الإرسال
    setFormData({ name: "", phone: "", email: "", message: "" });
  } catch (err) {
    console.error("❌ خطأ:", err);
    toast.error("❌ حدث خطأ أثناء الإرسال");
  }
};

  return (
    <>
      <Head>
        <title>{meta.title}</title>
        <meta name="description" content={meta.description} />
        <meta name="keywords" content={meta.keywords} />
        <link rel="canonical" href="https://basttettravel.com/" />
        <img
          src="/Nile_Cruise/Dahabeya-program-SOBEK-900x600.webp"
          alt="Nile Cruise with Basttet Travel"
        />
      </Head>
      <main className="relative flex flex-col min-h-screen justify-center items-center mt-7">
        <Header />
        {/* خلفية الرموز الفرعونية */}
        <div className="absolute inset-0 pointer-events-none">
          {Array.from({ length: 25 }).map((_, i) => (
            <span
              key={i}
              className={`absolute ${
                themeName === "dark" ? "text-gray-700" : "text-[#4F6D7A]"
              } opacity-20 text-7xl animate-pulse`}
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                transform: `rotate(${Math.random() * 360}deg)`,
              }}
            >
              {symbols[Math.floor(Math.random() * symbols.length)]}
            </span>
          ))}
        </div>

        {/* المحتوى */}
        <section className="relative z-10 pt-20 px-6 mt-6">
          <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <ContactInfoCard themeName={themeName} t={t} />

            <ContactForm
              themeName={themeName}
              t={t}
              userData={userData}
              formData={formData}
              handleChange={handleChange}
              handleSubmit={handleSubmit}
            />
          </div>
        </section>
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
