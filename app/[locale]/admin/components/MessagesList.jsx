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

  // Keep the currently open conversation live. The notifications stream is
  // already server-sent, so the open chat can refresh immediately when its
  // customer sends a message instead of waiting for the polling interval.
  useEffect(() => {
    if (!activeUser) return undefined;

    let cancelled = false;
    const fetchMessages = async () => {
      try {
        const res = await axios.get(`/api/messages?userId=${activeUser.id}`, {
          params: { _ts: Date.now() },
        });
        const nextMessages = Array.isArray(res.data) ? res.data : res.data?.messages;
        if (!cancelled && Array.isArray(nextMessages)) setMessages(nextMessages);
      } catch (err) {
        if (!cancelled) console.error("❌ Error fetching messages:", err.message);
      }
    };

    fetchMessages();

    const eventSource = new window.EventSource("/api/notifications/stream");
    eventSource.addEventListener("notification", (event) => {
      try {
        const notification = JSON.parse(event.data);
        const isOpenChatMessage =
          notification.event_type === "message" &&
          String(notification.user_id) === String(activeUser.id);

        if (isOpenChatMessage) fetchMessages();
      } catch (err) {
        console.error("❌ Invalid live message event:", err);
      }
    });

    return () => {
      cancelled = true;
      eventSource.close();
    };
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
