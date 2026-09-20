"use client"
import { motion, AnimatePresence } from "framer-motion";
import { formatDistanceToNow } from "date-fns";
import { saveAs } from "file-saver";
import { FaCheck, FaClock, FaDownload, FaExpand, FaComments, FaFile } from "react-icons/fa";
import { useEffect ,useRef} from "react";
import { useTranslation } from "react-i18next";

export default function ChatMessages({ messages, adminTyping, themeName }) {
    const { t } = useTranslation("common");
    const messagesEndRef = useRef(null);
   useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);
  const handleDownload = async (url, id) => {
    const response = await fetch(url);
    const blob = await response.blob();

    const img = new Image();
    img.src = URL.createObjectURL(blob);

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      canvas.toBlob(
        (newBlob) => {
          saveAs(newBlob, `chat-image-${id}.jpg`);
        },
        "image/jpeg",
        0.7
      );
    };
  };
  const isImageMessage = (message) => message.message_type === "image" || (message.message_type === "chat" && typeof message.content === "string" && message.content.match(/\.(jpeg|jpg|gif|png|webp)(\?.*)?$/i));

  return (
    <div className={`chat-messages-list ${themeName === "dark" ? "is-dark" : "is-light"}`}>
      <AnimatePresence>
        {messages.length > 0 ? (
          messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className={`chat-message-row ${msg.sender_type === "user" ? "is-user" : "is-admin"}`}
            >
              <div className={`chat-message-avatar ${msg.sender_type === "admin" ? "is-admin" : "is-user"}`}>
                <img
                  src={msg.sender_type === "admin"
                    ? themeName === "dark" ? "/brand/basttet-travel-mark-dark.svg" : "/brand/basttet-travel-mark-light.svg"
                    : msg.user_image || "/default-avatar.png"}
                  alt={msg.sender_type === "admin" ? "Basttet Travel support" : msg.user_name || "Traveler"}
                />
              </div>
              <div className="chat-message-stack">
                <div className="chat-message-bubble">
                  <div className="chat-message-meta">
                    <span>{msg.sender_type === "admin" ? "Basttet Travel" : msg.user_name || "Traveler"}</span>
                    {msg.sender_type === "admin" && <span className="chat-message-role">Support</span>}
                  </div>

                  {isImageMessage(msg) ? (
                  <div className="chat-attachment group">
                    <img
                      src={msg.content}
                      alt="uploaded"
                      className="w-full rounded-lg object-cover"
                    />
                    <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button type="button"
                        onClick={() => handleDownload(msg.content, msg.id)}
                        className={`flex items-center gap-2 px-3 py-1 text-xs font-medium rounded shadow ${
                          themeName === "dark"
                            ? "bg-gray-700 text-white hover:bg-gray-600"
                            : "bg-blue-500 text-white hover:bg-blue-600"
                        } transition`}
                      >
                        <FaDownload className="text-sm" /> Download
                      </button>
                      <button type="button"
                        onClick={() => window.open(msg.content, "_blank")}
                        className={`flex items-center gap-2 px-3 py-1 text-xs font-medium rounded shadow ${
                          themeName === "dark"
                            ? "bg-gray-700 text-white hover:bg-gray-600"
                            : "bg-green-500 text-white hover:bg-green-600"
                        } transition`}
                      >
                        <FaExpand className="text-sm" /> View
                      </button>
                    </div>
                  </div>
                  ) : msg.message_type === "file" ? (
                    <button type="button" className="chat-file-attachment" onClick={() => window.open(msg.content, "_blank", "noopener,noreferrer")}>
                      <FaFile /><span>{msg.attachment_name || "Download attachment"}</span><FaDownload />
                    </button>
                  ) : (
                    <p className="chat-message-text">{msg.content}</p>
                  )}

                  <div className="chat-message-footer">
                    <span>
                    {msg.created_at
                      ? formatDistanceToNow(new Date(msg.created_at), {
                          addSuffix: true,
                        })
                      : ""}
                    </span>
                    {msg.status && msg.sender_type === "user" && <span className="chat-message-status"><FaCheck /> {msg.status === "sent" ? "Sent" : "Seen"}</span>}
                    <FaClock aria-hidden="true" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        ) : (
          <div className="chat-empty-state">
            <span className="chat-empty-icon"><FaComments /></span>
            <p>{t("noMessages")}</p>
            <small>{t("carBookingPrompt")}</small>
          </div>
        )}
      </AnimatePresence>

      {adminTyping && <p className="chat-typing-indicator"><span /><span /><span /> {t("adminTyping")}</p>}
      <div ref={messagesEndRef} aria-hidden="true" />
    </div>
  );
}
