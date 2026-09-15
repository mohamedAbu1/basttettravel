/* eslint-disable react-hooks/static-components */
"use client";
import ThemeToggle from "@/components/ThemeToggle";
import React from "react";
import Link from "next/link";
import {
  FaHome,
  FaPlus,
  FaSuitcase,
  FaUsers,
  FaClipboardList,
  FaChartBar,
  FaEnvelope,
  FaEdit,
  FaCalendarAlt,
  FaCoins,
} from "react-icons/fa";
import EgyptianBackground from "@/components/layout/EgyptianBackground";

export default function Sidebar({ activeSection, setActiveSection }) {
  // ✅ دالة لتوليد زر مع حالة Active
  const NavButton = ({ section, icon, label }) => {
    const isActive = activeSection === section;
    return (
      <button
        onClick={() => setActiveSection(section)}
        className={`admin-nav-button ${isActive ? "is-active" : ""}`}
      >
        {/* ✅ خط جانبي يوضح الزر النشط */}
        <span className="admin-nav-icon">{icon}</span>
        <span>{label}</span>
        {isActive && <span className="admin-nav-active-dot" />}
      </button>
    );
  };

  return (
    <aside className="admin-sidebar">
      <EgyptianBackground />

      <div className="admin-brand">
        <div className="admin-brand-mark">𓂀</div>
        <div><strong>Basttet Travel</strong><small>Admin workspace</small></div>
        <ThemeToggle />
      </div>

      <div className="admin-profile-card">
        <div className="admin-profile-avatar">BT</div>
        <div><strong>Travel operations</strong><small>Administrator</small></div>
        <span className="admin-profile-dot" />
      </div>

      <nav className="admin-sidebar-nav">
        <Link
          href="/"
          className="admin-back-link"
        >
          <span>←</span> Back to Home
        </Link>

        <NavButton section="dashboard" icon={<FaHome />} label="Dashboard" />
        <NavButton section="addTrip" icon={<FaPlus />} label="Add New Trip" />
        <NavButton section="trips" icon={<FaSuitcase />} label="All Trips" />
        <NavButton section="editTrip" icon={<FaEdit />} label="Edit Trips" />
        <NavButton section="users" icon={<FaUsers />} label="Users" />
        <NavButton section="bookings" icon={<FaClipboardList />} label="Bookings" />
        <NavButton section="reports" icon={<FaChartBar />} label="Reports" />
        <NavButton section="messages" icon={<FaEnvelope />} label="Messages" />
        <NavButton section="currency" icon={<FaCoins />} label="Currency Rates" />
        <NavButton section="seasonalEvents" icon={<FaCalendarAlt />} label="Seasonal Events" />
      </nav>
    </aside>
  );
}
