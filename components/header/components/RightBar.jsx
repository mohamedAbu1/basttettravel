"use client";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useRouter } from "next/navigation";
import { useNotifications } from "@/context/NotificationsContext";
import { FaBell, FaEnvelope } from "react-icons/fa";
import { useState } from "react";
import { useMessages } from "@/context/MessageContext";
import NotificationsDrawer from "./components/NotificationsDrawer";
import MessagesDrawer from "./components/MessagesDrawer";

export default function RightBar() {
  const { userData, setChatUser } = useAuth();
  const { themeName, theme } = useTheme();
  const { notifications, markAsRead } = useNotifications();
  const { fetchUserMessagesById, setMessages } = useMessages();
  const router = useRouter();
  const now = Date.now();
  const twelveHours = 12 * 60 * 60 * 1000;
  const twoDays = 2 * 24 * 60 * 60 * 1000;

  // ✅ إشعارات عامة (فلترة + ترتيب)
  const filteredNotifications = notifications
    .filter((n) => {
      const createdTime = new Date(n.created_at).getTime();
      return now - createdTime < twoDays; // إشعار أقل من يومين
    })
    .sort((a, b) => {
      if (a.is_read === 0 && b.is_read !== 0) return -1;
      if (a.is_read !== 0 && b.is_read === 0) return 1;
      return new Date(b.created_at) - new Date(a.created_at);
    });

  const unreadCount = filteredNotifications.filter(
    (n) => n.is_read === 0 && n.event_type !== "message",
  ).length;

  const [open, setOpen] = useState(false);

  // ✅ إشعارات الرسائل (فلترة + ترتيب)
  const messageNotifications = notifications
    .filter((n) => n.event_type === "message")
    .filter((n) => {
      if (n.is_read === 0) return true; // غير مقروءة تبقى
      const createdTime = new Date(n.created_at).getTime();
      return now - createdTime < twelveHours; // مقروءة لكن أقل من 12 ساعة
    })
    .sort((a, b) => {
      if (a.is_read === 0 && b.is_read !== 0) return -1;
      if (a.is_read !== 0 && b.is_read === 0) return 1;
      return new Date(b.created_at) - new Date(a.created_at);
    });

  const unreadMessages = messageNotifications.filter(
    (n) => n.is_read === 0,
  ).length;
  const [openMessages, setOpenMessages] = useState(false);

  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);

    if (notification.event_type === "purchase" && notification.trip_id) {
      router.push(`/trips/${notification.trip_id}`);
    }

    if (notification.event_type === "review" && notification.trip_id) {
      router.push(
        `/trips/${notification.trip_id}?highlightReview=${notification.review_id}`,
      );
    }

    if (["review_like", "like"].includes(notification.event_type) && notification.trip_id) {
      router.push(
        `/trips/${notification.trip_id}?highlightReview=${notification.review_id}`,
      );
    }
  };

  const handleMessageClick = async (notification) => {
    await markAsRead(notification.id);

    setChatUser({
      id: notification.user_id,
      name: notification.user_name,
      image: notification.user_image,
    });

    const messages = await fetchUserMessagesById(notification.user_id);
    setMessages(messages);
  };

  return (
    <div className="hidden lg:flex items-center gap-4">
      {/* ✅ أيقونة الإشعارات العامة */}
      {userData?.role === "ADMIN" && (
        <div className="relative hidden lg:flex">
          <button
            type="button"
            aria-label="Open notifications"
            title="Open notifications"
            onClick={() => setOpen(true)}
            className="rounded-full p-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            <FaBell aria-hidden="true" />
          </button>
          {unreadCount > 0 && <span className="header-notification-badge">{unreadCount}</span>}
        </div>
      )}

      {/* ✅ أيقونة الرسائل */}
      {userData?.role === "ADMIN" && messageNotifications.length > 0 && (
        <div className="relative hidden lg:flex">
          <button
            type="button"
            aria-label="Open messages"
            title="Open messages"
            onClick={() => setOpenMessages(true)}
            className="rounded-full p-1 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
          >
            <FaEnvelope aria-hidden="true" />
          </button>
          {unreadMessages > 0 && <span className="header-notification-badge">{unreadMessages}</span>}
        </div>
      )}

      {/* Drawers */}
      <NotificationsDrawer
        open={open}
        onClose={() => setOpen(false)}
        themeName={themeName}
        theme={theme}
        handleNotificationClick={handleNotificationClick}
        notifications={filteredNotifications}
      />

      <MessagesDrawer
        open={openMessages}
        onClose={() => setOpenMessages(false)}
        themeName={themeName}
        theme={theme}
        messageNotifications={messageNotifications}
        handleMessageClick={handleMessageClick}
      />

      {userData && (
        <div className="hidden lg:flex items-center gap-2">
          <img
            alt={userData?.name || "User Avatar"}
            src={
              userData?.avatar_url || userData?.image || "/default-avatar.png"
            }
            width={40}
            height={40}
            style={{ border: "2px solid #d4af37", borderRadius: "50%" }}
          />
          <span className="header-user-name">
            {userData?.name}
          </span>
        </div>
      )}
    </div>
  );
}
