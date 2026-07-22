"use client";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/context/ThemeContext";
import AdminChatMessages from "./components/AdminChatMessages";
import AdminChatInput from "./components/AdminChatInput";
import EgyptianBackground from "./EgyptianBackground";
import { useMessages } from "@/context/MessageContext";
import { FaTimes } from "react-icons/fa";
export default function AdminChatWindow({ user, admin, messages, onClose }) {
  const { theme, themeName } = useTheme();
  const [text, setText] = useState("");
  const { setMessages, sendMessage } = useMessages(); // ✅ استدعاء setMessages من الـ context
  // ✅ الرسائل اللي جاية من الـ props مباشرة

  const handleSend = async () => {
    if (text.trim() !== "") {
      await sendMessage({
        user_id: user.id,
        user_name: "Basttet Travel",
        user_image: admin?.avatar_url || admin?.image || "/default-avatar.png",
        content: text,
        sender_type: "admin",
        status: "sent",
      });
      setText("");
    }
  };

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
    <AnimatePresence>
      {user && (
        <motion.div
          className={`fixed bottom-20 right-6 w-110 h-125 rounded-xl shadow-xl flex flex-col z-50 ${theme.card} ${theme.text}`}
        >
          <EgyptianBackground />

          <div className="flex items-center justify-between p-3 border-b-#d4af37 border-b-2">
            <div className="flex items-center gap-2">
              <img
                src={user.image || "/default-avatar.png"}
                alt={user.name}
                width={40}
                height={40}
                style={{ borderRadius: "50%", border: "2px solid #d4af37" }}
              />
              <span className="font-bold capitalize">{user.name}</span>
            </div>
            <button
              onClick={onClose}
              className="text-red-500 hover:text-red-600 transition-colors duration-300 cursor-pointer"
            >
              <motion.div
                whileHover={{ rotate: 90, scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <FaTimes size={22} />
              </motion.div>
            </button>
          </div>

          <AdminChatMessages
            messages={messages.filter((msg) =>
              messages.filter((msg) => msg.user_id === user.id),
            )}
            themeName={themeName}
          />

          <AdminChatInput
            text={text}
            setText={setText}
            handleSend={handleSend}
            theme={theme}
            themeName={themeName}
            user={user}
            handleSendImage={handleSendImage}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
