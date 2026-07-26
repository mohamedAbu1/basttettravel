"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import { io } from "socket.io-client";

const MessageContext = createContext();

export function MessageProvider({ children }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const { userData } = useAuth();
  const [open, setOpen] = useState(false);
  const [socket, setSocket] = useState(null);

  // ✅ تهيئة الـ socket مرة واحدة
  const [activeChatUserId, setActiveChatUserId] = useState(null);

  useEffect(() => {
    const newSocket = io("/", { path: "/api/socket" });
    setSocket(newSocket);

    newSocket.on("connect", () => {
      console.log("✅ Connected to WebSocket server");
    });

    newSocket.on("new_message", (msg) => {
      console.log("📩 رسالة جديدة:", msg);

      if (activeChatUserId && msg.user_id === activeChatUserId) {
        // ✅ لو الشات مفتوح لنفس المستخدم → أضف الرسالة مباشرة
        setMessages((prev) => [...prev, msg]);
      } else {
        // ✅ لو مش مفتوح → إشعار فقط
        console.log("🔔 إشعار برسالة جديدة من مستخدم آخر");
      }
    });

    return () => {
      newSocket.disconnect();
    };
  }, [activeChatUserId]);

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
      const filtered = Array.isArray(data)
        ? data.filter((msg) => msg.user_id === id)
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
      user_image: userData?.avatar_url || userData?.image,
      content,
      sender_type,
      status,
      reply_to,
      admin_id,
    };

    // أضف الرسالة مباشرة للـ state علشان تظهر فورًا
    const tempMessage = {
      ...payload,
      id: Date.now(),
      status: "pending",
    };
    setMessages((prev) => [...prev, tempMessage]);

    // ✅ إرسال عبر socket فورًا
    if (socket?.emit) {
      socket.emit("new_message", payload);
    } else {
      console.error("❌ Socket not ready");
    }

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
            msg.id === tempMessage.id ? { ...msg, status: "error" } : msg,
          ),
        );
        return { error: text };
      }

      const data = await res.json();

      if (data.error) {
        console.error("❌ Error sending message:", data.error);
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === tempMessage.id ? { ...msg, status: "error" } : msg,
          ),
        );
      } else {
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === tempMessage.id
              ? { ...msg, ...data, status: "sent" }
              : msg,
          ),
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
            msg.id === messageId ? { ...msg, status: "seen" } : msg,
          ),
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

useEffect(() => {
  if (userData?.id) {
    fetchMessages(userData.id);
    const interval = setInterval(() => {
      fetchMessages(userData.id);
    }, 3000);
    return () => clearInterval(interval);
  }
}, [userData?.id]);


  return (
    <MessageContext.Provider
      value={{
        messages,
        loading,
        fetchMessages,
        sendMessage,
        markMessageSeen,
        fetchUserMessagesById,
        setActiveChatUserId,
        open,
        setOpen,
      }}
    >
      {children}
    </MessageContext.Provider>
  );
}

export const useMessages = () => useContext(MessageContext);
