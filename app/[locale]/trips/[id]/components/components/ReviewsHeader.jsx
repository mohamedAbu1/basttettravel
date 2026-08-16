"use client";
import { FaStar } from "react-icons/fa";

export default function ReviewsHeader({ title, averageRating,average, reviewsCount, theme, t }) {
  return (
    <div className={`flex flex-col lg:flex-row items-center justify-between mb-6 border-b p-2 ${theme.border}`}>
      <h2 className={`text-2xl font-bold flex items-center gap-2 ${theme.title}`}>
        {title}
      </h2>
      {reviewsCount > 0 && (
        <div className="flex items-center gap-2">
          <span className={`font-semibold ${theme.subText}`}>{average}</span>
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                size={20}
                className={
                  i < Math.round(averageRating)
                    ? theme.icon
                    : "text-gray-400"
                }
              />
            ))}
          </div>
          <span className={`ml-2 ${theme.subText}`}>({averageRating})</span>
        </div>
      )}
    </div>
  );
}
