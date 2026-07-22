/* eslint-disable @next/next/no-img-element */
"use client";
import React, { useState, useEffect } from "react";
import { useMessages } from "../../context/MessageContext";
import { useAuth } from "@/context/AuthContext";
import ChatHeader from "./components/ChatHeader";
import ChatMessages from "./components/ChatMessages";
import ChatInput from "./components/ChatInput";
import EgyptianBackground from "@/components/layout/EgyptianBackground";

const ChatSection = ({ activeUser, theme, themeName }) => {
  const { messages, fetchMessages, sendMessage, markMessageSeen } = useMessages();
  const { userData } = useAuth(); // الأدمن الحالي من التوكين
  const [newMessage, setNewMessage] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [isTyping, setIsTyping] = useState(false);
  const [userTyping, setUserTyping] = useState(false);

  // ✅ جلب رسائل المستخدم
  useEffect(() => {
    if (activeUser) {
      fetchMessages(activeUser.id);
    }
  }, [activeUser]);

  // ✅ تحديث حالة الرسائل إلى "seen"
  useEffect(() => {
    if (activeUser && messages.length > 0) {
      messages.forEach((msg) => {
        if (msg.sender_type === "user" && msg.status === "sent") {
          markMessageSeen(msg.id);
        }
      });
    }
  }, [activeUser, messages]);

  const handleSend = async () => {
    if (!newMessage.trim()) return;

    await sendMessage({
      user_id: activeUser.id,
      user_name: userData?.name || "Admin",
      user_image: userData?.image || "/default-avatar.png",
      content: newMessage,
      sender_type: "admin",
      reply_to: replyTo ? replyTo.id : null,
      admin_id: userData.id,
      status: "sent",
    });

    setNewMessage("");
    setReplyTo(null);
    setIsTyping(false);

    await fetch("/api/typing", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: activeUser.id, adminTyping: false }),
    });
  };

  // ✅ استعلام حالة الكتابة للمستخدم
  useEffect(() => {
    if (!activeUser) return;
    const interval = setInterval(async () => {
      const res = await fetch(`/api/typing?userId=${activeUser.id}`);
      const data = await res.json();
      setUserTyping(data.isTyping);
    }, 2000);
    return () => clearInterval(interval);
  }, [activeUser]);

const handleSendImage = async (file) => {
  console.log("📤 Step 1: Preparing FormData for image upload...");
  const formData = new FormData();
  formData.append("file", file);

  // ✅ نضيف بيانات المستخدم
  formData.append("user_id", activeUser.id);
  formData.append("sender_type", "admin");
  formData.append("user_name", userData?.name || "Admin");
  formData.append("user_image", userData?.image || "/default-avatar.png");
  formData.append("admin_id", userData.id);

  console.log("📤 Step 2: Sending image to /api/messages...");
  const res = await fetch("/api/messages", {
    method: "POST",
    body: formData,
  });

  const data = await res.json();
  console.log("📥 Step 3: Response from API:", data);

  if (data.error) {
    console.error("❌ Error uploading image:", data.error);
    return;
  }

  const uploadedUrl = data.url;
  console.log("✅ Step 4: Image uploaded successfully, URL:", uploadedUrl);
};


  return (
    <section className="flex-1 flex flex-col">
      <EgyptianBackground />
      <ChatHeader activeUser={activeUser} theme={theme} themeName={themeName} />

      <ChatMessages
        messages={messages}
        userTyping={userTyping}
        themeName={themeName}
      />

      <ChatInput
        handleSendImage={handleSendImage}
        activeUser={activeUser}
        newMessage={newMessage}
        setNewMessage={setNewMessage}
        handleSend={handleSend}
        setIsTyping={setIsTyping}
        theme={theme}
        themeName={themeName}
      />
    </section>
  );
};

export default ChatSection;
