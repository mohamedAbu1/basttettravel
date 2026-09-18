/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { FaCrown, FaSearch, FaShieldAlt, FaUserCog, FaUsers } from "react-icons/fa";
import { useUsers } from "@/context/UserContext";
import { useReviews } from "@/context/ReviewsContext";
import UserActions from "./components/UserActions";
import UserDetails from "./components/UserDetails";

const UsersSection = () => {
  const { users = [], fetchUsers, setUsers, loading, error } = useUsers();
  const { fetchAllReviews } = useReviews();
  const [activeUser, setActiveUser] = useState(null);
  const [activeTab, setActiveTab] = useState(null);
  const [query, setQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    if (!users.length) fetchUsers();
    fetchAllReviews();
    // Load the section independently when it is opened directly.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const stats = useMemo(() => ({
    total: users.length,
    admins: users.filter((user) => user.role?.toUpperCase() === "ADMIN").length,
    travelers: users.filter((user) => user.role?.toUpperCase() !== "ADMIN").length,
  }), [users]);

  const filteredUsers = useMemo(() => users.filter((user) => {
    const matchesQuery = `${user.name || ""} ${user.email || ""}`.toLowerCase().includes(query.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role?.toUpperCase() === roleFilter;
    return matchesQuery && matchesRole;
  }), [users, query, roleFilter]);

  const handleToggle = (userId, tab) => {
    if (activeUser === userId && activeTab === tab) { setActiveUser(null); setActiveTab(null); } else { setActiveUser(userId); setActiveTab(tab); }
  };

  const handleToggleRole = async (user) => {
    const newRole = user?.role?.toUpperCase() === "ADMIN" ? "USER" : "ADMIN";
    setUpdatingId(user.id);
    try {
      const response = await fetch("/api/updateRole", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ userId: user.id, newRole }) });
      const data = await response.json();
      if (!response.ok || data.error) throw new Error(data.error || "Unable to update role");
      setUsers((previous) => previous.map((item) => item.id === user.id ? { ...item, role: data.role } : item));
    } catch (roleError) {
      console.error("Unable to update role:", roleError);
    } finally {
      setUpdatingId(null);
    }
  };

  return <motion.section className="users-management-page" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .35 }}>
    <header className="users-management-hero"><div><span className="admin-section-eyebrow">People & access</span><h2>Users management</h2><p>Understand your community, protect access, and keep every traveler profile organized.</p></div><div className="users-hero-mark"><FaUsers /><strong>{stats.total}</strong><span>Total profiles</span></div></header>
    <div className="users-stat-grid"><div className="users-stat-card"><span className="users-stat-icon"><FaUsers /></span><div><small>All profiles</small><strong>{stats.total}</strong></div></div><div className="users-stat-card is-gold"><span className="users-stat-icon"><FaCrown /></span><div><small>Administrators</small><strong>{stats.admins}</strong></div></div><div className="users-stat-card is-green"><span className="users-stat-icon"><FaShieldAlt /></span><div><small>Travelers</small><strong>{stats.travelers}</strong></div></div></div>
    <div className="users-directory-toolbar"><label className="users-search"><FaSearch /><input type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by name or email" aria-label="Search users" /></label><div className="users-role-filter" role="tablist"><button type="button" className={roleFilter === "all" ? "is-active" : ""} onClick={() => setRoleFilter("all")}>All <span>{stats.total}</span></button><button type="button" className={roleFilter === "USER" ? "is-active" : ""} onClick={() => setRoleFilter("USER")}>Travelers <span>{stats.travelers}</span></button><button type="button" className={roleFilter === "ADMIN" ? "is-active" : ""} onClick={() => setRoleFilter("ADMIN")}>Admins <span>{stats.admins}</span></button></div></div>
    {error && <div className="users-error-state">{error}</div>}
    <div className="users-directory"><div className="users-directory-header"><span>Profile</span><span>Role</span><span>Engagement</span><span>Actions</span></div>{loading && !users.length ? <div className="users-loading-state"><FaUsers /> Loading profiles…</div> : filteredUsers.length ? filteredUsers.map((user, index) => <motion.article key={user.id} className="user-directory-row" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: index * .035 }}><div className="user-profile-cell"><img src={user.avatar_url || "/default-avatar.png"} alt="" /><div><strong>{user.name || "Unnamed user"}</strong><span>{user.email || "No email"}</span></div></div><div><span className={`user-role-pill ${user.role?.toUpperCase() === "ADMIN" ? "is-admin" : "is-user"}`}>{user.role?.toUpperCase() === "ADMIN" ? <FaCrown /> : <FaUserCog />}{user.role?.toUpperCase() === "ADMIN" ? "Admin" : "Traveler"}</span></div><UserActions user={user} handleToggle={handleToggle} /><div className="user-row-actions"><button type="button" onClick={() => handleToggleRole(user)} disabled={updatingId === user.id}>{updatingId === user.id ? "Updating…" : user.role?.toUpperCase() === "ADMIN" ? "Make traveler" : "Make admin"}</button></div>{activeUser === user.id && <div className="user-details-drawer"><UserDetails user={user} activeTab={activeTab} /></div>}</motion.article>) : <div className="users-empty-state"><FaUsers /><strong>No profiles match your filters</strong><span>Try a different name, email, or role.</span></div>}</div>
  </motion.section>;
};

export default UsersSection;
