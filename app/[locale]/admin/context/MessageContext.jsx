"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

const MessageContext = createContext();

export function MessageProvider({ children }) {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const { userData } = useAuth();

  // ✅ جلب رسائل المستخدم الحالي
  const fetchMessages = async (userId) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/messages?userId=${userId}`);
      const data = await res.json();
      setMessages(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("❌ Error fetching messages:", err.message);
    } finally {
      setLoading(false);
    }
  };
console.log("3object",userData?.image)

// ✅ إرسال رسالة جديدة
const sendMessage = async ({
  user_id,
  content,
  sender_type,
  status = "sent",
  reply_to = null,
  admin_id = null,
}) => {
  // 1️⃣ بناء الـ payload
  const payload = {
    user_id,
    user_name: userData?.name || "Unknown User",
    user_image: userData?.image || "/default-avatar.png",
    content,
    sender_type,
    status,
    reply_to: reply_to ?? null,
    admin_id,
  };

  console.log("📤 Step 1: Sending payload:", payload);

  // 2️⃣ إرسال الطلب للـ API
  const res = await fetch("/api/messages", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload), // ✅ هنا نرسل البيانات الصحيحة
  });

  console.log("📥 Step 2: Raw response object:", res);

  // 3️⃣ التحقق من نجاح الطلب
  if (!res.ok) {
    const text = await res.text();
    console.error("❌ Step 3: Server error response:", text);
    return { error: text };
  }

  // 4️⃣ قراءة الرد كـ JSON
  const data = await res.json();
  console.log("📥 Step 4: Parsed response data:", data);

  // 5️⃣ تحديث الـ state بالرسالة الجديدة
  if (!data.error) {
    setMessages((prev) => [...prev, data]);
    console.log("✅ Step 5: Message added to state:", data);
  } else {
    console.error("❌ Step 5: Error sending message:", data.error);
  }

  return data;
};



  // ✅ تحديث حالة الرسالة إلى "seen"
  const markMessageSeen = async (messageId) => {
    const res = await fetch("/api/messages", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messageId }),
    });

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
  };

  // ✅ يجلب الرسائل مرة واحدة عند تحميل المستخدم
  useEffect(() => {
    if (userData?.id) {
      fetchMessages(userData.id);
    }
  }, [userData?.id]);

  return (
    <MessageContext.Provider
      value={{ messages, loading, fetchMessages, sendMessage, markMessageSeen }}
    >
      {children}
    </MessageContext.Provider>
  );
}

export const useMessages = () => useContext(MessageContext);
