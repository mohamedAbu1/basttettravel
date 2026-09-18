"use client";

import React, { useEffect, useMemo } from "react";
import { ResponsiveBar } from "@nivo/bar";
import { ResponsiveLine } from "@nivo/line";
import { FaArrowUp, FaClipboardList, FaComments, FaDollarSign, FaPlus, FaSuitcase, FaUsers } from "react-icons/fa";
import { useUsers } from "../context/UserContext";
import { useTrip } from "../context/TripContext";
import { usePurchase } from "../context/PurchaseContext";

const chartTheme = {
  textColor: "rgba(255,248,233,.64)",
  fontSize: 11,
  axis: { ticks: { text: { fill: "rgba(255,248,233,.55)" } }, legend: { text: { fill: "rgba(255,248,233,.55)" } } },
  grid: { line: { stroke: "rgba(212,181,111,.12)", strokeWidth: 1 } },
  tooltip: { container: { background: "#102528", color: "#fff8e9", borderRadius: 10 } },
};

export default function DashboardHome({ onNavigate }) {
  const { users, fetchUsers } = useUsers();
  const { trips, fetchTrips } = useTrip();
  const { purchases, fetchPurchases } = usePurchase();

  useEffect(() => {
    fetchTrips();
    fetchPurchases();
    fetchUsers();
    // Provider actions can change identity between renders; only load the initial snapshot once.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const revenue = useMemo(() => purchases.reduce((sum, purchase) => sum + Number(purchase.amount || purchase.total || purchase.price || 0), 0), [purchases]);

  const bookingStatus = useMemo(() => {
    const values = { Confirmed: 0, Pending: 0, Cancelled: 0 };
    purchases.forEach((purchase) => {
      const status = String(purchase.status || "Pending").toLowerCase();
      if (status.includes("confirm") || status === "paid" || status === "completed") values.Confirmed += 1;
      else if (status.includes("cancel")) values.Cancelled += 1;
      else values.Pending += 1;
    });
    return Object.entries(values).map(([label, value]) => ({ label, value }));
  }, [purchases]);

  const bookingTrend = useMemo(() => Array.from({ length: 7 }, (_, index) => {
    const date = new Date();
    date.setHours(0, 0, 0, 0);
    date.setDate(date.getDate() - (6 - index));
    const key = date.toISOString().slice(0, 10);
    return { x: date.toLocaleDateString("en-US", { weekday: "short" }), y: purchases.filter((purchase) => String(purchase.created_at || "").slice(0, 10) === key).length };
  }), [purchases]);

  const stats = [
    { label: "Total users", value: users.length, icon: <FaUsers />, tone: "blue", note: "Registered travelers" },
    { label: "Published trips", value: trips.length, icon: <FaSuitcase />, tone: "gold", note: "Experiences in catalog" },
    { label: "Bookings", value: purchases.length, icon: <FaClipboardList />, tone: "green", note: "All reservations" },
    { label: "Revenue tracked", value: revenue ? `$${revenue.toLocaleString()}` : "$0", icon: <FaDollarSign />, tone: "purple", note: "From available records" },
  ];

  return (
    <div className="dashboard-content admin-overview">
      <section className="admin-overview-hero">
        <div><span className="admin-section-eyebrow">Today at a glance</span><h2>Run every journey with clarity.</h2><p>One calm workspace for your trips, travelers, reservations, and guest care.</p></div>
        <div className="admin-overview-hero-actions"><span className="dashboard-live-chip"><span /> System operational</span><button type="button" className="admin-primary-button admin-gold-button" onClick={() => onNavigate?.("addTrip")}><FaPlus /> New trip</button></div>
      </section>

      <section className="admin-stat-grid" aria-label="Workspace metrics">
        {stats.map((stat) => <article className={`admin-metric-card metric-${stat.tone}`} key={stat.label}><div className="admin-metric-icon">{stat.icon}</div><div><span>{stat.label}</span><strong>{stat.value}</strong><small>{stat.note}</small></div><FaArrowUp className="admin-metric-trend" aria-hidden="true" /></article>)}
      </section>

      <section className="admin-overview-grid">
        <article className="admin-surface-card admin-chart-card admin-chart-card-wide"><div className="admin-card-heading"><div><span className="admin-section-eyebrow">Momentum</span><h3>Booking activity</h3><p>Reservations created during the last seven days.</p></div><span className="admin-card-badge">Live data</span></div><div className="admin-chart-canvas"><ResponsiveLine data={[{ id: "Bookings", color: "#d4b56f", data: bookingTrend }]} theme={chartTheme} margin={{ top: 15, right: 18, bottom: 28, left: 30 }} xScale={{ type: "point" }} yScale={{ type: "linear", min: 0, max: "auto" }} curve="monotoneX" enableArea enablePoints={false} areaOpacity={0.12} colors={["#d4b56f"]} axisTop={null} axisRight={null} axisBottom={{ tickSize: 0, tickPadding: 10 }} axisLeft={{ tickSize: 0, tickPadding: 8, tickValues: 4 }} enableGridX={false} /></div></article>
        <article className="admin-surface-card admin-chart-card"><div className="admin-card-heading"><div><span className="admin-section-eyebrow">Operations</span><h3>Booking health</h3><p>Current reservation mix.</p></div><FaClipboardList className="admin-card-heading-icon" /></div><div className="admin-chart-canvas"><ResponsiveBar data={bookingStatus} keys={["value"]} indexBy="label" theme={chartTheme} margin={{ top: 15, right: 12, bottom: 30, left: 30 }} padding={0.45} borderRadius={5} colors={["#d4b56f"]} enableLabel={false} axisTop={null} axisRight={null} axisBottom={{ tickSize: 0, tickPadding: 8 }} axisLeft={{ tickSize: 0, tickPadding: 8, tickValues: 4 }} enableGridX={false} /></div></article>
      </section>

      <section className="admin-bottom-grid">
        <article className="admin-surface-card admin-activity-card"><div className="admin-card-heading"><div><span className="admin-section-eyebrow">Shortcuts</span><h3>Move faster</h3><p>Jump directly into the work that needs attention.</p></div></div><div className="admin-shortcut-grid"><button type="button" onClick={() => onNavigate?.("trips")}><FaSuitcase /><span><strong>Trip library</strong><small>Curate destinations</small></span><b>→</b></button><button type="button" onClick={() => onNavigate?.("bookings")}><FaClipboardList /><span><strong>Booking desk</strong><small>Review reservations</small></span><b>→</b></button><button type="button" onClick={() => onNavigate?.("users")}><FaUsers /><span><strong>Travelers</strong><small>Manage your community</small></span><b>→</b></button><button type="button" onClick={() => onNavigate?.("messages")}><FaComments /><span><strong>Guest care</strong><small>Answer conversations</small></span><b>→</b></button></div></article>
        <article className="admin-surface-card admin-health-card"><div className="admin-card-heading"><div><span className="admin-section-eyebrow">Workspace health</span><h3>Everything is in view</h3></div></div><div className="admin-health-list"><div><span className="admin-health-dot is-green" /><span>Catalog coverage</span><strong>{trips.length} trips</strong></div><div><span className="admin-health-dot is-blue" /><span>Guest community</span><strong>{users.length} users</strong></div><div><span className="admin-health-dot is-gold" /><span>Reservation pipeline</span><strong>{purchases.length} records</strong></div></div></article>
      </section>
    </div>
  );
}
