"use client";

import Drawer from "@mui/material/Drawer";
import Slide from "@mui/material/Slide";
import { FaEnvelope, FaTrash, FaArrowRight } from "react-icons/fa";
import { useNotifications } from "@/context/NotificationsContext";

export default function MessagesDrawer({ open, onClose, messageNotifications, handleMessageClick }) {
  const { deleteNotification } = useNotifications();
  return <Drawer anchor="right" open={open} onClose={onClose} TransitionComponent={Slide} TransitionProps={{ direction: "left" }} PaperProps={{ className: "app-drawer-paper" }}>
    <aside className="app-drawer" aria-label="Messages">
      <header className="app-drawer-header"><div className="drawer-title-lockup"><span className="drawer-title-icon"><FaEnvelope /></span><span><strong>Messages</strong><small>{messageNotifications.length} conversations</small></span></div><button type="button" className="drawer-close" onClick={onClose} aria-label="Close messages">×</button></header>
      <div className="drawer-list">{messageNotifications.length ? messageNotifications.map((item) => <article key={item.id} className={`drawer-notification-card ${item.is_read ? "is-read" : "is-unread"}`}><button type="button" className="drawer-notification-main" onClick={() => handleMessageClick(item)}><span className="drawer-avatar"><img src={item.user_image || "/default-avatar.png"} alt="" /></span><span className="drawer-notification-copy"><strong>{item.user_name || "Customer"}</strong><small>{item.message || item.user_email || "New message"}</small><time>{new Date(item.created_at).toLocaleString("en-GB", { timeZone: "Africa/Cairo" })}</time></span><FaArrowRight className="drawer-arrow" aria-hidden="true" /></button><button type="button" className="drawer-delete" onClick={() => deleteNotification(item.id)} aria-label="Delete message"><FaTrash /></button></article>) : <div className="drawer-empty"><FaEnvelope /><strong>No messages</strong><span>Your inbox is clear.</span></div>}</div>
    </aside>
  </Drawer>;
}
