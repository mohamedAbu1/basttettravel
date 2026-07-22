"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

const MessageContext = createContext();

export function MessageProvider({ children }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const { userData } = useAuth();
  const [open, setOpen] = useState(false);

  // ✅ جلب رسائل المستخدم الحالي
  const fetchMessages = async (userId) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/messages?userId=${userId}`);

      if (!res.ok) {
        const text = await res.text();
        console.error("❌ Error fetching messages:", text);
        return;
      }

      const data = await res.json();
      setMessages(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("❌ Error fetching messages:", err.message);
    } finally {
      setLoading(false);
    }
  };
const fetchUserMessagesById = async (id) => {
  try {
    console.log("📡 بدء جلب الرسائل للمستخدم:", id);

    const res = await fetch(`/api/messages?id=${id}`);
    if (!res.ok) {
      const text = await res.text();
      console.error("❌ خطأ في الاتصال بالسيرفر:", text);
      return [];
    }

    const data = await res.json();
    console.log("✅ البيانات المسترجعة من السيرفر:", data);

    // فلترة الرسائل الخاصة بالمستخدم المحدد
    const filtered = Array.isArray(data)
      ? data.filter((msg) => msg.user_id === id) // ✅ استخدم id المرسل للدالة
      : [];

    console.log("💾 الرسائل بعد الفلترة:", filtered);
    return filtered;
  } catch (err) {
    console.error("❌ خطأ أثناء جلب الرسائل:", err.message);
    return [];
  }
};


  // ✅ إرسال رسالة جديدة
  const sendMessage = async ({
    user_id,
    content,
    sender_type,
    status = "sent",
    reply_to = null,
    admin_id = userData?.role === "ADMIN" ? userData.id : "SYSTEM",
  }) => {
    const payload = {
      user_id,
      user_name: userData?.name || "Unknown User",
      user_image: userData?.avatar_url || userData?.image ,
      content,
      sender_type,
      status,
      reply_to,
      admin_id,
    };

    // أضف الرسالة مباشرة للـ state علشان تظهر فورًا
    const tempMessage = {
      ...payload,
      id: Date.now(), // ID مؤقت
      status: "pending",
    };
    setMessages((prev) => [...prev, tempMessage]);

    try {
      const res = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("❌ Server error:", text);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === tempMessage.id ? { ...msg, status: "error" } : msg
          )
        );
        return { error: text };
      }

      const data = await res.json();

      if (data.error) {
        console.error("❌ Error sending message:", data.error);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === tempMessage.id ? { ...msg, status: "error" } : msg
          )
        );
      } else {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === tempMessage.id ? { ...msg, ...data, status: "sent" } : msg
          )
        );
      }

      return data;
    } catch (err) {
      console.error("❌ Error sending message:", err.message);
      return { error: err.message };
    }
  };

  // ✅ تحديث حالة الرسالة إلى "seen"
  const markMessageSeen = async (messageId) => {
    try {
      const res = await fetch("/api/messages", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messageId }),
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("❌ Server error:", text);
        return { error: text };
      }

      const data = await res.json();

      if (!data.error) {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === messageId ? { ...msg, status: "seen" } : msg
          )
        );
      } else {
        console.error("❌ Error marking message seen:", data.error);
      }

      return data;
    } catch (err) {
      console.error("❌ Error marking message seen:", err.message);
      return { error: err.message };
    }
  };

  // ✅ يجلب الرسائل مرة واحدة عند تحميل المستخدم
  useEffect(() => {
    if (userData?.id) {
      fetchMessages(userData.id);
      fetchUserMessagesById(userData.id); // ✅ جلب الرسائل الخاصة بالمستخدم الحالي
    }
  }, [userData?.id]);

  return (
    <MessageContext.Provider
      value={{ messages, loading, fetchMessages, sendMessage, markMessageSeen ,fetchUserMessagesById,open,setOpen}}
    >
      {children}
    </MessageContext.Provider>
  );
}

export const useMessages = () => useContext(MessageContext);
