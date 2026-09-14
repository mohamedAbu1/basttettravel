"use client";
import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "@/context/AuthContext";

const NotificationsContext = createContext();

export function NotificationsProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const { userData } = useAuth();

  // استدعاء API لجلب الإشعارات
  useEffect(() => {
    async function fetchNotifications() {
      if (!userData?.id || userData?.role !== "ADMIN") {
        setNotifications([]);
        setLoading(false);
        return;
      }
      try {
        const res = await fetch("/api/notifications");
        const data = await res.json();
        if (data.success) {
          setNotifications(data.notifications);
        }
      } catch (err) {
        console.error("خطأ في جلب الإشعارات:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchNotifications();
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
    const res = await fetch("/api/notifications");
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
      value={{ notifications, loading, markAsRead,deleteNotification }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

// Hook مخصص للوصول للإشعارات
export function useNotifications() {
  return useContext(NotificationsContext);
}
