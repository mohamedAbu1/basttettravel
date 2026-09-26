"use client";

import Drawer from "@mui/material/Drawer";
import Slide from "@mui/material/Slide";
import { FaBell, FaTrash, FaArrowRight } from "react-icons/fa";
import { useNotifications } from "@/context/NotificationsContext";
import { useTranslation } from "react-i18next";

export default function NotificationsDrawer({ open, onClose, handleNotificationClick }) {
  const { notifications, deleteNotification, requestDesktopNotifications, desktopPermission } = useNotifications();
  const { t } = useTranslation("ui");
  const twoDays = 2 * 24 * 60 * 60 * 1000;
  const items = notifications.filter((item) => item.event_type !== "message").filter((item) => Date.now() - new Date(item.created_at).getTime() < twoDays).sort((a, b) => Number(b.is_read) - Number(a.is_read) || new Date(b.created_at) - new Date(a.created_at));

  return <Drawer anchor="right" open={open} onClose={onClose} TransitionComponent={Slide} TransitionProps={{ direction: "left" }} PaperProps={{ className: "app-drawer-paper" }}>
    <aside className="app-drawer" aria-label={t("notifications")}>
      <header className="app-drawer-header"><div className="drawer-title-lockup"><span className="drawer-title-icon"><FaBell /></span><span><strong>{t("notifications")}</strong><small>{items.length} {t("recentUpdates")}</small></span></div><button type="button" className="drawer-close" onClick={onClose} aria-label={t("closeNotifications")}>×</button></header>
      {desktopPermission === "default" && <button type="button" className="w-full border-b border-white/10 px-4 py-3 text-left text-xs font-semibold text-[#d4b56f] hover:bg-white/5" onClick={requestDesktopNotifications}>تفعيل إشعارات الكمبيوتر</button>}
      {desktopPermission === "denied" && <p className="px-4 py-3 text-xs text-red-300">تم حظر إشعارات الكمبيوتر. اسمح بها من إعدادات المتصفح.</p>}
      <div className="drawer-list">{items.length ? items.map((item) => <article key={item.id} className={`drawer-notification-card ${item.is_read ? "is-read" : "is-unread"}`}><button type="button" className="drawer-notification-main" onClick={() => handleNotificationClick(item)}><span className="drawer-avatar"><img src={item.user_image || "/default-avatar.png"} alt="" /></span><span className="drawer-notification-copy"><strong>{item.user_name || "Basttet Travel"}</strong><small>{item.message || item.user_email}</small><time>{new Date(item.created_at).toLocaleString("en-GB", { timeZone: "Africa/Cairo" })}</time></span><FaArrowRight className="drawer-arrow" aria-hidden="true" /></button><button type="button" className="drawer-delete" onClick={() => deleteNotification(item.id)} aria-label={t("deleteNotification")}><FaTrash /></button></article>) : <div className="drawer-empty"><FaBell /><strong>{t("noNotifications")}</strong><span>{t("caughtUp")}</span></div>}</div>
    </aside>
  </Drawer>;
}
