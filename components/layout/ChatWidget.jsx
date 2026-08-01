"use client";
import { useState, useEffect } from "react";
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
  const { messages, sendMessage, fetchMessages, markMessageSeen } =
    useMessages();
  const [text, setText] = useState("");
  const { userData } = useAuth(); // ✅ بيانات من AuthContext
  const [adminTyping, setAdminTyping] = useState(false);
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

  // ✅ جلب رسائل المستخدم
  useEffect(() => {
    if (userData?.id) {
      fetchMessages(userData.id);
    }
  }, [userData]);

  // ✅ تحديث حالة الرسائل إلى "seen"
  useEffect(() => {
    if (userData?.id && messages.length > 0) {
      messages.forEach((msg) => {
        if (msg.sender_type === "admin" && msg.status === "sent") {
          markMessageSeen(msg.id);
        }
      });
    }
  }, [userData, messages]);
  // ✅ فتح الدردشة بعد دقيقتين من تسجيل الدخول

  useEffect(() => {
    if (userData?.id) {
      const timer = setTimeout(async () => {
        setOpen(true); // يفتح نافذة الدردشة

        // ✅ إرسال الرسالة باسم الأدمن وليس المستخدم
        await sendMessage({
          user_id: "c7674367-18c9-4d2a-b94c-eb80ac716005", // أو ID الأدمن الحقيقي
          user_name: "👑 Basttet Travel 👑",

          user_image: "/HomePageImage/Copilot_20260613_134423.webp",
          content:
           t("welcomeMessage", { defaultValue: "👋 Hello and welcome! The Basttet Travel team is excited to help you plan your next unforgettable journey. How can we assist you today?" }),
          sender_type: "admin", // مهم جداً لتظهر الرسالة بلون الأدمن
          status: "sent",
        });
      }, 30000); //  نص دقيقه

      return () => clearTimeout(timer);
    }
  }, []);

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

  const handleSendImage = async (file) => {
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
    if (!data.url) return;

    // ✅ الرسالة الجديدة تدخل في الـ context
    await sendMessage({
      user_id: userData?.id,
      user_name: userData?.name,
      user_image:
        userData?.avatar_url || userData?.image || "/default-avatar.png",
      content: data.url, // الرابط النهائي للصورة
      sender_type: "user",
      status: "sent",
    });
  };

  return (
    <>
      {!isAdmin && (
        <motion.button
          style={{ cursor: "pointer" }}
          onClick={() => setOpen(!open)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className={`fixed bottom-6 right-6 p-4 rounded-full shadow-lg flex items-center justify-center ${theme.buttonPrimary}`}
        >
          <FaComments size={22} color="#fff" />
        </motion.button>
      )}

      <AnimatePresence>
        {open && !isAdmin && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className={`fixed overflow-x-hidden bottom-20 right-6 w-110 h-125 rounded-xl shadow-xl flex flex-col z-50 ${theme.card} ${theme.text}`}
          >
            <EgyptianBackground />
            <ChatHeader onClose={() => setOpen(false)} theme={theme} />
            <ChatMessages
              messages={messages}
              adminTyping={adminTyping}
              themeName={themeName}
            />

            {bookingMode ? (
              <div className="p-6 rounded-xl shadow-lg bg-gradient-to-br from-white to-gray-100 dark:from-gray-800 dark:to-gray-900">
                <p className="mb-4 text-lg font-semibold text-gray-800 dark:text-gray-200">
                  🚗 Where would you like to book the car from and to?
                </p>

                <input
                  type="text"
                  placeholder="From"
                  value={from}
                  onChange={(e) => setFrom(e.target.value)}
                  className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 w-full mb-3 
               focus:outline-none focus:ring-2 focus:ring-[#C2A878] dark:bg-gray-700 dark:text-white"
                />

                <input
                  type="text"
                  placeholder="To"
                  value={to}
                  onChange={(e) => setTo(e.target.value)}
                  className="border border-gray-300 dark:border-gray-600 rounded-lg px-4 py-2 w-full mb-3 
               focus:outline-none focus:ring-2 focus:ring-[#C2A878] dark:bg-gray-700 dark:text-white"
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
                          "✅ Your request has been recorded. Please select the date and time.",
                      },
                    ]);
                    setBookingMode(false);
                  }}
                  className="mt-4 w-full px-6 py-3 rounded-lg font-bold text-white 
               bg-gradient-to-r from-[#C2A878] to-[#eab308] 
               shadow-md hover:scale-105 transition-transform duration-300"
                >
                  Confirm Booking
                </button>
              </div>
            ) : (
              <ChatInput
                text={text}
                setText={setText}
                handleSend={handleSend}
                handleSendImage={handleSendImage}
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
