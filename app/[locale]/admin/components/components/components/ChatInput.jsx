"use client";

import { useState } from "react";
import { FaPaperclip, FaPaperPlane, FaSmile } from "react-icons/fa";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
import { useTranslation } from "react-i18next";

export default function ChatInput({ activeUser, newMessage, setNewMessage, handleSend, setIsTyping, themeName, handleSendFile }) {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const { t } = useTranslation("common");

  if (!activeUser) return <div className="admin-chat-input-empty"><span>Select a traveler to start replying.</span></div>;

  const updateTyping = (value) => {
    setNewMessage(value);
    setIsTyping(value.length > 0);
    fetch("/api/typing", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId: activeUser.id, adminTyping: value.length > 0 }) }).catch(() => {});
  };

  const handleFileUpload = (event) => {
    const file = event.target.files?.[0];
    if (file) handleSendFile?.(file);
    event.target.value = "";
  };

  const submitMessage = () => {
    if (newMessage.trim()) handleSend();
  };

  return <div className={`admin-chat-composer ${themeName === "dark" ? "is-dark" : "is-light"}`}>
    <div className="admin-chat-composer-tools"><span className="admin-chat-composer-status"><i /> Replying to <strong>{activeUser.name || "traveler"}</strong></span><span className="admin-chat-composer-hint">Enter to send · Shift + Enter for a new line</span></div>
    <div className="admin-chat-composer-box">
      <label className="admin-chat-tool-button" aria-label="Attach image or file"><FaPaperclip /><input type="file" accept="image/jpeg,image/png,image/webp,image/gif,application/pdf,.txt,.doc,.docx,.xls,.xlsx,.zip" onChange={handleFileUpload} hidden /></label>
      <textarea value={newMessage} onChange={(event) => updateTyping(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); submitMessage(); } }} placeholder={t("typeMessage")} rows={1} aria-label={t("typeMessage")} />
      <div className="admin-chat-composer-actions"><div className="admin-emoji-anchor"><button type="button" className="admin-chat-tool-button" onClick={() => setShowEmojiPicker((visible) => !visible)} aria-label="Add emoji"><FaSmile /></button>{showEmojiPicker && <div className="admin-emoji-popover"><Picker data={data} onEmojiSelect={(emoji) => { setNewMessage((current) => `${current}${emoji.native}`); setShowEmojiPicker(false); }} theme={themeName === "dark" ? "dark" : "light"} /></div>}</div><button type="button" className="admin-send-button" onClick={submitMessage} disabled={!newMessage.trim()}><FaPaperPlane /><span>Send</span></button></div>
    </div>
  </div>;
}
