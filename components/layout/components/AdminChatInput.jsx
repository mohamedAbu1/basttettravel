"use client";
import React from "react";
import { motion } from "framer-motion";
import { FaImage, FaPaperPlane, FaSmile } from "react-icons/fa";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { useState } from "react";

export default function AdminChatInput({
  text,
  setText,
  handleSend,
  themeName,
  handleSendImage,
  user,
}) {
const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  return (
    <div className="chat-input-bar">
      {/* <label className="cursor-pointer">
        <FaImage size={20} className={theme.icon} />
        <input
          type="file"
          accept="image/*"
          onChange={(e) => { const file = e.target.files[0]; if (file) { handleSendImage(file); } }}
          className="hidden"
        />
      </label> */}
      <input
        aria-label="Type your message"
        type="text"
        placeholder="Type your message..."
        value={text}
        onChange={(e) => {
          setText(e.target.value);
          fetch("/api/typing", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId: user.id,
              adminTyping: e.target.value.length > 0,
            }),
          });
        }}
        onBlur={() => {
          if (user?.id) fetch("/api/typing", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId: user.id, adminTyping: false }) });
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
        aria-label="Send message"
        style={{ cursor: "pointer" }}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleSend}
        className="chat-send-button"
      >
        <FaPaperPlane aria-hidden="true" /> <span>Send</span>
      </motion.button>
    </div>
  );
}

