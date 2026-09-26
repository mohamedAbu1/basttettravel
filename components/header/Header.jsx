"use client";
import { useState, useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";
import Logo from "./components/Logo";
import NavBar from "./components/NavBar";
import RightBar from "./components/RightBar";
import { useAuth } from "@/context/AuthContext";
import { FaSignOutAlt, FaUserPlus } from "react-icons/fa";
import { useData } from "@/context/DataContext";
import { useTranslation } from "react-i18next";
import MobileHeaderAuth from "./components/MobileHeaderAuth";
import ThemeToggle from "../ThemeToggle";
import LanguageSwitcher from "./components/LanguageSwitcher";
import MobileNav from "./components/MobileNav";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const { theme } = useTheme();
  const { userData, logout } = useAuth();
  const { handleSignUpOpen } = useData();
  const { t } = useTranslation("home");
  const { t: uiT } = useTranslation("ui");

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`site-header fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        scrolled ? "site-header-scrolled" : "site-header-top"
      }`}
    >
      <a href="#main-content" className="skip-link">
        {uiT("skipToMain")}
      </a>
      <div className="site-header-inner max-w-8xl container mx-auto px-6 py-3 flex items-center justify-between">
        {/* شعار الموقع */}
        <Logo scrolled={scrolled} />

        {/* روابط التنقل */}
        <NavBar scrolled={scrolled} />

        {/* يمين الهيدر (تبديل الثيم + المستخدم) */}
        <RightBar scrolled={scrolled} />

        {/* زر تسجيل الدخول/الخروج */}
        <div className="hidden lg:flex">
          <button
            type="button"
            onClick={userData ? logout : handleSignUpOpen}
            className="header-auth-button"
          >
            {userData ? (
              <>
                <FaSignOutAlt size={20} />
                <span>{t("Logout")}</span>
              </>
            ) : (
              <>
                <FaUserPlus size={20} />
                <span>{t("SignUp")}</span>
              </>
            )}
          </button>
        </div>
        <ThemeToggle scrolled={scrolled} />
        <LanguageSwitcher />

        <div className="lg:hidden flex items-center gap-1">
          <MobileNav />
          <MobileHeaderAuth />
        </div>
      </div>
    </header>
  );
}
