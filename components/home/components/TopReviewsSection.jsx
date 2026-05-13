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
import { useState } from "react";
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
  slidesToShow: 3, // ✅ الكمبيوتر: 3 كروت
  slidesToScroll: 1,
  autoplay: true,
  autoplaySpeed: 5000,
  arrows: false,
  responsive: [
    {
      breakpoint: 1024, // أقل من 1024px (تابلت)
      settings: {
        slidesToShow: 2, // ✅ يعرض 2 كروت
      },
    },
    {
      breakpoint: 640, // أقل من 640px (موبايل)
      settings: {
        slidesToShow: 1, // ✅ يعرض كارت واحد
      },
    },
  ],
};


  return (
    <section
      className={`py-20 px-8 ${theme.background} ${theme.text} w-screen max-w-full`}
    >
      <EgyptianBackground />
      <h2 className="sc-title-first text-5xl font-extrabold tracking-wide drop-shadow-md text-left text-gradient">
        <span className="inline-block transform scale-x-[-1] mr-4">𓅓</span>
        {t("h6")}
        <span className="inline-block ml-4">𓅓</span>
      </h2>

      <DividerWithIcon />

      {topLikedReviews.length > 0 ? (
        <Slider {...settings}>
          {topLikedReviews.map((rev, idx) => {
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
                className={`flex flex-col gap-6 p-8 ml-4 mx-6 my-4 rounded-2xl min-h-[260px] ${theme.card}`} // ✅ مسافة بين الكروت
                style={{
                  backdropFilter: "blur(12px)",
                  WebkitBackdropFilter: "blur(12px)",
                  border: `1px solid ${theme.logoBorder}`,
                  boxShadow: theme.shadow,
                }}
              >
                {/* Header */}
                <div className="flex items-center gap-4 border-b pb-3">
                  {rev.avatar_url ? (
                    <img
                      src={rev.avatar_url}
                      alt={rev.name}
                      className="w-16 h-16 rounded-full border-2 object-cover"
                      style={{ borderColor: theme.logoBorder }}
                    />
                  ) : (
                    <FaUserCircle size={64} className={theme.icon} />
                  )}
                  <div>
                    <h3
                      className={`font-bold text-lg ${theme.title} capitalize`}
                    >
                      {rev.name || "Anonymous"}
                    </h3>
                    <div className="flex gap-1">
                      {[...Array(rev.rating || 0)].map((_, i) => (
                        <FaStar key={i} className={theme.icon} />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Body */}
                <div className="relative flex-1 mt-6">
                  <FaQuoteLeft
                    className={`absolute top-0 left-0 text-3xl opacity-20 ${theme.icon}`}
                  />
                  <p
                    className={`italic leading-relaxed text-base pl-10 ${theme.subText}`}
                    style={{ textAlign: "justify" }}
                  >
                    {comment}
                  </p>
                  {rev.comment?.length > 150 && (
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleExpand(rev.id)}
                      className={`text-sm mt-2 font-semibold tracking-wide cursor-pointer transition-all duration-300 ${theme.buttonPrimary}`}
                      style={{ border: `1px solid ${theme.logoBorder}` }}
                    >
                      {expanded ? "إخفاء" : "اقرأ المزيد"}
                    </motion.button>
                  )}
                </div>

                {/* Footer */}
                <div className="flex justify-between items-center mt-6 border-t pt-4">
                  <div
                    className={`flex items-center gap-2 text-sm ${theme.subText}`}
                  >
                    <span>
                      {rev.created_at
                        ? format(new Date(rev.created_at), "dd MMM yyyy")
                        : "Unknown date"}
                    </span>
                  </div>
                  <div
                    className={`flex items-center gap-2 font-semibold text-sm px-3 py-1 rounded-full shadow-sm ${theme.buttonPrimary}`}
                  >
                    <FaHeart />
                    <span>{rev.likesCount}</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </Slider>
      ) : (
        <p className={`text-center opacity-70 ${theme.subText}`}>{t("p6")}</p>
      )}
    </section>
  );
}
