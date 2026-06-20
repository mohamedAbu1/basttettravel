import "./style/globals.css";
import Providers from "./providers";
import Script from "next/script";

export const metadata = {
  title: "Basttet Travel",
  description: "Luxury Egypt tours with Basttet Travel – Nile cruises, desert adventures, and curated journeys.",
  keywords: "Egypt tours, Luxor trips, Nile cruises, desert adventures",
  openGraph: {
    title: "Basttet Travel",
    description: "Luxury Egypt tours with Basttet Travel",
    url: "https://basttettravel.com/",
    images: ["/images/hero.webp"], // ✅ تحويل الصورة إلى WebP
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* ✅ Google Analytics باستخدام next/script */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-GXM9KRNJHH"
          strategy="afterInteractive"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-GXM9KRNJHH');
            `,
          }}
        />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
