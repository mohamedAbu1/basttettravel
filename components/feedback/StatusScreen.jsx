"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useTheme } from "@/context/ThemeContext";

const copy = {
  en: {
    loadingTitle: "Preparing your journey",
    loadingMessage: "We are getting everything ready for you.",
    errorTitle: "Something went wrong",
    errorMessage: "We could not complete this request. Please try again.",
    notFoundTitle: "This page is off the map",
    notFoundMessage: "The page you are looking for may have moved or no longer exists.",
    home: "Back to home",
    retry: "Try again",
  },
  ar: {
    loadingTitle: "نجهز رحلتك",
    loadingMessage: "نقوم بتجهيز كل شيء لك.",
    errorTitle: "حدث خطأ غير متوقع",
    errorMessage: "تعذر إكمال الطلب. يرجى المحاولة مرة أخرى.",
    notFoundTitle: "هذه الصفحة خارج الخريطة",
    notFoundMessage: "ربما تم نقل الصفحة أو لم تعد موجودة.",
    home: "العودة للرئيسية",
    retry: "المحاولة مرة أخرى",
  },
  es: {
    loadingTitle: "Preparando tu viaje",
    loadingMessage: "Estamos preparando todo para ti.",
    errorTitle: "Algo salió mal",
    errorMessage: "No pudimos completar esta solicitud. Inténtalo de nuevo.",
    notFoundTitle: "Esta página está fuera del mapa",
    notFoundMessage: "Es posible que la página se haya movido o ya no exista.",
    home: "Volver al inicio",
    retry: "Intentar de nuevo",
  },
  fr: {
    loadingTitle: "Préparation de votre voyage",
    loadingMessage: "Nous préparons tout pour vous.",
    errorTitle: "Une erreur est survenue",
    errorMessage: "Nous n’avons pas pu terminer cette demande. Réessayez.",
    notFoundTitle: "Cette page est hors de la carte",
    notFoundMessage: "La page a peut-être été déplacée ou supprimée.",
    home: "Retour à l’accueil",
    retry: "Réessayer",
  },
  de: {
    loadingTitle: "Ihre Reise wird vorbereitet",
    loadingMessage: "Wir bereiten alles für Sie vor.",
    errorTitle: "Etwas ist schiefgelaufen",
    errorMessage: "Diese Anfrage konnte nicht abgeschlossen werden. Bitte versuchen Sie es erneut.",
    notFoundTitle: "Diese Seite liegt außerhalb der Karte",
    notFoundMessage: "Die gesuchte Seite wurde möglicherweise verschoben oder existiert nicht mehr.",
    home: "Zur Startseite",
    retry: "Erneut versuchen",
  },
  it: {
    loadingTitle: "Prepariamo il tuo viaggio",
    loadingMessage: "Stiamo preparando tutto per te.",
    errorTitle: "Qualcosa è andato storto",
    errorMessage: "Non è stato possibile completare la richiesta. Riprova.",
    notFoundTitle: "Questa pagina è fuori mappa",
    notFoundMessage: "La pagina potrebbe essere stata spostata o non esistere più.",
    home: "Torna alla home",
    retry: "Riprova",
  },
  zh: {
    loadingTitle: "正在准备您的旅程",
    loadingMessage: "我们正在为您准备一切。",
    errorTitle: "出了点问题",
    errorMessage: "无法完成此请求，请重试。",
    notFoundTitle: "此页面不在地图上",
    notFoundMessage: "您要查找的页面可能已移动或不存在。",
    home: "返回首页",
    retry: "重试",
  },
};

function getPageCopy(locale, mode) {
  const language = copy[locale] || copy.en;
  if (mode === "loading") return { title: language.loadingTitle, message: language.loadingMessage };
  if (mode === "not-found") return { title: language.notFoundTitle, message: language.notFoundMessage };
  return { title: language.errorTitle, message: language.errorMessage };
}

/** Shared branded feedback screen for loading, error, and 404 boundaries. */
export default function StatusScreen({ mode = "error", error, reset }) {
  const { theme, themeName } = useTheme();
  const params = useParams();
  const locale = params?.locale || "en";
  const language = copy[locale] || copy.en;
  const content = getPageCopy(locale, mode);
  const isLoading = mode === "loading";
  const isNotFound = mode === "not-found";
  const isDark = themeName === "dark";
  const homeHref = params?.locale ? `/${locale}` : "/";

  return (
    <main
      className={`status-screen relative isolate flex min-h-screen items-center justify-center overflow-hidden px-6 py-16 ${theme?.background || (isDark ? "bg-[#121212]" : "bg-[#f8f5ed]")} ${theme?.text || (isDark ? "text-[#E6DCCF]" : "text-[#1A4D5C]")}`}
      dir={locale === "ar" ? "rtl" : "ltr"}
    >
      <div className="status-screen__glow status-screen__glow--one" aria-hidden="true" />
      <div className="status-screen__glow status-screen__glow--two" aria-hidden="true" />
      <div className="status-screen__stars" aria-hidden="true">
        {Array.from({ length: 12 }, (_, index) => (
          <span
            key={index}
            style={{
              top: `${(index * 17 + 8) % 100}%`,
              left: `${(index * 29 + 5) % 100}%`,
              animationDelay: `${index * -0.18}s`,
            }}
          />
        ))}
      </div>

      <section className={`status-card relative z-10 w-full max-w-xl rounded-3xl p-8 text-center sm:p-12 ${theme?.card || (isDark ? "border border-[#C2A878]/50 bg-[#232323]/90" : "border border-[#C2A878]/60 bg-white/70")}`} aria-live={isLoading ? "polite" : "assertive"}>
        <div className={`status-emblem ${isLoading ? "status-emblem--loading" : ""}`}>
          {isLoading ? <span className="status-spinner" aria-hidden="true" /> : isNotFound ? <span aria-hidden="true">𓂀</span> : <span aria-hidden="true">!</span>}
        </div>

        <p className="mb-3 text-sm font-semibold uppercase tracking-[0.3em] text-[#C2A878]">{isLoading ? "Basttet Travel" : isNotFound ? "404" : "500"}</p>
        <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">{content.title}</h1>
        <p className="mx-auto mt-4 max-w-md text-base opacity-75 sm:text-lg">{content.message}</p>

        {!isLoading && process.env.NODE_ENV !== "production" && error?.message && (
          <details className="mt-5 text-left text-xs opacity-60">
            <summary className="cursor-pointer">Technical details</summary>
            <pre className="mt-2 max-h-32 overflow-auto whitespace-pre-wrap">{error.message}</pre>
          </details>
        )}

        {!isLoading && (
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            {reset && <button type="button" onClick={reset} className="status-button status-button--primary">{language.retry}</button>}
            <Link href={homeHref} className="status-button status-button--secondary">{language.home}</Link>
          </div>
        )}
      </section>
    </main>
  );
}
