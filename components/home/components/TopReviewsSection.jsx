"use client";
import { useReviews } from "@/context/ReviewsContext";
import { useTheme } from "@/context/ThemeContext";
import { FaStar, FaUserCircle, FaQuoteLeft, FaHeart } from "react-icons/fa";
import { motion } from "framer-motion";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import EgyptianBackground from "@/components/layout/EgyptianBackground";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { useState, useEffect } from "react";
import DividerWithIcon from "@/components/layout/DividerWithIcon";

export default function TopReviewsSection() {
  const { allReviews, likes } = useReviews();
  const { theme } = useTheme();
  const { t } = useTranslation("home");

  const safeReviews = Array.isArray(allReviews) ? allReviews : [];

  const topLikedReviews = safeReviews
    .map((rev) => ({
      ...rev,
      likesCount: likes[rev.id]?.count || 0,
    }))
    .filter((rev) => rev.likesCount > 0)
    .sort((a, b) => b.likesCount - a.likesCount)
    .slice(0, 5);

  const [expandedIds, setExpandedIds] = useState([]);
  const toggleExpand = (id) => {
    setExpandedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  const settings = {
    dots: true,
    infinite: true,
    speed: 700,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: false,
    responsive: [
      { breakpoint: 1440, settings: { slidesToShow: 4 } },
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 640, settings: { slidesToShow: 1 } },
    ],
  };

  // ✅ تحديد حجم الشاشة
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      setIsLargeScreen(window.innerWidth >= 1024);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <section className={`py-20 px-4 md:px-8 ${theme.background} ${theme.text} w-screen max-w-full`}>
      <EgyptianBackground />
      <h2 className="sc-title-first text-[21px] md:text-5xl font-extrabold tracking-wide drop-shadow-md text-left text-gradient">
        <span className="inline-block transform scale-x-[-1] mr-4">𓅓</span>
        {t("h6")}
        <span className="inline-block ml-4">𓅓</span>
      </h2>

      <DividerWithIcon />

      {topLikedReviews.length > 0 ? (
        isLargeScreen ? (
          // ✅ عرض Slider في الشاشات الكبيرة
          <div className="max-w-7xl mx-auto">
            <Slider {...settings} className="w-full flex gap-2">
              {topLikedReviews.map((rev, idx) => renderCard(rev, idx))}
            </Slider>
          </div>
        ) : (
          // ✅ عرض Grid في الشاشات الصغيرة
          <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 gap-6 mt-8">
            {topLikedReviews.map((rev, idx) => renderCard(rev, idx))}
          </div>
        )
      ) : (
        <p className={`text-center opacity-70 ${theme.subText}`}>{t("p6")}</p>
      )}
    </section>
  );

  // ✅ دالة لإعادة استخدام الكارت
  function renderCard(rev, idx) {
    const expanded = expandedIds.includes(rev.id);
    const comment =
      rev.comment?.length > 150 && !expanded
        ? rev.comment.slice(0, 150) + "..."
        : rev.comment;

    return (
      <motion.div
        key={rev.id || idx}
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className={`flex flex-col justify-between gap-4 p-4 md:p-6 rounded-2xl min-h-[260px] ${theme.card}`}
        style={{
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          marginLeft:"20px",
          border: `1px solid ${theme.logoBorder}`,
          boxShadow: theme.shadow,
        }}
      >
        {/* Header */}
        <div className="flex items-center gap-3 border-b pb-2">
          {rev.avatar_url ? (
            <img
              src={rev.avatar_url}
              alt={rev.name}
              className="w-12 h-12 md:w-14 md:h-14 rounded-full border-2 object-cover"
              style={{ borderColor: theme.logoBorder }}
            />
          ) : (
            <FaUserCircle size={48} className={theme.icon} />
          )}
          <div>
            <h3 className={`font-bold text-base md:text-lg ${theme.title}`}>
              {rev.name || "Anonymous"}
            </h3>
            <div className="flex gap-1">
              {[...Array(rev.rating || 0)].map((_, i) => (
                <FaStar key={i} className="text-yellow-500 text-sm md:text-base" />
              ))}
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="relative flex-1 mt-4">
          <FaQuoteLeft className={`absolute top-0 left-0 text-2xl opacity-20 ${theme.icon}`} />
          <p className={`italic leading-relaxed text-sm md:text-base pl-8 ${theme.subText}`} style={{ textAlign: "justify" }}>
            {comment}
          </p>
          {rev.comment?.length > 150 && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleExpand(rev.id)}
              className={`text-xs md:text-sm mt-2 font-semibold tracking-wide cursor-pointer transition-all duration-300 ${theme.buttonPrimary}`}
              style={{ border: `1px solid ${theme.logoBorder}` }}
            >
              {expanded ? "إخفاء" : "اقرأ المزيد"}
            </motion.button>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center mt-4 border-t pt-2">
          <span className={`text-xs md:text-sm ${theme.subText}`}>
            {rev.created_at ? format(new Date(rev.created_at), "dd MMM yyyy") : "Unknown date"}
          </span>
          <div className={`flex items-center gap-2 font-semibold text-xs md:text-sm px-3 py-1 rounded-full shadow-sm ${theme.buttonPrimary}`}>
            <FaHeart />
            <span>{rev.likesCount}</span>
          </div>
        </div>
      </motion.div>
    );
  }
}
