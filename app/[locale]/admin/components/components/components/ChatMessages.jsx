"use client";

import { AnimatePresence, motion } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { FaCheckDouble, FaClock, FaDownload, FaImage, FaRegCommentDots } from "react-icons/fa";
import { saveAs } from "file-saver";
import { useTranslation } from "react-i18next";

const isImageMessage = (content) => typeof content === "string" && (content.startsWith("data:image/") || /^https?:\/\/.*\.(jpeg|jpg|gif|png|webp)(\?.*)?$/i.test(content));

export default function ChatMessages({ messages = [], userTyping, themeName }) {
  const { t } = useTranslation("common");

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
    <div className="admin-chat-message-list" aria-live="polite">
      <AnimatePresence initial={false}>
        {messages.length > 0 ? messages.map((message) => {
          const isAdmin = message.sender_type === "admin";
          const imageMessage = isImageMessage(message.content);
          return <motion.article key={message.id} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: .25 }} className={`admin-message-row ${isAdmin ? "is-admin" : "is-user"}`}>
            <img src={message.user_image || "/default-avatar.png"} alt="" className="admin-message-avatar" />
            <div className="admin-message-stack"><div className="admin-message-author"><strong>{isAdmin ? "You · Admin" : message.user_name || "Traveler"}</strong><span>{message.created_at ? formatDistanceToNow(new Date(message.created_at), { addSuffix: true }) : ""}</span></div>
              <div className="admin-message-bubble">{imageMessage ? <div className="admin-message-image-wrap"><img src={message.content} alt="Shared attachment" className="admin-message-image" /><button type="button" onClick={() => handleDownload(message.content, message.id)} className="admin-message-download" aria-label="Download image"><FaDownload /></button></div> : <p>{message.content || ""}</p>}<div className="admin-message-meta"><FaClock /><span>{message.created_at ? new Date(message.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) : ""}</span>{isAdmin && message.status && <><FaCheckDouble className="admin-message-status" /><span>{message.status === "seen" ? "Seen" : "Sent"}</span></>}</div></div>
            </div>
          </motion.article>;
        }) : <div className="admin-chat-empty"><FaRegCommentDots /><h3>{t("noMessages")}</h3><p>Start a thoughtful conversation with this traveler.</p></div>}
      </AnimatePresence>
      {userTyping && <div className="admin-typing-indicator"><span /><span /><span /> Traveler is typing</div>}
    </div>
  </div>;
}
