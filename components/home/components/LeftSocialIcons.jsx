"use client";
import { motion } from "framer-motion";
import React from "react";
import { FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { useTheme } from "@/context/ThemeContext";
// لو مش لاقي أيقونات جاهزة ل Viator و Tripadvisor في react-icons
// ممكن تستخدم FaGlobe أو أيقونات عامة أو تضيف SVG مخصص

import { FaGlobe } from "react-icons/fa"; // مؤقت لـ Viator
import { FaTripadvisor } from "react-icons/fa"; // موجود في react-icons

const LeftSocialIcons = () => {
  const { theme } = useTheme();

  const socialLinks = [
    { Icon: FaFacebookF, url: "https://www.facebook.com/profile.php?id=61591222981163" },
    { Icon: FaInstagram, url: "https://www.instagram.com/ismailharoun225/" },
    { Icon: FaWhatsapp, url: "https://wa.me/201100507802" }, // رقم واتساب
    { Icon: MdEmail, url: "https://account.microsoft.com/profile/" }, // فتح البريد
    { Icon: FaGlobe, url: "https://www.viator.com/" }, // ✅ Viator
    { Icon: FaTripadvisor, url: "https://www.tripadvisor.com/UserReviewEdit-g294205-d34512222-Basttet_Travel-Luxor_Nile_River_Valley.html" }, // ✅ Tripadvisor
  ];

  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 1, delay: 0.7 }}
      className="absolute left-30 lg:left-10 top-200 lg:top-[55%] -translate-y-1/2 flex flex-row lg:flex-col gap-6 z-30 "
    >
      {socialLinks.map(({ Icon, url }, i) => (
        <motion.a
          whileHover={{ scale: 1.2, rotate: -5 }}
          key={i}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className={`p-3 rounded-full ${theme.card} ${theme.shadow}`}
        >
          <Icon size={22} className={theme.icon} />
        </motion.a>
      ))}
    </motion.div>
  );
};

export default LeftSocialIcons;
