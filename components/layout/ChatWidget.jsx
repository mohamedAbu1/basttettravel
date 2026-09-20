"use client";
import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import { useMessages } from "@/context/MessageContext";
import { FaComments } from "react-icons/fa";
import EgyptianBackground from "@/components/layout/EgyptianBackground";
import { useAuth } from "@/context/AuthContext";
import ChatHeader from "./components/ChatHeader";
import ChatMessages from "./components/ChatMessages";
import ChatInput from "./components/ChatInput";
import { useChat } from "@/context/ChatContext";
import { useTranslation } from "react-i18next";
export default function ChatWidget({ setShowEmojiPicker, showEmojiPicker }) {
  const { theme, themeName } = useTheme();
  const { messages, sendMessage, fetchMessages, markMessageSeen, setMessages } =
    useMessages();
  const [text, setText] = useState("");
  const { userData } = useAuth(); // ✅ بيانات من AuthContext
  const [adminTyping, setAdminTyping] = useState(false);
  const welcomeRequestedRef = useRef(null);
  const {
    open,
    bookingMode,
    from,
    setFrom,
    setOpen,
    to,
    setTo,
    setBookingMode,
    setMessageses,
  } = useChat();
  const { t } = useTranslation("home");
  const { t: commonT } = useTranslation("common");

  // ✅ جلب رسائل المستخدم
  useEffect(() => {
    if (!userData?.id || userData?.role === "ADMIN") return;
    fetchMessages(userData.id);
    const interval = setInterval(() => fetchMessages(userData.id), 3000);
    return () => clearInterval(interval);
  }, [userData?.id, userData?.role]);

  // ✅ تحديث حالة الرسائل إلى "seen"
  useEffect(() => {
    // Keep admin messages unread while the chat is closed so the trigger can
    // notify the traveler. Opening the chat marks them as seen.
    if (open && userData?.id && messages.length > 0) {
      messages.forEach((msg) => {
        if (msg.sender_type === "admin" && msg.status === "sent") {
          markMessageSeen(msg.id);
        }
      });
    }
  }, [open, userData, messages]);
  useEffect(() => {
    if (!userData?.id || userData?.role === "ADMIN" || welcomeRequestedRef.current === userData.id) return;
    welcomeRequestedRef.current = userData.id;
    fetch("/api/messages/welcome", { method: "POST" })
      .then(() => fetchMessages(userData.id))
      .catch((error) => console.error("Welcome message request failed:", error));
  }, [userData?.id, userData?.role]);

  // ✅ استعلام حالة الكتابة للأدمن
  useEffect(() => {
    if (!userData?.id) return;
    const interval = setInterval(async () => {
      const res = await fetch(`/api/typing?userId=${userData.id}`);
      const data = await res.json();
      setAdminTyping(data.adminTyping || false);
    }, 2000);
    return () => clearInterval(interval);
  }, [userData?.id]);

  const handleSend = async () => {
    if (text.trim() !== "") {
      await sendMessage({
        user_id: userData?.id,
        user_name: userData?.name,
        user_image:
          userData?.avatar_url || userData?.image || "/default-avatar.png",
        content: text,
        sender_type: "user",
        status: "sent",
      });
      setText("");
    }
  };

  const isAdmin = userData?.role === "ADMIN";
  const unreadAdminMessages = messages.filter(
    (message) => message.sender_type === "admin" && message.status === "sent",
  ).length;

  const handleSendFile = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    // ✅ لازم تبعت بيانات المستخدم مع الصورة
    formData.append("user_id", userData?.id);
    formData.append("user_name", userData?.name || "Unknown User");
    formData.append(
      "user_image",
      userData?.avatar_url || userData?.image || "/default-avatar.png",
    );
    formData.append("sender_type", "user");
    formData.append("admin_id", "SYSTEM"); // أو أي قيمة مناسبة

    const res = await fetch("/api/messages", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    if (!res.ok || !data.content) return;

    // The multipart endpoint already inserts the message. Add its response to
    // local state instead of POSTing the same image a second time.
    setMessages((prev) => [...prev, data]);
  };

  return (
    <>
      {!isAdmin && (
        <motion.button
          style={{ cursor: "pointer" }}
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close support chat" : "Open support chat"}
          title={open ? "Close support chat" : "Chat with Basttet Travel"}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className={`chat-widget-trigger fixed bottom-6 right-6 rounded-full shadow-lg flex items-center justify-center ${theme.buttonPrimary}`}
        >
          <span className="chat-trigger-icon"><FaComments aria-hidden="true" /></span>
          <span className="chat-trigger-copy">
            <strong>{commonT("chatWithUs", { defaultValue: "Chat with us" })}</strong>
            <small>{commonT("supportOnline", { defaultValue: "We are here to help" })}</small>
          </span>
          <span className="chat-trigger-status" aria-hidden="true" />
          {!open && unreadAdminMessages > 0 && (
            <span className="chat-trigger-unread" aria-label={`${unreadAdminMessages} new messages`}>
              {unreadAdminMessages > 9 ? "9+" : unreadAdminMessages}
            </span>
          )}
        </motion.button>
      )}

      <AnimatePresence>
        {open && !isAdmin && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
          className="chat-widget-panel fixed overflow-x-hidden bottom-20 right-2 lg:right-6 w-90 lg:w-110 h-125 rounded-xl shadow-xl flex flex-col z-50"
          >
            <EgyptianBackground />
            <ChatHeader onClose={() => setOpen(false)} theme={theme} />
            <ChatMessages
              messages={messages}
              adminTyping={adminTyping}
              themeName={themeName}
            />

            {bookingMode ? (
              <div className="chat-booking-card">
                <p className="chat-booking-title">
                  {commonT("carBookingPrompt")}
                </p>

                <input
                  type="text"
                  placeholder={commonT("from")}
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  className="chat-message-input chat-booking-input"
                />

                <input
                  type="text"
                  placeholder={commonT("to")}
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  className="chat-message-input chat-booking-input"
                />

                <button
                  onClick={() => {
                    const bookingMessage = `🚗 Car booking request from ${from} to ${to}`;
                    setText(bookingMessage); // ✅ يملأ النص
                    handleSend(); // يرسل الرسالة للـ backend
                    setMessageses((prev) => [
                      ...prev,
                      {
                        sender: "assistant",
                        content:
                          commonT("bookingRecorded"),
                      },
                    ]);
                    setBookingMode(false);
                  }}
                  type="button"
                  className="chat-send-button chat-booking-submit"
                >
                  Confirm Booking
                </button>
              </div>
            ) : (
              <ChatInput
                text={text}
                setText={setText}
                handleSend={handleSend}
                handleSendFile={handleSendFile}
                theme={theme}
                themeName={themeName}
                user={userData}
                setShowEmojiPicker={setShowEmojiPicker}
                showEmojiPicker={showEmojiPicker}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
