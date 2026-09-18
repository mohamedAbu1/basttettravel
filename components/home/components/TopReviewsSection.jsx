"use client";

import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { FaHeart, FaQuoteLeft, FaStar, FaUserCircle } from "react-icons/fa";
import { useReviews } from "@/context/ReviewsContext";
import DividerWithIcon from "@/components/layout/DividerWithIcon";

export default function TopReviewsSection() {
  const { allReviews, likes, likeBusy, toggleLike, userData, fetchAllReviews, loading } = useReviews();
  const { t } = useTranslation("home");
  const [expandedIds, setExpandedIds] = useState([]);

  useEffect(() => {
    fetchAllReviews();
    // The home section owns one intentionally lazy, one-time review request.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const reviews = useMemo(() => {
    const safe = Array.isArray(allReviews) ? [...allReviews] : [];
    return safe
      .map((review) => ({ ...review, likesCount: likes[review.id]?.count || Number(review.likes_count || 0) }))
      .sort((a, b) => b.likesCount - a.likesCount || new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .slice(0, 6);
  }, [allReviews, likes]);

  const toggleExpanded = (id) => {
    setExpandedIds((current) => current.includes(id) ? current.filter((item) => item !== id) : [...current, id]);
  };

  return (
    <section className="reviews-section" aria-labelledby="reviews-title">
      <div className="reviews-section-heading">
        <div>
          <p className="section-kicker">Basttet Travel community</p>
          <h2 id="reviews-title">{t("h6")}</h2>
        </div>
        <span className="reviews-heading-mark" aria-hidden="true">𓅓</span>
      </div>
      <DividerWithIcon />

      {loading && !reviews.length ? (
        <div className="reviews-empty" role="status" aria-live="polite">Loading traveler stories…</div>
      ) : reviews.length ? (
        <div className="reviews-grid">
          {reviews.map((review, index) => {
            const expanded = expandedIds.includes(review.id);
            const text = review.comment || "A memorable Egypt experience.";
            const isLong = text.length > 170;
            const displayed = isLong && !expanded ? `${text.slice(0, 170)}…` : text;
            const rating = Math.max(0, Math.min(5, Number(review.rating) || 0));
            const isLiked = likes[review.id]?.users?.some((id) => String(id) === String(userData?.id));

            return (
              <article className="review-card review-card-modern" key={review.id || index}>
                <div className="review-card-topline">
                  <div className="review-author">
                    {review.avatar_url ? <img src={review.avatar_url} alt="" /> : <FaUserCircle aria-hidden="true" />}
                    <div>
                      <h3>{review.name || "Anonymous traveler"}</h3>
                      <div className="review-stars" aria-label={`${rating} out of 5 stars`}>
                        {[1, 2, 3, 4, 5].map((star) => <FaStar key={star} aria-hidden="true" className={star <= rating ? "is-filled" : ""} />)}
                      </div>
                    </div>
                  </div>
                  <FaQuoteLeft className="review-quote" aria-hidden="true" />
                </div>
                <p className="review-card-copy">{displayed}</p>
                <div className="review-card-footer">
                  <time dateTime={review.created_at || undefined}>{review.created_at ? format(new Date(review.created_at), "dd MMM yyyy") : "Recent"}</time>
                  <div className="review-card-actions">
                    {isLong && <button type="button" className="review-read-more" onClick={() => toggleExpanded(review.id)}>{expanded ? "Show less" : "Read more"}</button>}
                    <button
                      type="button"
                      className={`review-like-toggle ${isLiked ? "is-liked" : ""}`}
                      disabled={!userData || likeBusy[review.id]}
                      aria-label={userData ? "Like this review" : "Log in to like this review"}
                      title={userData ? "Like this review" : "Log in to like this review"}
                      onClick={() => toggleLike(review.id)}
                    >
                      <FaHeart aria-hidden="true" /> {likes[review.id]?.count || 0}
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="reviews-empty" role="status">
          <span aria-hidden="true">✦</span>
          <p>{t("p6")}</p>
          <small>Your experience could be the first story we share.</small>
        </div>
      )}
    </section>
  );
}
