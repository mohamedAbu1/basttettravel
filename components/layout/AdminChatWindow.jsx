"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import AdminChatMessages from "./components/AdminChatMessages";
import AdminChatInput from "./components/AdminChatInput";
import EgyptianBackground from "./EgyptianBackground";
import { useMessages } from "@/context/MessageContext";
import { FaTimes } from "react-icons/fa";
import { useChat } from "@/context/ChatContext";

export default function AdminChatWindow({ user, admin, messages, onClose }) {
  const { themeName } = useTheme();
  const [text, setText] = useState("");
  const [adminTyping, setAdminTyping] = useState(false);

  const { setMessages, setActiveChatUserId } = useMessages();

  // ✅ تحديد المستخدم النشط
  useEffect(() => {
    setActiveChatUserId(user.id);
    return () => setActiveChatUserId(null);
  }, [user.id]);

  // ✅ استعلام حالة الكتابة للأدمن
  useEffect(() => {
    if (!user?.id) return;
    const interval = setInterval(async () => {
      const res = await fetch(`/api/typing?userId=${user.id}`);
      const data = await res.json();
      setAdminTyping(data.adminTyping || false);
    }, 2000);
    return () => clearInterval(interval);
  }, [user?.id]);

  // ✅ إرسال رسالة نصية
  const handleSend = async () => {
    if (text.trim() !== "") {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: user.id,
          user_name: "Basttet Travel",
          user_image:
            admin?.avatar_url || admin?.image || "/default-avatar.png",
          content: text,
          sender_type: "admin",
          status: "sent",
          admin_id: admin?.id || "SYSTEM", // ✅ قيمة افتراضية
        }),
      });

      const data = await res.json();
      setMessages((prev) => [...prev, data]); // ✅ أضف الرسالة مباشرة
      setText("");

      setText("");
    }
  };

  // ✅ إرسال صورة
  const handleSendImage = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("user_id", user.id);
    formData.append("user_name", "Basttet Travel");
    formData.append(
      "user_image",
      admin?.avatar_url || admin?.image || "/default-avatar.png",
    );
    formData.append("sender_type", "admin");
    formData.append("admin_id", admin?.id || "SYSTEM");

    const res = await fetch("/api/messages", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();

    if (!data.content) return;
    setMessages((prev) => [...prev, data]); // ✅ إضافة الرسالة محليًا
  };

  return (
    <AnimatePresence>
      {user && (
        <motion.div
          className="chat-widget-panel admin-chat-panel fixed bottom-20 right-6 w-110 h-125 rounded-xl shadow-xl flex flex-col z-50"
        >
          <EgyptianBackground />

          <div className="chat-panel-header admin-chat-header">
            <div className="chat-brand-lockup">
              <img
                src={user.image || "/default-avatar.png"}
                alt={user.name}
                width={40}
                height={40}
                style={{ borderRadius: "50%", border: "2px solid #d4af37" }}
              />
              <span><strong className="capitalize">{user.name}</strong><small>Customer conversation</small></span>
            </div>
            <button
              onClick={onClose}
              type="button"
              aria-label="Close customer chat"
              className="chat-close-button"
            >
              <motion.div
                whileHover={{ rotate: 90, scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <FaTimes size={18} />
              </motion.div>
            </button>
          </div>

          <AdminChatMessages
            messages={messages.filter((msg) => msg.user_id === user.id)}
            themeName={themeName}
            adminTyping={adminTyping}
          />

          <AdminChatInput
            text={text}
            setText={setText}
            handleSend={handleSend}
            themeName={themeName}
            user={user}
            handleSendImage={handleSendImage}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
