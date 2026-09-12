// middleware.js
import { NextResponse } from "next/server";

export function middleware(req) {
  const url = req.nextUrl.clone();
  const segments = url.pathname.split("/").filter(Boolean);

  // استثناء مسارات النظام والملفات الثابتة
  if (
    url.pathname.startsWith("/_next") ||
    url.pathname.startsWith("/favicon.ico") ||
    url.pathname.startsWith("/brand") ||
    url.pathname === "/sitemap.xml" ||
    url.pathname === "/robots.txt" ||
    url.pathname.startsWith("/api") ||
    url.pathname.startsWith("/assets") ||
    url.pathname.startsWith("/HomePageImage") ||
    url.pathname.startsWith("/Aswan")||
    url.pathname.startsWith("/Fayoum")||
    url.pathname.startsWith("/Luxor")||
    url.pathname.startsWith("/Cairo")||
    url.pathname.startsWith("/Hurghada")||
    url.pathname.startsWith("/Marsa_Alam")||
    url.pathname.startsWith("/Sharm_El_Sheikh")||
    url.pathname.startsWith("/Alexandria")||
    url.pathname.startsWith("/Nile_Cruise")||
    url.pathname.startsWith("/Siwa")||
    url.pathname.startsWith("/Historicaltourism")||
    url.pathname.startsWith("/avater")
  ) {
    return NextResponse.next();
  }

  // اللغات المدعومة
  const supportedLangs = ["en", "es", "fr", "de", "it", "zh"];

  // اللغة المكتشفة من المتصفح
  const browserLang =
    req.headers.get("accept-language")?.split(",")[0].split("-")[0] || "en";

  // لو أول جزء من المسار مش لغة مدعومة → أضف اللغة المكتشفة
  if (!segments.length || !supportedLangs.includes(segments[0])) {
    const langToUse = supportedLangs.includes(browserLang)
      ? browserLang
      : "en";
    url.pathname = `/${langToUse}${url.pathname}`;
    return NextResponse.redirect(url);
  }

  // Pass the resolved locale to the root layout so the initial HTML has the
  // correct language and direction before hydration.
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-locale", segments[0]);
  return NextResponse.next({ request: { headers: requestHeaders } });
}
