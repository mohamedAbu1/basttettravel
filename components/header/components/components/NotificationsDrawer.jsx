"use client";

import Drawer from "@mui/material/Drawer";
import Slide from "@mui/material/Slide";
import { FaBell, FaTrash, FaArrowRight } from "react-icons/fa";
import { useNotifications } from "@/context/NotificationsContext";

export default function NotificationsDrawer({ open, onClose, handleNotificationClick }) {
  const { notifications, deleteNotification } = useNotifications();
  const twoDays = 2 * 24 * 60 * 60 * 1000;
  const items = notifications.filter((item) => item.event_type !== "message").filter((item) => Date.now() - new Date(item.created_at).getTime() < twoDays).sort((a, b) => Number(b.is_read) - Number(a.is_read) || new Date(b.created_at) - new Date(a.created_at));

  return <Drawer anchor="right" open={open} onClose={onClose} TransitionComponent={Slide} TransitionProps={{ direction: "left" }} PaperProps={{ className: "app-drawer-paper" }}>
    <aside className="app-drawer" aria-label="Notifications">
      <header className="app-drawer-header"><div className="drawer-title-lockup"><span className="drawer-title-icon"><FaBell /></span><span><strong>Notifications</strong><small>{items.length} recent updates</small></span></div><button type="button" className="drawer-close" onClick={onClose} aria-label="Close notifications">×</button></header>
      <div className="drawer-list">{items.length ? items.map((item) => <article key={item.id} className={`drawer-notification-card ${item.is_read ? "is-read" : "is-unread"}`}><button type="button" className="drawer-notification-main" onClick={() => handleNotificationClick(item)}><span className="drawer-avatar"><img src={item.user_image || "/default-avatar.png"} alt="" /></span><span className="drawer-notification-copy"><strong>{item.user_name || "Basttet Travel"}</strong><small>{item.message || item.user_email}</small><time>{new Date(item.created_at).toLocaleString("en-GB", { timeZone: "Africa/Cairo" })}</time></span><FaArrowRight className="drawer-arrow" aria-hidden="true" /></button><button type="button" className="drawer-delete" onClick={() => deleteNotification(item.id)} aria-label="Delete notification"><FaTrash /></button></article>) : <div className="drawer-empty"><FaBell /><strong>No notifications</strong><span>You are all caught up.</span></div>}</div>
    </aside>
  </Drawer>;
}
