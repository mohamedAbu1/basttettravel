"use client";
import React from "react";
import { FaTachometerAlt } from "react-icons/fa"; // أيقونة الداش بورد
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { motion } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";

export default function AdminDashboardButton() {
  const { userData } = useAuth();
  const router = useRouter();
  const params = useParams();
  const { theme } = useTheme();
  // ✅ تحقق من أن المستخدم أدمن
  const isAdmin = userData?.role?.toLowerCase() === "admin";

  const goToDashboard = () => {
    const locale = params?.locale || "en";
    router.push(`/${locale}/admin`);
  };

  if (!isAdmin) return null; // الزر يظهر فقط للأدمن

  return (
     <motion.button
      style={{ cursor: "pointer" ,zIndex:"999"}}
      aria-label="Open admin dashboard"
      title="Open admin dashboard"
      onClick={goToDashboard}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="admin-dashboard-trigger flex fixed bottom-6 right-6 shadow-lg items-center gap-3"
    >
      <span className="admin-dashboard-icon"><FaTachometerAlt aria-hidden="true" /></span>
      <span className="admin-dashboard-copy"><strong>Dashboard</strong><small>Manage your travel hub</small></span>
    </motion.button>
  );
}
