"use client";
import { motion } from "framer-motion";
import React from "react";
import { FaFacebookF, FaInstagram, FaTiktok, FaWhatsapp } from "react-icons/fa";
import { useTheme } from "@/context/ThemeContext";
import { MdEmail } from "react-icons/md";
// ? $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
const LeftSocialIcons = () => {
  // ? $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
  const { theme } = useTheme();
  // ? $$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$
  const socialLinks = [
    { Icon: FaFacebookF, url: "https://facebook.com/YourPage" },
    { Icon: FaInstagram, url: "https://instagram.com/YourPage" },
    { Icon: FaTiktok, url: "https://tiktok.com/@YourPage" },
    { Icon: FaWhatsapp, url: "https://wa.me/201234567890" }, // رقم واتساب
    { Icon: MdEmail, url: "mailto:yourmail@example.com" }, // فتح البريد
  ];

  return (
    <motion.div
      initial={{ x: -100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 1, delay: 0.7 }}
      className="absolute left-10 bottom-0 md:top-[55%] -translate-y-1/2 flex flex-row md:flex-col gap-6 z-30"
    >
      {socialLinks.map(({ Icon, url }, i) => (
        <motion.a
          whileHover={{ scale: 1.2, rotate: -5 }}
          key={i}
          href={url}
          target="_blank" // يفتح الرابط في تبويب جديد
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
