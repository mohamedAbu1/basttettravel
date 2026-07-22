"use client";
import React, { useEffect, useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { useUsers } from "../context/UserContext";
import { useAuth } from "@/context/AuthContext";
import UsersSidebar from "./components/UsersSidebar";
import ChatSection from "./components/ChatSection";
import { useMessages } from "@/context/MessageContext";
import axios from "axios";

export default function MessagesPage() {
  const { theme, themeName } = useTheme();
  const { users } = useUsers();
  const { userData } = useAuth(); 
  const { messages, setMessages, markMessageSeen } = useMessages();

  const [activeUser, setActiveUser] = useState(null);

  // ✅ جلب الرسائل بشكل دوري من MySQL
  useEffect(() => {
    let interval;
    if (activeUser) {
      const fetchMessages = async () => {
        try {
          const res = await axios.get(`/api/messages?userId=${activeUser.id}`);
          if (res.data.success) {
            setMessages(res.data.messages);
          }
        } catch (err) {
          console.error("❌ Error fetching messages:", err.message);
        }
      };

      fetchMessages();
      interval = setInterval(fetchMessages, 3000); // كل 3 ثواني
    }
    return () => clearInterval(interval);
  }, [activeUser, setMessages]);

  return (
    <main className={`flex h-[99%] ${theme.background} ${theme.text}`}>
      <UsersSidebar
        users={users}
        userData={userData}
        activeUser={activeUser}
        setActiveUser={setActiveUser}
        theme={theme}
        themeName={themeName}
        markMessageSeen={markMessageSeen}
        messages={messages}
      />
      <ChatSection
        activeUser={activeUser}
        setActiveUser={setActiveUser}
        theme={theme}
        themeName={themeName}
      />
    </main>
  );
}
