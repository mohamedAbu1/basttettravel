"use client";

import React, { useMemo, useState } from "react";
import { FaInbox, FaSearch, FaUserCircle } from "react-icons/fa";

const UsersSidebar = ({ users = [], activeUser, setActiveUser, themeName, markMessageSeen, messages = [] }) => {
  const [query, setQuery] = useState("");
  const nonAdminUsers = useMemo(() => users.filter((user) => user?.role?.toUpperCase() !== "ADMIN"), [users]);
  const filteredUsers = useMemo(() => nonAdminUsers.filter((user) => `${user.name || ""} ${user.email || ""}`.toLowerCase().includes(query.toLowerCase())), [nonAdminUsers, query]);
  const totalUnread = nonAdminUsers.reduce((total, user) => total + messages.filter((message) => message.user_id === user.id && message.sender_type === "user" && message.status === "sent").length, 0);

  const selectUser = (user) => {
    setActiveUser(user);
    messages.filter((message) => message.user_id === user.id && message.sender_type === "user" && message.status === "sent").forEach((message) => markMessageSeen(message.id));
  };

  return <aside className={`admin-chat-users ${themeName === "dark" ? "is-dark" : "is-light"}`}>
    <div className="admin-chat-users-header"><div><span className="admin-chat-eyebrow">Guest care</span><h2>Conversations</h2><p>{nonAdminUsers.length} travelers in your inbox</p></div><span className="admin-chat-inbox-count"><FaInbox /> {totalUnread || 0}</span></div>
    <label className="admin-chat-search"><FaSearch /><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search travelers" aria-label="Search travelers" /></label>
    <div className="admin-chat-list" role="list">
      {filteredUsers.length > 0 ? filteredUsers.map((user) => {
        const unreadCount = messages.filter((message) => message.user_id === user.id && message.sender_type === "user" && message.status === "sent").length;
        const isActive = activeUser?.id === user.id;
        return <button type="button" role="listitem" key={user.id} onClick={() => selectUser(user)} className={`admin-chat-user-row ${isActive ? "is-active" : ""}`}>
          <span className="admin-chat-avatar-wrap"><img src={user.avatar_url || "/default-avatar.png"} alt="" className="admin-chat-avatar" /><span className="admin-chat-online-dot" /></span>
          <span className="admin-chat-user-copy"><strong>{user.name || "Unnamed traveler"}</strong><small>{user.email || "No email available"}</small></span>
          {unreadCount > 0 && <span className="admin-chat-unread">{unreadCount > 9 ? "9+" : unreadCount}</span>}
        </button>;
      }) : <div className="admin-chat-list-empty"><FaUserCircle /><strong>{query ? "No traveler found" : "No conversations yet"}</strong><span>{query ? "Try another search term." : "New guest messages will appear here."}</span></div>}
    </div>
  </aside>;
};

export default UsersSidebar;
