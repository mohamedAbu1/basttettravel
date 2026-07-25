"use client";
import { createContext, useContext, useEffect, useState } from "react";

const NotificationsContext = createContext();

export function NotificationsProvider({ children }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  // استدعاء API لجلب الإشعارات
  useEffect(() => {
    async function fetchNotifications() {
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
  }, [notifications]);

  // تحديث حالة الإشعار إلى مقروء
const markAsRead = async (id) => {
  try {
    await fetch(`/api/notifications/read/${id}`, { method: "PUT" });
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
        console.log("🗑️ تم حذف الإشعار بنجاح:", id);
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
