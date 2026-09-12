"use client";
import { useEffect, useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "react-i18next";
import { useReviews } from "@/context/ReviewsContext";
import { useAuth } from "@/context/AuthContext";
import EgyptianBackground from "@/components/layout/EgyptianBackground";
import ReviewsHeader from "./components/ReviewsHeader";
import StarRating from "./components/StarRating";
import ReviewForm from "./components/ReviewForm";
import ReviewCard from "./components/ReviewCard";

export default function TripReviews({ trip, lang }) {
  const { theme } = useTheme();
  const {
    reviewsByTrip,
    addReview,
    deleteReview,
    updateReview,
    likes,
    addLike,
    fetchReviewsByTrip,
    removeLike,
  } = useReviews();
  const { userData } = useAuth();
  const { t } = useTranslation("tripsId");

  useEffect(() => {
    const loadReviews = async () => {
      if (trip?.id) {
        await fetchReviewsByTrip(trip.id);
      }
    };
    loadReviews();
  }, [trip?.id]);

  const translations = {
    en: { title: "Reviews & Ratings", average: "Average", placeholder: "Write your review...", submit: "Submit Review", login: "Please log in to write a review", first: "Be the first to review this trip ✨", prev: "Previous", next: "Next" },
    de: { title: "Bewertungen", average: "Durchschnitt", placeholder: "Schreiben Sie Ihre Bewertung...", submit: "Bewertung senden", login: "Bitte melden Sie sich an, um eine Bewertung zu schreiben", first: "Seien Sie der Erste, der diese Reise bewertet ✨", prev: "Zurück", next: "Weiter" },
    it: { title: "Recensioni e valutazioni", average: "Media", placeholder: "Scrivi la tua recensione...", submit: "Invia recensione", login: "Accedi per scrivere una recensione", first: "Sii il primo a recensire questo viaggio ✨", prev: "Precedente", next: "Successivo" },
    es: { title: "Reseñas y calificaciones", average: "Promedio", placeholder: "Escribe tu reseña...", submit: "Enviar reseña", login: "Inicia sesión para escribir una reseña", first: "Sé el primero en reseñar este viaje ✨", prev: "Anterior", next: "Siguiente" },
    zh: { title: "评论与评分", average: "平均", placeholder: "写下你的评论...", submit: "提交评论", login: "请登录后发表评论", first: "成为第一个评价此行程的人 ✨", prev: "上一页", next: "下一页" },
    fr: { title: "Avis et notes", average: "Moyenne", placeholder: "Écrivez votre avis...", submit: "Envoyer l'avis", login: "Connectez-vous pour écrire un avis", first: "Soyez le premier à évaluer ce voyage ✨", prev: "Précédent", next: "Suivant" },
  };

  const tr = translations[lang] || translations.en;

  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const [currentPage, setCurrentPage] = useState(1);
  const commentsPerPage = 4;

  const tripReviews = reviewsByTrip[trip.id] || [];

  const indexOfLastComment = currentPage * commentsPerPage;
  const indexOfFirstComment = indexOfLastComment - commentsPerPage;
  const currentComments = [...tripReviews]
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(indexOfFirstComment, indexOfLastComment);

  const totalPages = Math.ceil(tripReviews.length / commentsPerPage);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!comment.trim() || rating === 0 || !userData) return;

    await addReview({
      trip_id: trip.id,
      user_id: userData.id,
      rating,
      comment,
      name: userData?.name || userData.email,
      avatar_url: userData?.avatar_url || userData?.image,
      time: new Date().toLocaleTimeString(),
    });

    setComment("");
    setRating(0);
  };

  const averageRating =
    tripReviews.length > 0
      ? (tripReviews.reduce((acc, r) => acc + r.rating, 0) / tripReviews.length).toFixed(1)
      : 0;

  const onEmojiClick = (emojiData) => {
    setComment(comment + emojiData.emoji);
  };

  return (
    <section className={`p-6 rounded-xl transition ${theme.card} ${theme.shadow} ${theme.text}`}>
      <EgyptianBackground />

      {/* العنوان + المتوسط */}
      <ReviewsHeader
        title={tr.title}
        average={tr.average}
        averageRating={averageRating}
        reviewsCount={tripReviews.length}
        theme={theme}
      />

      {userData && userData?.role !== "ADMIN" && (
        <>
          {/* تقييم النجوم */}
          <StarRating
            rating={rating}
            setRating={setRating}
            hover={hover}
            setHover={setHover}
            theme={theme}
          />

          {/* نموذج إضافة تعليق */}
          <ReviewForm
            comment={comment}
            setComment={setComment}
            showEmojiPicker={showEmojiPicker}
            setShowEmojiPicker={setShowEmojiPicker}
            onEmojiClick={onEmojiClick}
            onSubmit={handleSubmit}
            placeholder={tr.placeholder}
            submitLabel={tr.submit}
            theme={theme}
          />
        </>
      )}

      {/* عرض التعليقات */}
      <div className="flex flex-row flex-wrap mt-6 gap-6 space-y-4">
        <EgyptianBackground />
        {currentComments.map((rev, idx) => (
          <ReviewCard
            key={rev.id || idx}
            rev={rev}
            idx={idx}
            user={userData}
            deleteReview={deleteReview}
            updateReview={updateReview}
            theme={theme}
            likes={likes}
            addLike={addLike}
            removeLike={removeLike}
          />
        ))}
        {tripReviews.length === 0 && (
          <p className={`text-center w-full opacity-70 ${theme.subText}`}>
            {!userData
              ? tr.login
              : tr.first}
          </p>
        )}
      </div>

      {/* الباجينيشن */}
      {totalPages > 1 && (
        <div className="flex justify-center mt-6 gap-2">
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => prev - 1)}
            style={{ cursor: "pointer" }}
            className={`px-3 py-1 rounded-lg font-semibold transition ${
              currentPage === 1 ? "bg-gray-300 text-gray-500 cursor-not-allowed" : theme.buttonSecondary
            }`}
          >
            {tr.prev}
          </button>

          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              style={{ cursor: "pointer" }}
              className={`px-3 py-1 rounded-lg font-semibold transition ${
                currentPage === i + 1 ? theme.buttonPrimary : theme.buttonSecondary
              }`}
            >
              {i + 1}
            </button>
          ))}

          <button
            disabled={currentPage === totalPages}
            onClick={() => setCurrentPage((prev) => prev + 1)}
            style={{ cursor: "pointer" }}
            className={`px-3 py-1 rounded-lg font-semibold transition ${
              currentPage === totalPages ? "bg-gray-300 text-gray-500 cursor-not-allowed" : theme.buttonSecondary
            }`}
          >
            {tr.next}
          </button>
        </div>
      )}
    </section>
  );
}
