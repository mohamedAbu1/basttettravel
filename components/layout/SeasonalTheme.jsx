"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { getActiveSeasonalEvent, getSeasonalEvent, getSeasonalEventFromConfig, seasonalThemes } from "@/lib/seasonalEvents";

const SeasonalContext = createContext(null);

export const useSeasonalEvent = () => useContext(SeasonalContext);

export default function SeasonalTheme({ children }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const preview = searchParams.get("seasonPreview");
  const [config, setConfig] = useState([]);
  const [configLoaded, setConfigLoaded] = useState(false);
  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();
    const load = () => {
      fetch("/api/seasonal-events", { cache: "no-store", signal: controller.signal })
        .then((response) => response.ok ? response.json() : [])
        .then((data) => {
          if (!cancelled) setConfig(Array.isArray(data) ? data : []);
        })
        .catch((error) => {
          if (error.name !== "AbortError" && !cancelled) setConfig([]);
        })
        .finally(() => {
          if (!cancelled) setConfigLoaded(true);
        });
    };
    const idleId = window.requestIdleCallback
      ? window.requestIdleCallback(load, { timeout: 2500 })
      : window.setTimeout(load, 1200);
    return () => {
      cancelled = true;
      controller.abort();
      if (window.cancelIdleCallback && typeof idleId === "number") window.cancelIdleCallback(idleId);
      else window.clearTimeout(idleId);
    };
  }, []);
  const event = useMemo(() => {
    // A preview must use the saved campaign settings even when its calendar
    // window is not active today. This makes design QA deterministic.
    if (configLoaded && preview) {
      const configuredPreview = config.find((item) => item.key === preview && (item.enabled === true || item.enabled === 1 || item.enabled === "1"));
      if (configuredPreview) return { ...configuredPreview, discount: Number(configuredPreview.discount) || 0, ...seasonalThemes[configuredPreview.theme] };
      return getSeasonalEvent(preview);
    }
    return configLoaded && config.length ? getSeasonalEventFromConfig(config) : getActiveSeasonalEvent();
  }, [config, configLoaded, preview]);
  const isAdmin = pathname?.includes("/admin");

  useEffect(() => {
    const root = document.documentElement;
    const active = !isAdmin && event;
    root.classList.toggle("has-seasonal-theme", Boolean(active));
    root.dataset.season = active?.theme || "default";

    if (active) {
      root.style.setProperty("--season-accent", active.accent);
      root.style.setProperty("--season-accent-strong", active.accentStrong);
      root.style.setProperty("--season-accent-contrast", active.accentContrast);
      root.style.setProperty("--season-glow", active.glow);
      root.style.setProperty("--season-page", active.page);
      root.style.setProperty("--season-surface", active.surface);
      root.style.setProperty("--season-surface-strong", active.surfaceStrong);
      root.style.setProperty("--season-border", active.border);
      root.style.setProperty("--season-pattern", active.pattern);
    } else {
      ["--season-accent", "--season-accent-strong", "--season-accent-contrast", "--season-glow", "--season-page", "--season-surface", "--season-surface-strong", "--season-border", "--season-pattern"].forEach((property) => root.style.removeProperty(property));
    }

    return () => root.classList.remove("has-seasonal-theme");
  }, [event, isAdmin]);

  const active = !isAdmin && event;

  return (
    <SeasonalContext.Provider value={event}>
      <>
      {active && (
        <aside className="seasonal-banner" role="status" aria-label={`${active.label} campaign`}>
          <span className="seasonal-banner-icon" aria-hidden="true">{active.icon}</span>
          <span><strong>{active.label}</strong> · {active.message}</span>
          <span className="seasonal-banner-offer">Save {active.discount}% on selected journeys</span>
        </aside>
      )}
        {children}
      </>
    </SeasonalContext.Provider>
  );
}
