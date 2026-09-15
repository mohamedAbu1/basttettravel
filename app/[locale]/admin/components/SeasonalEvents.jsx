"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

const dateValue = (value) => String(value || "").slice(0, 10);

export default function SeasonalEvents({ themeName }) {
  const params = useParams();
  const locale = params?.locale || "en";
  const [events, setEvents] = useState([]);
  const [status, setStatus] = useState({ loading: true, saving: false, error: "", success: "" });

  const loadEvents = async () => {
    setStatus((current) => ({ ...current, loading: true, error: "" }));
    try {
      const response = await fetch("/api/seasonal-events", { cache: "no-store" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not load seasonal events");
      setEvents(data.map((event) => ({ ...event, start_date: dateValue(event.start_date), end_date: dateValue(event.end_date), discount: Number(event.discount) })));
    } catch (error) {
      setStatus((current) => ({ ...current, error: error.message }));
    } finally {
      setStatus((current) => ({ ...current, loading: false }));
    }
  };

  useEffect(() => { loadEvents(); }, []);

  const updateEvent = (key, changes) => {
    setEvents((current) => current.map((event) => event.key === key ? { ...event, ...changes } : event));
  };

  const saveEvents = async () => {
    setStatus({ loading: false, saving: true, error: "", success: "" });
    try {
      const response = await fetch("/api/seasonal-events", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ events }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Could not save seasonal events");
      setEvents(data.map((event) => ({ ...event, start_date: dateValue(event.start_date), end_date: dateValue(event.end_date), discount: Number(event.discount) })));
      setStatus({ loading: false, saving: false, error: "", success: "Seasonal settings saved successfully." });
    } catch (error) {
      setStatus({ loading: false, saving: false, error: error.message, success: "" });
    }
  };

  const card = themeName === "dark"
    ? "border border-white/10 bg-white/[0.04] text-white"
    : "border border-[#c9a34a]/20 bg-white/80 text-[#24343a]";
  const input = themeName === "dark"
    ? "border-white/10 bg-black/30 text-white"
    : "border-[#c9a34a]/30 bg-white text-[#24343a]";

  return (
    <section className="admin-page-panel p-6">
      <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[.22em] opacity-60">Campaign control</p>
          <h2 className="mt-2 text-3xl font-bold">Seasonal Events</h2>
          <p className="mt-2 max-w-2xl text-sm opacity-70">Control when each public-site design is active, its discount, and whether the campaign is visible.</p>
        </div>
        <div className="admin-page-actions">
          <button type="button" onClick={saveEvents} disabled={status.saving || status.loading} className="admin-primary-button rounded-xl bg-[#c9a34a] px-5 py-3 font-bold text-[#18252b] shadow-lg transition hover:-translate-y-0.5 disabled:opacity-50">
            {status.saving ? "Saving..." : "Save all changes"}
          </button>
        </div>
      </div>

      {status.error && <p className="mb-4 rounded-xl border border-red-400/40 bg-red-500/10 p-4 text-sm text-red-300">{status.error}</p>}
      {status.success && <p className="mb-4 rounded-xl border border-emerald-400/40 bg-emerald-500/10 p-4 text-sm text-emerald-300">{status.success}</p>}
      {status.loading ? <p className="py-12 text-center opacity-70">Loading seasonal settings...</p> : (
        <div className="grid gap-4 xl:grid-cols-2">
          {events.map((event) => (
            <article key={event.key} className={`admin-event-card rounded-2xl p-5 shadow-xl ${card}`}>
              <div className="mb-5 flex items-start justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold">{event.label}</h3>
                  <p className="mt-1 text-xs uppercase tracking-[.18em] opacity-50">{event.theme}</p>
                </div>
                <label className="admin-switch flex items-center gap-2 text-sm font-semibold">
                  <input type="checkbox" checked={Boolean(event.enabled)} onChange={(e) => updateEvent(event.key, { enabled: e.target.checked })} />
                  Active
                </label>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="text-sm font-semibold">Start date<input type="date" value={event.start_date} onChange={(e) => updateEvent(event.key, { start_date: e.target.value })} className={`mt-2 w-full rounded-xl border px-3 py-2 ${input}`} /></label>
                <label className="text-sm font-semibold">End date<input type="date" value={event.end_date} onChange={(e) => updateEvent(event.key, { end_date: e.target.value })} className={`mt-2 w-full rounded-xl border px-3 py-2 ${input}`} /></label>
              </div>
              <div className="mt-4 flex items-center gap-3">
                <label className="flex-1 text-sm font-semibold">Discount %<input type="number" min="0" max="100" value={event.discount} onChange={(e) => updateEvent(event.key, { discount: e.target.value })} className={`mt-2 w-full rounded-xl border px-3 py-2 ${input}`} /></label>
                <label className="admin-switch mt-6 flex items-center gap-2 text-sm"><input type="checkbox" checked={Boolean(event.annual)} onChange={(e) => updateEvent(event.key, { annual: e.target.checked })} /> Repeat yearly</label>
              </div>
              <div className="admin-event-preview-row">
                <span>Preview the public campaign with these saved settings.</span>
                <a href={`/${locale}?seasonPreview=${encodeURIComponent(event.key)}`} target="_blank" rel="noreferrer" className="admin-preview-link">Open preview ↗</a>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
