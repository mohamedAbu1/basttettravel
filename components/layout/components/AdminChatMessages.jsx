"use client";
import React, { useEffect,useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCheck, FaClock, FaDownload, FaExpand, FaComments } from "react-icons/fa";
import { formatDistanceToNow } from "date-fns";

export default function AdminChatMessages({ messages, themeName }) {
    const messagesEndRef = useRef(null);
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
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

            {typeof msg.content === "string" && msg.content.startsWith("http") ? (
              <div className="chat-attachment"><img src={msg.content} alt="uploaded" /></div>
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
