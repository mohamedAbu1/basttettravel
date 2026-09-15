"use client";
import React, { useEffect } from "react";
import { useTheme } from "@/context/ThemeContext";
import { ResponsiveBar } from "@nivo/bar";
import { ResponsivePie } from "@nivo/pie";
import { ResponsiveLine } from "@nivo/line";
import {
  FaUsers,
  FaSuitcase,
  FaClipboardList,
  FaDollarSign,
} from "react-icons/fa";
import EgyptianBackground from "@/components/layout/EgyptianBackground";

// ✅ استدعاء الـ contexts
import { useUsers } from "../context/UserContext";
import { useTrip } from "../context/TripContext";
import { usePurchase } from "../context/PurchaseContext";

export default function DashboardHome() {
  const { themeName } = useTheme();
  const { users, fetchUsers } = useUsers();
  const { trips, fetchTrips } = useTrip();
  const { purchases, fetchPurchases } = usePurchase();

  // بيانات أساسية من الـ contexts
  const stats = [
    { id: "Users", value: users.length },
    { id: "Trips", value: trips.length },
    { id: "Bookings", value: purchases.length },
    { id: "Revenue", value: 25 }, // هنا ممكن تربطها بكونتكست لو عندك
  ];

  const colors = themeName === "dark" ? { scheme: "nivo" } : { scheme: "set2" };

  const sectionStyle = `dashboard-panel ${themeName === "dark" ? "dashboard-panel-dark" : "dashboard-panel-light"}`;

  const quickStats = [
    { title: "Users", value: users.length, icon: <FaUsers /> },
    { title: "Trips", value: trips.length, icon: <FaSuitcase /> },
    { title: "Bookings", value: purchases.length, icon: <FaClipboardList /> },
    { title: "Revenue", value: "$250K", icon: <FaDollarSign /> },
  ];
  useEffect(() => {
    fetchTrips();
    fetchPurchases();
    fetchUsers(); // ✅ تحميل تلقائي عند أول فتح
  }, []);
  return (
    <div className="dashboard-content mt-2">
      <EgyptianBackground />

      <div className="dashboard-welcome-row">
        <div><span className="admin-section-eyebrow">Today at a glance</span><h2>Good to see you, team.</h2><p>Your workspace is ready for the next journey.</p></div>
        <span className="dashboard-live-chip"><span /> Updated just now</span>
      </div>

      {/* ✅ Quick Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {quickStats.map((card, i) => (
          <div
            key={i}
            className={`${sectionStyle} dashboard-stat-card`}
          >
            <div className="dashboard-stat-icon">{card.icon}</div>
            <div className="dashboard-stat-copy"><h4>{card.title}</h4><p>{card.value}</p></div>
            <span className="dashboard-stat-arrow">↗</span>
          </div>
        ))}
      </div>

      {/* ✅ Bar Chart */}
      <div className={`${sectionStyle} dashboard-chart-panel`}>
        <div className="dashboard-panel-heading"><div><span className="admin-section-eyebrow">Growth</span><h3>Users & trips</h3></div><span className="dashboard-heading-note">Live data</span></div>
        <ResponsiveBar
          data={stats}
          keys={["value"]}
          indexBy="id"
          margin={{ top: 20, right: 20, bottom: 50, left: 60 }}
          padding={0.3}
          colors={colors}
          axisBottom={{
            legend: "Category",
            legendPosition: "middle",
            legendOffset: 40,
          }}
          axisLeft={{
            legend: "Value",
            legendPosition: "middle",
            legendOffset: -50,
          }}
        />
      </div>

      {/* ✅ Pie Chart */}
      <div className={`${sectionStyle} dashboard-chart-panel`}>
        <div className="dashboard-panel-heading"><div><span className="admin-section-eyebrow">Finance</span><h3>Revenue distribution</h3></div><span className="dashboard-heading-note">This period</span></div>
        <ResponsivePie
          data={stats}
          margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          innerRadius={0.5}
          padAngle={0.7}
          cornerRadius={3}
          colors={colors}
        />
      </div>

      {/* ✅ Line Chart */}
      <div className={`${sectionStyle} dashboard-chart-panel`}>
        <div className="dashboard-panel-heading"><div><span className="admin-section-eyebrow">Momentum</span><h3>Bookings over time</h3></div><span className="dashboard-heading-note">Recent activity</span></div>
        <ResponsiveLine
          data={[
            {
              id: "Bookings",
              data: purchases.map((p) => ({
                x: new Date(p.created_at).toLocaleDateString(),
                y: 1, // ممكن تجمعهم حسب التاريخ لو عايز
              })),
            },
          ]}
          margin={{ top: 20, right: 20, bottom: 50, left: 60 }}
          xScale={{ type: "point" }}
          yScale={{ type: "linear", min: "auto", max: "auto" }}
          colors={colors}
        />
      </div>
    </div>
  );
}
