"use client";
import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "@/context/AuthContext"; 

const ReviewsContext = createContext();

export function ReviewsProvider({ children }) {
  const { userData } = useAuth(); 
  const [reviewsByTrip, setReviewsByTrip] = useState({});
  const [allReviews, setAllReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [likes, setLikes] = useState({});
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
      data.forEach((review) => {
        if (review.trip_id) {
          if (!grouped[review.trip_id]) grouped[review.trip_id] = [];
          grouped[review.trip_id].push(review);
          if (review?.id) fetchLikes(review.id);
        }
      });
      setReviewsByTrip(grouped);
    } catch (err) {
      console.error("❌ Error fetching all reviews:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllReviews();
  }, []);

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

  // ✅ إضافة لايك
 const addLike = async (reviewId, userId) => {
  if (!reviewId || !userId) return;

    try {
      const res = await axios.post(`/api/reviews/${reviewId}/like`, {
        user_id: userData.id,
      });

      if (!res.data?.error) {
        setLikes((prev) => ({
          ...prev,
          [reviewId]: {
            count: (prev[reviewId]?.count || 0) + 1,
            users: [...(prev[reviewId]?.users || []), userData.id],
          },
        }));
      }
    } catch (err) {
      console.error("❌ Error adding like:", err);
    }
  };

  // ✅ إزالة لايك
  const removeLike = async (reviewId) => {
    if (!user?.id) return;

    try {
      const res = await axios.delete(`/api/reviews/${reviewId}/like`, {
        data: { user_id: userData.id },
      });

      if (!res.data?.error) {
        setLikes((prev) => ({
          ...prev,
          [reviewId]: {
            count: Math.max((prev[reviewId]?.count || 1) - 1, 0),
            users: (prev[reviewId]?.users || []).filter((id) => id !== userData.id),
          },
        }));
      }
    } catch (err) {
      console.error("❌ Error removing like:", err);
    }
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
      setReviewsByTrip((prev) => ({
        ...prev,
        [tripId]: (prev[tripId] || []).filter((review) => review.id !== reviewId),
      }));

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
        fetchReviewsByTrip,
        fetchAllReviews,
        addReview,
        fetchLikes,
        addLike,
        removeLike,
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
