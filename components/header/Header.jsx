"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import Logo from "./components/Logo";
import NavBar from "./components/NavBar";
import RightBar from "./components/RightBar";
import { Button } from "@mui/material";
import { useAuth } from "@/context/AuthContext";
import { FaSignOutAlt, FaUserPlus } from "react-icons/fa";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const { theme } = useTheme();
  const { user, isLoggedIn, logout, handleOpen } = useAuth();

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
      className={`fixed top-0 left-0 w-full z-45 transition-all duration-500 ${
        scrolled
          ? `${theme.background} ${theme.border} ${theme.shadow}`
          : "bg-transparent"
      }`}
    >
      <div className="max-w-8xl container mx-auto px-6 py-4 flex items-center justify-between">
        <Logo scrolled={scrolled} />
        <NavBar scrolled={scrolled} />
        <RightBar scrolled={scrolled} />
        {/* زر تسجيل الدخول/الخروج */}
        <motion.div whileHover={{ scale: 1.1 }} className="hidden lg:flex">
          <Button
            onClick={isLoggedIn ? logout : handleOpen}
            style={{
              padding: "12px 24px",
              background: "linear-gradient(to right, #c9a34a, #A68B5B)",
              color: "#fff",
              fontWeight: "600",
              letterSpacing: "0.05em",
              borderRadius: "0.5rem",
              boxShadow: "0 4px 10px rgba(0,0,0,0.3)",
              transition: "all 0.3s ease",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            {isLoggedIn ? (
              <FaSignOutAlt size={20} /> // أيقونة خروج
            ) : (
              <FaUserPlus size={20} /> // أيقونة تسجيل
            )}
          </Button>
        </motion.div>
      </div>
    </motion.header>
  );
}
