"use client";
import React, { useEffect, useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { useUsers } from "@/context/UserContext";
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
          const nextMessages = Array.isArray(res.data) ? res.data : res.data?.messages;
          if (Array.isArray(nextMessages)) setMessages(nextMessages);
        } catch (err) {
          console.error("❌ Error fetching messages:", err.message);
        }
      };

      fetchMessages();
      interval = setInterval(fetchMessages, 5000);
    }
    return () => clearInterval(interval);
  }, [activeUser, setMessages]);

  return (
    <main className={`admin-page-panel admin-messages-panel flex h-[99%] ${theme.background} ${theme.text}`}>
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
