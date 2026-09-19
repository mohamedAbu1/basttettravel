"use client";
import { createContext, useContext, useState } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext"; 

const ReviewsContext = createContext();

export function ReviewsProvider({ children }) {
  const { userData } = useAuth(); 
  const [reviewsByTrip, setReviewsByTrip] = useState({});
  const [allReviews, setAllReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [likes, setLikes] = useState({});
  const [likeBusy, setLikeBusy] = useState({});
  // ✅ جلب التعليقات الخاصة برحلة معينة
  const fetchReviewsByTrip = async (tripId) => {
    if (!tripId) return;
    setLoading(true);
    try {
      const res = await axios.get(`/api/reviews?tripId=${tripId}`);
      const data = res.data?.reviews || [];
      const filtered = data.filter((review) => review.trip_id === tripId);

      setReviewsByTrip((prev) => ({ ...prev, [tripId]: filtered }));

      filtered.forEach((review) => {
        if (review?.id) fetchLikes(review.id);
      });
    } catch (err) {
      console.error("❌ Error fetching reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ جلب جميع التعليقات
  const fetchAllReviews = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`/api/reviews`);
      const data = res.data?.reviews || [];
      setAllReviews(data);

      const grouped = {};
      const initialLikes = {};
      data.forEach((review) => {
        if (review.trip_id) {
          if (!grouped[review.trip_id]) grouped[review.trip_id] = [];
          grouped[review.trip_id].push(review);
          if (review?.id) initialLikes[review.id] = { count: Number(review.likes_count || 0), users: [] };
        }
      });
      setLikes(initialLikes);
      setReviewsByTrip(grouped);
    } catch (err) {
      console.error("❌ Error fetching all reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ إضافة تعليق جديد
  const addReview = async (review) => {
    if (!review.trip_id || !userData?.id) {
      return { success: false, error: "No user or trip ID" };
    }

    try {
      const res = await axios.post(`/api/reviews`, {
        trip_id: review.trip_id,
        user_id: userData.id,
        rating: review.rating,
        comment: review.comment,
        name: review.name || userData.name || userData.email,
        avatar_url: userData.avatar_url || userData?.image,
        time: review.time,
      });

      const data = res.data;
      if (data.success) {
        setReviewsByTrip((prev) => ({
          ...prev,
          [review.trip_id]: [...(prev[review.trip_id] || []), data.review],
        }));
      }
      return data;
    } catch (err) {
      console.error("❌ Error adding review:", err);
      return { success: false, error: err.message };
    }
  };

  // ✅ جلب اللايكات
  const fetchLikes = async (reviewId) => {
    try {
      const res = await axios.get(`/api/reviews/${reviewId}/like`);
      setLikes((prev) => ({
        ...prev,
        [reviewId]: {
          count: res.data?.count || 0,
          users: res.data?.users || [],
        },
      }));
    } catch (err) {
      console.error("❌ Error fetching likes:", err);
    }
  };

  // الإعجاب عملية تبديلية واحدة: الضغط الأول Like والضغط التالي Unlike.
  // هذا يمنع وجود زر Dislike وهمي لا يملك تخزينًا أو API مستقلًا.
  const toggleLike = async (reviewId) => {
    const userId = userData?.id;
    if (!reviewId || !userId || likeBusy[reviewId]) {
      return { success: false, error: "Authentication required or request is busy" };
    }

    const current = likes[reviewId] || { count: 0, users: [] };
    const isLiked = current.users.some((id) => String(id) === String(userId));
    const previous = current;
    const next = isLiked
      ? {
          count: Math.max(current.count - 1, 0),
          users: current.users.filter((id) => String(id) !== String(userId)),
        }
      : { count: current.count + 1, users: [...current.users, userId] };

    setLikeBusy((prev) => ({ ...prev, [reviewId]: true }));
    setLikes((prev) => ({ ...prev, [reviewId]: next }));

    try {
      const res = isLiked
        ? await axios.delete(`/api/reviews/${reviewId}/like`)
        : await axios.post(`/api/reviews/${reviewId}/like`);

      if (!res.data?.ok) throw new Error(res.data?.error || "Like request failed");
      return { success: true, liked: !isLiked };
    } catch (err) {
      setLikes((prev) => ({ ...prev, [reviewId]: previous }));
      console.error("❌ Error toggling like:", err);
      return { success: false, error: err.message };
    } finally {
      setLikeBusy((prev) => ({ ...prev, [reviewId]: false }));
    }
  };

  const addLike = async (reviewId, userId) => {
    if (!userData?.id || String(userData.id) !== String(userId)) return;
    const current = likes[reviewId];
    const alreadyLiked = current?.users?.some((id) => String(id) === String(userId));
    if (!alreadyLiked) return toggleLike(reviewId);
  };

  const removeLike = async (reviewId) => {
    const userId = userData?.id;
    const current = likes[reviewId];
    const alreadyLiked = current?.users?.some((id) => String(id) === String(userId));
    if (userId && alreadyLiked) return toggleLike(reviewId);
  };

  // ✅ جلب لايكات المستخدم
  const getUserLikes = (userId) => {
    if (!userId) return [];

    const userReviews = allReviews.filter((review) => review.user_id === userId);

    return userReviews.map((review) => ({
      reviewId: review.id,
      tripId: review.trip_id,
      tripTitle: review.trip?.title?.en || "Unknown Trip",
      comment: review.comment,
      rating: review.rating,
      authorName: review.name,
      likes: likes[review.id]?.count || 0,
      users: likes[review.id]?.users || [],
    }));
  };
// ✅ حذف تعليق
const deleteReview = async (reviewId) => {
  if (!reviewId) {
    return { success: false, error: "Missing reviewId or tripId" };
  }

  try {
    const res = await axios.delete(`/api/reviews/${reviewId}`, {
      data: { user_id: userData.id }, // للتأكد أن المستخدم هو صاحب التعليق أو عندك صلاحيات
    });

    const data = res.data;
    if (data.success) {
      // تحديث التعليقات الخاصة بالرحلة
      setReviewsByTrip((prev) => Object.fromEntries(
        Object.entries(prev).map(([tripId, reviews]) => [
          tripId,
          reviews.filter((review) => review.id !== reviewId),
        ]),
      ));

      // تحديث جميع التعليقات
      setAllReviews((prev) => prev.filter((review) => review.id !== reviewId));

      // إزالة اللايكات الخاصة بالتعليق المحذوف
      setLikes((prev) => {
        const updated = { ...prev };
        delete updated[reviewId];
        return updated;
      });
    }

    return data;
  } catch (err) {
    console.error("❌ Error deleting review:", err);
    return { success: false, error: err.message };
  }
};

  return (
    <ReviewsContext.Provider
      value={{
        reviewsByTrip,
        allReviews,
        loading,
        userData,
        likes,
        likeBusy,
        fetchReviewsByTrip,
        fetchAllReviews,
        addReview,
        fetchLikes,
        addLike,
        removeLike,
        toggleLike,
        getUserLikes,
        deleteReview,
      }}
    >
      {children}
    </ReviewsContext.Provider>
  );
}

export function useReviews() {
  return useContext(ReviewsContext);
}
