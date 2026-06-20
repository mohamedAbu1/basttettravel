"use client";
import React from "react";
import { useTheme } from "@/context/ThemeContext";
import { FaFacebookF, FaInstagram, FaTiktok, FaWhatsapp } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import Link from "next/link";
import { MdEmail } from "react-icons/md";

const Footer = () => {
  const { theme, themeName } = useTheme();
  const { t } = useTranslation("footer");

  const symbols = ["𓂀","𓋹","𓆣","𓇼","𓇯","𓏏","𓎛","𓊽","𓃾","𓅓","𓈇","𓉐","𓊹","𓌙","𓍿","𓎟"];

  const fadeUp = {
    hidden: { opacity: 0, y: 40 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  };

  const staggerContainer = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.2 } },
  };

  return (
    <motion.footer
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
      variants={staggerContainer}
      className={`
        flex flex-col items-center justify-center
        py-12 px-6 w-full relative overflow-hidden
        transition-colors duration-500
        ${theme.background} ${theme.text}
      `}
    >
      {/* خلفية الرموز الفرعونية */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        {Array.from({ length: 20 }).map((_, i) => (
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 0.15, y: 0 }}
            transition={{ duration: 2, delay: i * 0.1 }}
            className={`absolute ${
              themeName === "dark" ? "text-gray-700" : "text-[#222]"
            } text-6xl`}
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              transform: `rotate(${Math.random() * 360}deg)`,
            }}
          >
            {symbols[Math.floor(Math.random() * symbols.length)]}
          </motion.span>
        ))}
      </div>

      {/* اسم البراند */}
      <motion.p
        variants={fadeUp}
        className="text-3xl font-extrabold tracking-wide relative z-10 bg-gradient-to-r from-[var(--logoGradientFrom)] to-[var(--logoGradientTo)] bg-clip-text text-transparent drop-shadow-lg"
        style={{ WebkitTextStroke: `1px ${theme.logoBorder}` }}
      >
        Basttet travel
      </motion.p>

      {/* الوصف */}
      <motion.p variants={fadeUp} className="mt-2 text-sm opacity-80 text-center max-w-xl relative z-10">
        {t("p")}
      </motion.p>

      {/* روابط سريعة */}
      <motion.div variants={fadeUp} className="flex gap-6 mt-6 text-sm font-medium relative z-10">
        {["Home", "AboutUs", "Tours", "Contact"].map((link) => (
          <Link
            key={link}
            href={`/${link === "Home" ? "" : link.toLowerCase()}`}
            className={`hover:underline transition ${
              themeName === "dark"
                ? "text-white/80 hover:text-[var(--logoBorder)]"
                : "text-[#3a2c0a]/80 hover:text-[#222]"
            }`}
          >
            {t(link)}
          </Link>
        ))}
      </motion.div>

      {/* Divider متدرج */}
      <motion.div
        variants={fadeUp}
        className="w-32 h-[2px] bg-gradient-to-r from-[var(--logoGradientFrom)] to-[var(--logoGradientTo)] mt-6 mb-6 animate-pulse"
      ></motion.div>

      {/* أيقونات السوشيال ميديا */}
     <motion.div variants={fadeUp} className="flex gap-5 mt-4 relative z-10">
  {[
     { Icon: FaFacebookF, url: "https://facebook.com/YourPage" },
        { Icon: FaInstagram, url: "https://instagram.com/YourPage" },
        { Icon: FaWhatsapp, url: "https://wa.me/201100507802" }, // رقم واتساب
        { Icon: MdEmail, url: "https://mail.google.com/mail/u/3/#inbox" }, // فتح البريد
      ].map(({ Icon, link }, i) => (
    <motion.a
      key={i}
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ scale: 1.2, rotate: 5 }}
      className={`p-3 rounded-full transition shadow-md ${
        themeName === "dark"
          ? "bg-[var(--logoGradientFrom)]/20 hover:bg-[var(--logoGradientTo)]/40 text-[var(--logoBorder)]"
          : "bg-[var(--logoGradientFrom)]/20 hover:bg-[var(--logoGradientTo)]/40 text-[#222]"
      }`}
    >
      <Icon />
    </motion.a>
  ))}
</motion.div>


      {/* حقوق النشر */}
      <motion.p
        variants={fadeUp}
        className="mt-8 text-xs opacity-70 relative z-10"
      >
        © 2026 Basttet travel. All rights reserved.
      </motion.p>
    </motion.footer>
  );
};

export default Footer;
