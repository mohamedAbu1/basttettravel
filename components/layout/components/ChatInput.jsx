"use client";
import { motion } from "framer-motion";
import { FaFile, FaPaperPlane, FaSmile } from "react-icons/fa";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function ChatInput({
  text,
  setText,
  handleSend,
  handleSendImage,
  handleSendFile,
  themeName,
  user,
}) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const { t } = useTranslation("home");
  const { t: commonT } = useTranslation("common");

  return (
    <div className="chat-input-bar">
      <label className="chat-icon-button" aria-label="Attach image or file">
        <FaFile className="text-lg" />
        <input
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif,application/pdf,.txt,.doc,.docx,.xls,.xlsx,.zip"
          onChange={(e) => { const file = e.target.files?.[0]; if (file) handleSendFile?.(file); e.target.value = ""; }}
          className="hidden"
        />
      </label>
      <input
        aria-label={commonT("typeMessage")}
        type="text"
        placeholder={commonT("typeMessage")}
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          fetch("/api/typing", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId: user.id,
              isTyping: e.target.value.length > 0,
            }),
          });
        }}
        onBlur={() => {
          if (user?.id) fetch("/api/typing", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId: user.id, isTyping: false }) });
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            handleSend();
          }
        }}
        className="chat-message-input"
      />
      <button
        type="button"
        aria-label="Add emoji"
        onClick={() => setShowEmojiPicker(!showEmojiPicker)}
        className="chat-icon-button"
      >
        <FaSmile className="text-lg" />
      </button>
      {showEmojiPicker && (
        <div
          className="chat-emoji-picker"
        >
          <Picker
            data={data}
            onEmojiSelect={(emoji) => setText(text + emoji.native)}
            theme={themeName === "dark" ? "dark" : "light"}
          />
        </div>
      )}

      <motion.button
        type="button"
        aria-label={t("Send")}
        style={{ cursor: "pointer" }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleSend}
        className="chat-send-button"
      >
        <FaPaperPlane aria-hidden="true" /> <span>{t("Send")}</span>
      </motion.button>
    </div>
  );
}
