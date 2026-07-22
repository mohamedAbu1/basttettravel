"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import Logo from "./components/Logo";
import NavBar from "./components/NavBar";
import RightBar from "./components/RightBar";
import Button from '@mui/material/Button';
import { useAuth } from "@/context/AuthContext";
import { FaSignOutAlt, FaUserPlus } from "react-icons/fa";
import { useData } from "@/context/DataContext";
import { signOut, signIn } from "next-auth/react"; // ✅ إضافة

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const { theme } = useTheme();
  const { userData, isLoggedIn, logout, handleOpen } = useAuth();
  const { handleLoginOpen } = useData();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
        scrolled
          ? `${theme.background} ${theme.border} ${theme.shadow}`
          : "bg-transparent"
      }`}
    >
      <div className="max-w-8xl container mx-auto px-6 py-4 flex items-center justify-between">
        {/* شعار الموقع */}
        <Logo scrolled={scrolled} />

        {/* روابط التنقل */}
        <NavBar scrolled={scrolled} />

        {/* يمين الهيدر (تبديل الثيم + المستخدم) */}
        <RightBar scrolled={scrolled} />

        {/* زر تسجيل الدخول/الخروج */}
        <motion.div whileHover={{ scale: 1.05 }} className="hidden lg:flex">
          <Button
             onClick={userData ? () => signOut() : () => handleLoginOpen()}
            className={`transition-all font-semibold tracking-wide uppercase shadow-md flex items-center gap-2 px-6 py-3 rounded-xl ${
              userData ? theme.buttonSecondary : theme.buttonPrimary
            }`}
          >
            {userData ? (
              <>
                <FaSignOutAlt size={20} />
                <span>Logout</span>
              </>
            ) : (
              <>
                <FaUserPlus size={20} />
                <span>Sign Up</span>
              </>
            )}
          </Button>
        </motion.div>
      </div>
    </motion.header>
  );
}
