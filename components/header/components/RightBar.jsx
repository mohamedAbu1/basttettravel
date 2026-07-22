"use client";
import Typography from "@mui/material/Typography";
import ThemeToggle from "../../ThemeToggle";
import { useAuth } from "@/context/AuthContext";
import { useTheme } from "@/context/ThemeContext";
import { useTranslation } from "react-i18next";
import { usePathname, useRouter } from "next/navigation";
import { useNotifications } from "@/context/NotificationsContext";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MailIcon from "@mui/icons-material/Mail"; // ✅ أيقونة الرسائل
import Badge from "@mui/material/Badge";
import { useState } from "react";
import { useMessages } from "@/context/MessageContext";
import NotificationsDrawer from "./components/NotificationsDrawer";
import MessagesDrawer from "./components/MessagesDrawer";

export default function RightBar({ scrolled }) {
  const { userData, setChatUser, setChatMessages } = useAuth();
  const { themeName, theme } = useTheme();
  const { t } = useTranslation("header");
  const { notifications, markAsRead, deleteNotification } = useNotifications();
  const { fetchUserMessagesById } = useMessages();
  const router = useRouter();
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);
  const isHome =
    segments.length === 0 ||
    (segments.length === 1 &&
      ["en", "fr", "de", "it", "es", "pt"].includes(segments[0]));

  // ✅ إشعارات عامة
  const unreadCount = notifications.filter(
    (n) => n.is_read === 0 && n.event_type !== "message",
  ).length;
  const [open, setOpen] = useState(false);
  // ✅ إشعارات الرسائل فقط
  const messageNotifications = notifications.filter(
    (n) => n.event_type === "message",
  );
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

    if (notification.event_type === "review_like" && notification.trip_id) {
      router.push(
        `/trips/${notification.trip_id}?highlightReview=${notification.review_id}`,
      );
    }
  };

 const handleMessageClick = async (notification) => {
  console.log("🔔 تم الضغط على إشعار المستخدم:", notification);

  // ✅ تحديث حالة الإشعار إلى مقروء
  await markAsRead(notification.id);

  // ✅ تعيين المستخدم الحالي
  setChatUser({
    id: notification.user_id,
    name: notification.user_name,
    image: notification.user_image,
  });
  console.log("👤 المستخدم المحدد id:", notification.user_id);

  // ✅ جلب الرسائل
  const messages = await fetchUserMessagesById(notification.user_id);
  console.log("✅ الرسائل المسترجعة:", messages);

  setChatMessages(messages);
  console.log("💾 تم تخزين الرسائل في chatMessages:", messages);
};


  return (
    <div className="flex items-center gap-4">
      <ThemeToggle scrolled={scrolled} />

      {/* ✅ أيقونة الإشعارات العامة */}
      {userData?.role === "ADMIN" && (
        <Badge badgeContent={unreadCount} color="error">
          <NotificationsIcon
            onClick={() => setOpen(true)}
            sx={{
              cursor: "pointer",
              color:
                themeName === "dark"
                  ? "#fff"
                  : !isHome
                    ? "#333"
                    : scrolled
                      ? "#333"
                      : "#fff",
            }}
          />
        </Badge>
      )}

      {/* ✅ أيقونة الرسائل تظهر فقط لو فيه رسائل */}
      {userData?.role === "ADMIN" && messageNotifications.length > 0 && (
        <Badge badgeContent={unreadMessages} color="error">
          <MailIcon
            onClick={() => setOpenMessages(true)}
            sx={{
              cursor: "pointer",
              color:
                themeName === "dark"
                  ? "#fff"
                  : !isHome
                    ? "#333"
                    : scrolled
                      ? "#333"
                      : "#fff",
            }}
          />
        </Badge>
      )}

      {/* Drawer للإشعارات العامة */}

      <NotificationsDrawer
        open={open}
        onClose={() => setOpen(false)}
        themeName={themeName}
        theme={theme}
        handleNotificationClick={handleNotificationClick}
      />

      {/* Drawer للرسائل */}

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
          <Typography
            variant="subtitle1"
            sx={{
              textTransform: "capitalize",
              fontWeight: "600",
              color:
                themeName === "dark"
                  ? "#fff"
                  : !isHome
                    ? "#333"
                    : scrolled
                      ? "#333"
                      : "#fff",
            }}
          >
            {userData?.name}
          </Typography>
        </div>
      )}
    </div>
  );
}
