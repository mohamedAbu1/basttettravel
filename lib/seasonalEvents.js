const fixedEvent = (key, label, startMonth, startDay, endMonth, endDay, discount, theme) => ({
  key,
  label,
  startMonth,
  startDay,
  endMonth,
  endDay,
  discount,
  theme,
});

export const seasonalEvents = [
  fixedEvent("newYear", "New Year", 1, 1, 1, 7, 15, "new-year"),
  fixedEvent("valentinesDay", "Valentine's Day", 2, 14, 2, 16, 15, "valentines-day"),
  fixedEvent("womensDay", "International Women's Day", 3, 8, 3, 10, 12, "womens-day"),
  fixedEvent("mothersDay", "Mother's Day", 3, 21, 3, 24, 12, "mothers-day"),
  fixedEvent("halloween", "Halloween", 10, 25, 11, 1, 10, "halloween"),
];

// Lunar dates are intentionally kept in one place so they can be replaced from the dashboard later.
export const lunarSeasonalDates = {
  2026: {
    ramadan: ["2026-02-18", "2026-03-19"],
    eidAlFitr: ["2026-03-20", "2026-03-23"],
  },
  2027: {
    ramadan: ["2027-02-08", "2027-03-08"],
    eidAlFitr: ["2027-03-09", "2027-03-12"],
  },
  2028: {
    ramadan: ["2028-01-27", "2028-02-25"],
    eidAlFitr: ["2028-02-26", "2028-02-29"],
  },
};

export const seasonalThemes = {
  "new-year": {
    accent: "#e8c46a",
    accentStrong: "#fff1a8",
    accentContrast: "#18252b",
    glow: "rgba(232, 196, 106, .26)",
    page: "#101d24",
    surface: "rgba(23, 43, 51, .82)",
    surfaceStrong: "rgba(29, 54, 63, .95)",
    border: "rgba(232, 196, 106, .34)",
    pattern: "radial-gradient(circle at 10% 10%, rgba(255,241,168,.13) 0 1px, transparent 2px), radial-gradient(circle at 90% 22%, rgba(232,196,106,.12) 0 1px, transparent 2px)",
    icon: "✦",
    message: "Begin the year with an unforgettable Egyptian escape.",
  },
  "womens-day": {
    accent: "#e9a6b8",
    accentStrong: "#ffd9e3",
    accentContrast: "#341d2c",
    glow: "rgba(233, 166, 184, .24)",
    page: "#241b27",
    surface: "rgba(61, 35, 55, .78)",
    surfaceStrong: "rgba(76, 42, 67, .94)",
    border: "rgba(233, 166, 184, .34)",
    pattern: "radial-gradient(circle at 12% 16%, rgba(255,217,227,.13) 0 2px, transparent 3px), radial-gradient(circle at 88% 30%, rgba(233,166,184,.12) 0 2px, transparent 3px)",
    icon: "❀",
    message: "Celebrate the women who make every journey meaningful.",
  },
  "valentines-day": {
    accent: "#f07f9a",
    accentStrong: "#ffd1dc",
    accentContrast: "#3b1724",
    glow: "rgba(240, 127, 154, .25)",
    page: "#241820",
    surface: "rgba(69, 35, 49, .8)",
    surfaceStrong: "rgba(87, 43, 61, .95)",
    border: "rgba(240, 127, 154, .36)",
    pattern: "radial-gradient(circle at 12% 16%, rgba(255,209,220,.14) 0 2px, transparent 3px), radial-gradient(circle at 88% 30%, rgba(240,127,154,.12) 0 2px, transparent 3px)",
    icon: "♡",
    message: "Celebrate love with an unforgettable Egyptian escape.",
  },
  "mothers-day": {
    accent: "#efb06d",
    accentStrong: "#ffe0ac",
    accentContrast: "#39271c",
    glow: "rgba(239, 176, 109, .23)",
    page: "#241d18",
    surface: "rgba(69, 45, 30, .78)",
    surfaceStrong: "rgba(83, 53, 35, .94)",
    border: "rgba(239, 176, 109, .34)",
    pattern: "radial-gradient(circle at 14% 18%, rgba(255,224,172,.14) 0 2px, transparent 3px), radial-gradient(circle at 86% 22%, rgba(239,176,109,.1) 0 2px, transparent 3px)",
    icon: "♡",
    message: "Make memories together with a warm Egyptian getaway.",
  },
  ramadan: {
    accent: "#6fd3c2",
    accentStrong: "#c7fff1",
    accentContrast: "#102c2d",
    glow: "rgba(111, 211, 194, .22)",
    page: "#0d2027",
    surface: "rgba(18, 56, 61, .8)",
    surfaceStrong: "rgba(22, 70, 73, .95)",
    border: "rgba(111, 211, 194, .34)",
    pattern: "radial-gradient(circle at 12% 18%, rgba(199,255,241,.14) 0 1px, transparent 2px), radial-gradient(circle at 84% 24%, rgba(111,211,194,.11) 0 1px, transparent 2px)",
    icon: "☾",
    message: "Share the spirit of Ramadan across the Nile.",
  },
  "eid-al-fitr": {
    accent: "#9fd36b",
    accentStrong: "#e4ffbf",
    accentContrast: "#18311f",
    glow: "rgba(159, 211, 107, .22)",
    page: "#14241c",
    surface: "rgba(32, 69, 47, .8)",
    surfaceStrong: "rgba(41, 86, 55, .95)",
    border: "rgba(159, 211, 107, .34)",
    pattern: "radial-gradient(circle at 15% 18%, rgba(228,255,191,.14) 0 2px, transparent 3px), radial-gradient(circle at 85% 28%, rgba(159,211,107,.1) 0 2px, transparent 3px)",
    icon: "✧",
    message: "Celebrate Eid with a journey made for togetherness.",
  },
  halloween: {
    accent: "#f28b45",
    accentStrong: "#ffd0a8",
    accentContrast: "#351b18",
    glow: "rgba(242, 139, 69, .24)",
    page: "#17151d",
    surface: "rgba(49, 30, 44, .82)",
    surfaceStrong: "rgba(65, 38, 53, .95)",
    border: "rgba(242, 139, 69, .36)",
    pattern: "radial-gradient(circle at 12% 18%, rgba(255,208,168,.12) 0 2px, transparent 3px), radial-gradient(circle at 86% 26%, rgba(242,139,69,.12) 0 2px, transparent 3px)",
    icon: "☽",
    message: "Discover the mysterious side of Egypt this season.",
  },
};

