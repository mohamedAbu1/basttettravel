"use client";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import { useAuth } from "@/context/AuthContext";

const NotificationsContext = createContext();

export function NotificationsProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [desktopPermission, setDesktopPermission] = useState("default");
  const knownNotificationIds = useRef(new Set());
  const hasLoadedNotifications = useRef(false);
  const { userData } = useAuth();

  useEffect(() => {
    if (typeof window !== "undefined" && "Notification" in window) {
      setDesktopPermission(window.Notification.permission);
    }
  }, []);

  const requestDesktopNotifications = async () => {
    if (typeof window === "undefined" || !("Notification" in window)) return "unsupported";
    const permission = await window.Notification.requestPermission();
    setDesktopPermission(permission);
    return permission;
  };

  const showDesktopNotification = (notification) => {
    if (typeof window === "undefined" || !("Notification" in window) || window.Notification.permission !== "granted") return;
    const eventType = String(notification.event_type || notification.type || "").toLowerCase();
    if (!(eventType === "message" || eventType === "review" || eventType === "comment" || eventType === "like" || eventType === "review_like")) return;

    const title = eventType === "message" ? "رسالة جديدة من Basttet Travel" : eventType === "like" || eventType === "review_like" ? "إعجاب جديد على تعليق" : "تعليق جديد على رحلة";
    const desktopNotification = new window.Notification(title, {
      body: notification.message || notification.user_name || "لديك إشعار جديد",
      icon: notification.user_image || "/favicon.ico",
      tag: `basttet-${notification.id}`,
    });
    desktopNotification.onclick = () => {
      window.focus();
      desktopNotification.close();
    };
  };

  useEffect(() => {
    let cancelled = false;
    let fallbackInterval;
    let eventSource;

    const mergeNotification = (notification, announce = true) => {
      if (!notification || knownNotificationIds.current.has(String(notification.id))) return;
      knownNotificationIds.current.add(String(notification.id));
      if (announce && Number(notification.is_read) === 0) showDesktopNotification(notification);
      setNotifications((previous) => [notification, ...previous.filter((item) => String(item.id) !== String(notification.id))]);
    };

    async function fetchNotifications() {
      if (!userData?.id || userData?.role !== "ADMIN") {
        setNotifications([]);
        knownNotificationIds.current = new Set();
        hasLoadedNotifications.current = false;
        setLoading(false);
        return;
      }
      try {
        const res = await fetch("/api/notifications", { cache: "no-store" });
        const data = await res.json();
        if (data.success && !cancelled) {
          const nextNotifications = Array.isArray(data.notifications) ? data.notifications : [];
          if (hasLoadedNotifications.current) {
            nextNotifications
              .filter((item) => !knownNotificationIds.current.has(String(item.id)) && Number(item.is_read) === 0)
              .forEach(showDesktopNotification);
          }
          knownNotificationIds.current = new Set(nextNotifications.map((item) => String(item.id)));
          hasLoadedNotifications.current = true;
          setNotifications(nextNotifications);
        }
      } catch (err) {
        console.error("خطأ في جلب الإشعارات:", err);
      } finally {
        setLoading(false);
      }
    }
    if (userData?.id && userData?.role === "ADMIN") {
      fetchNotifications();
      eventSource = new window.EventSource("/api/notifications/stream");
      eventSource.addEventListener("notification", (event) => {
        try {
          mergeNotification(JSON.parse(event.data));
        } catch (error) {
          console.error("Invalid notification stream event:", error);
        }
      });
      eventSource.onerror = () => {
        // EventSource reconnects automatically; this slower fallback covers deployments that close streams.
        if (!fallbackInterval) fallbackInterval = setInterval(fetchNotifications, 30000);
      };
    } else {
      setNotifications([]);
      knownNotificationIds.current = new Set();
      hasLoadedNotifications.current = false;
      setLoading(false);
    }

    return () => {
      cancelled = true;
      if (eventSource) eventSource.close();
      if (fallbackInterval) clearInterval(fallbackInterval);
    };
  }, [userData?.id, userData?.role]);

  // تحديث حالة الإشعار إلى مقروء
const markAsRead = async (id) => {
  try {
    const response = await fetch(`/api/notifications/read/${id}`, { method: "PUT" });
    if (!response.ok) throw new Error("Unable to mark notification as read");
    // تحديث محلي
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, is_read: 1 } : n))
    );
    // إعادة جلب من السيرفر للتأكد
    const res = await fetch("/api/notifications", { cache: "no-store" });
    const data = await res.json();
    if (data.success) setNotifications(data.notifications);
  } catch (err) {
    console.error("خطأ في تحديث الإشعار:", err);
  }
};
 const deleteNotification = async (id) => {
    try {
      const res = await fetch(`/api/notifications/${id}`, { method: "DELETE" });
      const data = await res.json();

      if (data.success) {
        // تحديث محلي: إزالة الإشعار من القائمة
        setNotifications((prev) => prev.filter((n) => n.id !== id));
      } else {
        console.error("❌ خطأ في حذف الإشعار:", data.error);
      }
    } catch (err) {
      console.error("❌ خطأ أثناء حذف الإشعار:", err.message);
    }
  };

  return (
    <NotificationsContext.Provider
      value={{
        notifications,
        loading,
        markAsRead,
        deleteNotification,
        requestDesktopNotifications,
        desktopPermission,
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

// Hook مخصص للوصول للإشعارات
export function useNotifications() {
  return useContext(NotificationsContext);
}
