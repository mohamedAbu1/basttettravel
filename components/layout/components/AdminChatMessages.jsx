"use client";
import React, { useEffect,useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaClock, FaDownload, FaExpand, FaComments } from "react-icons/fa";

export default function AdminChatMessages({ messages, themeName }) {
    const messagesEndRef = useRef(null);
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  return (
    <div className="flex-1 overflow-y-auto p-4 space-y-3">
      {messages.map((msg) => (
        <motion.div
          key={msg.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className={`flex items-start gap-3 max-w-[100%] ${
            msg.sender_type === "user"
              ? "self-start"
              : "self-end flex-row-reverse"
          }`}
        >
          <img
            src={
              msg.sender_type === "admin"
                ? themeName === "dark"
                  ? "/HomePageImage/Copilot_20260613_134423.webp"
                  : "/HomePageImage/Copilot_20260613_134550.webp"
                : msg.user_image
            }
            alt={msg.user_name}
            className={`w-12 h-12 rounded-full border ${
              msg.sender_type === "admin"
                ? themeName === "dark"
                  ? "border-yellow-500"
                  : "#41707e"
                : ""
            } object-cover`}
          />
          <div
            className={`p-3 rounded-lg shadow-md max-w-[70%] flex flex-col ${
              msg.sender_type === "user"
                ? themeName === "dark"
                  ? "bg-gray-700 text-white"
                  : "bg-gray-200 text-black"
                : themeName === "dark"
                  ? "bg-yellow-500 text-black"
                  : "bg-[#41707e] text-white"
            }`}
          >
            <p className="text-sm font-semibold mb-1 capitalize">
              {msg.sender_type === "admin"
                ? "👑 Basttet Travel 👑"
                : msg.user_name || "Basttet Travel"}
            </p>

            {msg.content.startsWith("https") ? (
              <img
                src={msg.content}
                alt="uploaded"
                className="w-full rounded-lg object-cover"
              />
            ) : (
              <p>{msg.content}</p>
            )}

            <div className="flex items-center gap-1 mt-1 text-xs opacity-70">
              <FaClock className="text-xs" />
              {/* <span className="italic">
                    {msg.created_at
                      ? formatDistanceToNow(new Date(msg.created_at), {
                          addSuffix: true,
                        })
                      : ""}
                  </span> */}
              {msg.status && (
                <span className="ml-2">
                  {msg.status === "sent" ? "✅ Sent" : "👀 Seen"}
                </span>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