// MySQL DATE values can arrive as `YYYY-MM-DD` or as a full ISO timestamp.
// Always reduce them to a calendar day before comparing so timezone conversion
// cannot silently move the campaign to the previous/next day.
export const dateKey = (value) => String(value || "").slice(0, 10);

const dateOnly = (value) => {
  const key = dateKey(value);
  const [year, month, day] = key.split("-").map(Number);
  return year && month && day ? new Date(year, month - 1, day, 12) : null;
};

const calendarDay = (value) => {
  const source = value instanceof Date ? value : dateOnly(value);
  return source && !Number.isNaN(source.getTime())
    ? new Date(source.getFullYear(), source.getMonth(), source.getDate(), 12)
    : null;
};

const isInRange = (today, start, end) => {
  if (!start || !end || Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) return false;
  const current = today.getTime();
  let endDate = end;
  if (end < start) endDate = new Date(end.getFullYear() + 1, end.getMonth(), end.getDate(), 12);
  return current >= start.getTime() && current <= endDate.getTime();
};

export function getActiveSeasonalEvent(now = new Date()) {
  now = calendarDay(now) || new Date();
  const year = now.getFullYear();
  const lunar = lunarSeasonalDates[year];

  if (lunar) {
    for (const key of ["eidAlFitr", "ramadan"]) {
      const [start, end] = lunar[key];
      if (isInRange(now, dateOnly(start), dateOnly(end))) {
        const event = seasonalThemes[key === "eidAlFitr" ? "eid-al-fitr" : "ramadan"];
        return { key, theme: key === "eidAlFitr" ? "eid-al-fitr" : "ramadan", label: key === "eidAlFitr" ? "Eid Al-Fitr" : "Ramadan", discount: key === "eidAlFitr" ? 20 : 18, ...event };
      }
    }
  }

  return seasonalEvents.find((event) => {
    const start = new Date(year, event.startMonth - 1, event.startDay, 12);
    const endYear = event.endMonth < event.startMonth ? year + 1 : year;
    const end = new Date(endYear, event.endMonth - 1, event.endDay, 12);
    return isInRange(now, start, end);
  }) || null;
}

export function getSeasonalEvent(key) {
  if (key === "ramadan" || key === "eidAlFitr") {
    const theme = key === "eidAlFitr" ? "eid-al-fitr" : "ramadan";
    return { key, theme, label: key === "eidAlFitr" ? "Eid Al-Fitr" : "Ramadan", discount: key === "eidAlFitr" ? 20 : 18, ...seasonalThemes[theme] };
  }
  const event = seasonalEvents.find((item) => item.key === key);
  return event ? { ...event, ...seasonalThemes[event.theme] } : null;
}

export function getSeasonalEventFromConfig(config = [], now = new Date()) {
  const today = calendarDay(now) || new Date();
  const active = config.find((item) => {
    if (!(item?.enabled === true || item?.enabled === 1 || item?.enabled === "1")) return false;
    let start = dateOnly(item.start_date);
    let end = dateOnly(item.end_date);
    if (!start || !end) return false;
    if (item.annual) {
      start.setFullYear(today.getFullYear());
      end.setFullYear(today.getFullYear());
      if (end < start && today < start) {
        start.setFullYear(today.getFullYear() - 1);
      } else if (end < start) {
        end.setFullYear(today.getFullYear() + 1);
      }
    }
    return isInRange(today, start, end);
  });
  if (!active) return null;
  return { ...active, discount: Number(active.discount) || 0, ...seasonalThemes[active.theme] };
}
