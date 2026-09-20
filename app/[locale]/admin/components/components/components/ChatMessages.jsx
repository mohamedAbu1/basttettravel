"use client";

import { AnimatePresence, motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { FaArrowDown, FaCheckDouble, FaClock, FaDownload, FaFile, FaRegCommentDots } from "react-icons/fa";
import { saveAs } from "file-saver";
import { useTranslation } from "react-i18next";
import { useEffect, useRef, useState } from "react";

const isImageMessage = (message) => message.message_type === "image" || message.attachment_mime?.startsWith("image/") || (message.message_type === "chat" && typeof message.content === "string" && /\.(jpeg|jpg|gif|png|webp)(\?.*)?$/i.test(message.content));

export default function ChatMessages({ messages = [], userTyping, themeName }) {
  const { t } = useTranslation("common");
  const messagesListRef = useRef(null);
  const wasNearBottomRef = useRef(true);
  const [showScrollToLatest, setShowScrollToLatest] = useState(false);
  const scrollToLatest = (behavior = "smooth") => {
    const container = messagesListRef.current;
    if (!container) return;
    container.scrollTo({ top: container.scrollHeight, behavior });
    wasNearBottomRef.current = true;
    setShowScrollToLatest(false);
  };
  useEffect(() => {
    const container = messagesListRef.current;
    if (!container) return undefined;
    const handleScroll = () => {
      const nearBottom = container.scrollHeight - container.scrollTop - container.clientHeight < 72;
      wasNearBottomRef.current = nearBottom;
      setShowScrollToLatest(!nearBottom && container.scrollHeight > container.clientHeight);
    };
    handleScroll();
    container.addEventListener("scroll", handleScroll, { passive: true });
    return () => container.removeEventListener("scroll", handleScroll);
  }, []);
  useEffect(() => {
    if (wasNearBottomRef.current) scrollToLatest();
    else setShowScrollToLatest(true);
  }, [messages]);

  const handleDownload = async (url, id) => {
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error("Unable to download image");
      saveAs(await response.blob(), `chat-image-${id}.jpg`);
    } catch (error) {
      console.error("Unable to download chat image:", error);
    }
  };

  return <div className={`admin-chat-messages ${themeName === "dark" ? "is-dark" : "is-light"}`}>
    <div className="admin-chat-thread-label"><span><FaRegCommentDots /> Live conversation</span><small>{messages.length} messages</small></div>
    <div ref={messagesListRef} className="admin-chat-message-list" aria-live="polite">
      <AnimatePresence initial={false}>
        {messages.length > 0 ? messages.map((message) => {
          const isAdmin = message.sender_type === "admin";
          const imageMessage = isImageMessage(message);
          return <motion.article key={message.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: .25 }} className={`admin-message-row ${isAdmin ? "is-admin" : "is-user"}`}>
            <img src={message.user_image || "/default-avatar.png"} alt="" className="admin-message-avatar" />
            <div className="admin-message-stack"><div className="admin-message-author"><strong>{isAdmin ? "You · Admin" : message.user_name || "Traveler"}</strong><span>{message.created_at ? formatDistanceToNow(new Date(message.created_at), { addSuffix: true }) : ""}</span></div>
              <div className="admin-message-bubble">{imageMessage ? <div className="admin-message-image-wrap"><img src={message.content} alt="Shared attachment" className="admin-message-image" /><button type="button" onClick={() => handleDownload(message.content, message.id)} className="admin-message-download" aria-label="Download image"><FaDownload /></button></div> : message.message_type === "file" ? <button type="button" className="admin-chat-file" onClick={() => window.open(message.content, "_blank", "noopener,noreferrer")}><FaFile /><span>{message.attachment_name || "Download attachment"}</span><FaDownload /></button> : <p>{message.content || ""}</p>}<div className="admin-message-meta"><FaClock /><span>{message.created_at ? new Date(message.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}</span>{isAdmin && message.status && <><FaCheckDouble className="admin-message-status" /><span>{message.status === "seen" ? "Seen" : "Sent"}</span></>}</div></div>
            </div>
          </motion.article>;
        }) : <div className="admin-chat-empty"><FaRegCommentDots /><h3>{t("noMessages")}</h3><p>Start a thoughtful conversation with this traveler.</p></div>}
      </AnimatePresence>
      {userTyping && <div className="admin-typing-indicator"><span /><span /><span /> Traveler is typing</div>}
    </div>
    {showScrollToLatest && <button type="button" className="chat-scroll-latest admin-scroll-latest" onClick={() => scrollToLatest()} aria-label="Scroll to latest message" title="Scroll to latest message"><FaArrowDown /></button>}
  </div>;
}
