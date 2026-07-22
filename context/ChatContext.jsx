"use client";
import { createContext, useContext, useState } from "react";

const ChatContext = createContext();

export function ChatProvider({ children }) {
  const [open, setOpen] = useState(false);
  const [messageses, setMessageses] = useState([]);
  const [bookingMode, setBookingMode] = useState(false);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");

  const openChatWithCarBooking = () => {
    setOpen(true);
    setBookingMode(true);
    setMessageses([
      {
        sender: "assistant",
        content: "👋 مرحباً! من أين إلى أين تريد حجز السيارة؟",
      },
    ]);
  };

  return (
    <ChatContext.Provider
      value={{
        open,
        setOpen,
        messageses,
        setMessageses,
        bookingMode,
        setBookingMode,
        from,
        setFrom,
        to,
        setTo,
        openChatWithCarBooking,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export const useChat = () => useContext(ChatContext);
