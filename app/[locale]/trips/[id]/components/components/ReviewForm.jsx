"use client";
import EmojiPicker from "emoji-picker-react";

export default function ReviewForm({
  comment,
  setComment,
  showEmojiPicker,
  setShowEmojiPicker,
  onEmojiClick,
  onSubmit,
  placeholder,
  submitLabel,
  theme,
}) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div className="w-[100%] flex items-center gap-2">
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          placeholder={placeholder}
          className={`w-[70%] p-3 rounded-lg focus:outline-none ${theme.border} ${theme.text}`}
          rows={3}
        />

        <button
          type="button"
          style={{ cursor: "pointer" }}
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className={`px-3 py-2 rounded-lg transition`}
        >
          😀
        </button>
        {showEmojiPicker && (
          <EmojiPicker
            onEmojiClick={onEmojiClick}
            theme={theme.name === "dark" ? "dark" : "light"}
          />
        )}
      </div>

      <button
        type="submit"
        style={{ cursor: "pointer" }}
        className={`px-6 py-2 rounded-lg font-semibold transition ${theme.buttonPrimary}`}
      >
        {submitLabel}
      </button>
    </form>
  );
}
