"use client";
import {
  FaStar,
  FaThumbsUp,
  FaThumbsDown,
  FaUserCircle,
  FaTrash,
  FaEdit,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { useState } from "react";

export default function ReviewCard({
  rev,
  idx,
  theme,
  likes,
  addLike,
  removeLike,
  deleteReview,
  updateReview,
  user,
}) {
  const isOwner = user && String(user.id) === String(rev.users?.id);
  const isAdmin = user && user?.role === "ADMIN";

  const [isEditing, setIsEditing] = useState(false);
  const [editedComment, setEditedComment] = useState(rev.comment);
  const [editedRating, setEditedRating] = useState(rev.rating);

  const handleSave = () => {
    updateReview(rev.id, {
      comment: editedComment,
      rating: editedRating,
    });
    setIsEditing(false);
  };

  return (
    <motion.div
      key={idx}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.6, delay: idx * 0.1 }}
      className={`w-[48%] p-5 rounded-xl transition ${theme.card} ${theme.shadow} ${theme.text} ${theme.border}`}
    >
      {/* رأس البطاقة */}
      <div className="flex items-center gap-4 mb-3">
        {rev.avatar_url ? (
          <img
            src={rev.avatar_url}
            alt={rev.name}
            className="w-16 h-16 rounded-full object-cover border-2"
          />
        ) : (
          <FaUserCircle size={64} className="text-gray-400" />
        )}
        <div className="flex flex-col">
          <span className={`font-bold text-lg capitalize ${theme.title}`}>
            {rev.name}
          </span>
          <span className={`text-xs opacity-70 ${theme.subText}`}>
            {rev.date || rev.time}
          </span>
        </div>
      </div>

      {/* التقييم */}
      <div className="flex items-center gap-1 mb-2">
        {[...Array(rev.rating)].map((_, i) => (
          <FaStar key={i} size={20} className={theme.icon} />
        ))}
      </div>

      {/* التعليق أو وضع التعديل */}
      {isEditing ? (
        <div className="space-y-2 mb-4">
          <textarea
            value={editedComment}
            onChange={(e) => setEditedComment(e.target.value)}
            className={`w-full p-2 rounded ${theme.border} ${theme.text}`}
          />
          <input
            type="number"
            min="1"
            max="5"
            value={editedRating}
            onChange={(e) => setEditedRating(Number(e.target.value))}
            className={`w-16 p-1 rounded ${theme.border} ${theme.text}`}
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={handleSave}
              className={`px-3 py-1 rounded ${theme.buttonPrimary}`}
            >
              Save
            </button>
            <button
              onClick={() => setIsEditing(false)}
              className={`px-3 py-1 rounded ${theme.buttonSecondary}`}
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <p className={`italic mb-4 ${theme.subText}`}>{rev.comment}</p>
      )}

      {/* أزرار التحكم */}
      <div className="flex flex-wrap items-center gap-3 mt-2">
        {/* زر لايك */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.1 }}
          onClick={() => addLike(rev.id, user?.id)}
          className={`flex items-center gap-1 px-3 py-1 rounded-md text-sm ${theme.buttonSecondary}`}
        >
          <FaThumbsUp /> {likes[rev.id]?.count || 0}
        </motion.button>

        {/* زر إزالة لايك */}
        <motion.button
          whileTap={{ scale: 0.9 }}
          whileHover={{ scale: 1.1 }}
          onClick={() => removeLike(rev.id)}
          className={`flex items-center gap-1 px-3 py-1 rounded-md text-sm ${theme.buttonSecondary}`}
        >
          <FaThumbsDown /> Unlike
        </motion.button>

        {/* صلاحيات الأدمن */}
        {isAdmin && !isOwner && (
          <motion.button
            whileTap={{ scale: 0.9 }}
            whileHover={{ scale: 1.1 }}
            onClick={() => deleteReview(rev.id)}
            className={`flex items-center gap-1 px-3 py-1 rounded-md text-sm ${theme.buttonSecondary}`}
          >
            <FaTrash /> Delete
          </motion.button>
        )}

        {/* صلاحيات المالك */}
        {isOwner && (
          <>
            {!isEditing && (
              <motion.button
                whileTap={{ scale: 0.9 }}
                whileHover={{ scale: 1.1 }}
                onClick={() => setIsEditing(true)}
                className={`flex items-center gap-1 px-3 py-1 rounded-md text-sm ${theme.buttonSecondary}`}
              >
                <FaEdit /> Edit
              </motion.button>
            )}

            <motion.button
              whileTap={{ scale: 0.9 }}
              whileHover={{ scale: 1.1 }}
              onClick={() => deleteReview(rev.id)}
              className={`flex items-center gap-1 px-3 py-1 rounded-md text-sm ${theme.buttonSecondary}`}
            >
              <FaTrash /> Delete
            </motion.button>
          </>
        )}
      </div>
    </motion.div>
  );
}
