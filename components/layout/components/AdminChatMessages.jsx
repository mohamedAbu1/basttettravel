"use client";
import React, { useEffect,useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCheck, FaClock, FaDownload, FaFile, FaComments } from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";

export default function AdminChatMessages({ messages, themeName }) {
    const messagesEndRef = useRef(null);
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  const isImageMessage = (message) => message.message_type === "image" || message.attachment_mime?.startsWith("image/") || /\.(jpeg|jpg|gif|png|webp)$/i.test(message.attachment_name || "") || (typeof message.content === "string" && /\.(jpeg|jpg|gif|png|webp)(\?.*)?$/i.test(message.content));
  const openAttachment = (message) => window.open(message.content, "_blank", "noopener,noreferrer");
  return (
    <div className={`chat-messages-list admin-messages-list ${themeName === "dark" ? "is-dark" : "is-light"}`}>
      {messages.map((msg) => (
        <motion.div
          key={msg.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className={`chat-message-row ${msg.sender_type === "user" ? "is-user" : "is-admin"}`}
        >
          <div className={`chat-message-avatar ${msg.sender_type === "admin" ? "is-admin" : "is-user"}`}>
            <img src={msg.sender_type === "admin"
              ? themeName === "dark" ? "/brand/basttet-travel-mark-dark.svg" : "/brand/basttet-travel-mark-light.svg"
              : msg.user_image || "/default-avatar.png"}
              alt={msg.sender_type === "admin" ? "Basttet Travel support" : msg.user_name || "Traveler"} />
          </div>
          <div className="chat-message-stack">
            <div className="chat-message-bubble">
              <div className="chat-message-meta"><span>{msg.sender_type === "admin" ? "Basttet Travel" : msg.user_name || "Traveler"}</span>{msg.sender_type === "admin" && <span className="chat-message-role">Admin</span>}</div>

            {isImageMessage(msg) ? (
              <div className="chat-attachment"><img src={msg.content} alt={msg.attachment_name || "Shared image"} /><button type="button" onClick={() => openAttachment(msg)} aria-label="Download image" className="admin-message-download"><FaDownload /></button></div>
            ) : msg.message_type === "file" || (typeof msg.content === "string" && msg.content.includes("/api/messages/files/")) ? (
              <button type="button" className="admin-chat-file" onClick={() => openAttachment(msg)}><FaFile /><span>{msg.attachment_name || "Download attachment"}</span><FaDownload /></button>
            ) : (
              <p className="chat-message-text">{msg.content}</p>
            )}

            <div className="chat-message-footer">
              <span>{msg.created_at ? formatDistanceToNow(new Date(msg.created_at), { addSuffix: true }) : ""}</span>
              {msg.status && <span className="chat-message-status"><FaCheck /> {msg.status === "sent" ? "Sent" : "Seen"}</span>}
              <FaClock aria-hidden="true" />
            </div>
            </div>
          </div>
        </motion.div>
      ))}
      {!messages.length && <div className="chat-empty-state"><span className="chat-empty-icon"><FaComments /></span><p>No messages yet</p><small>Start the conversation with this traveler.</small></div>}
    </div>
  );
}
