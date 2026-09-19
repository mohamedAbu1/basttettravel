import "./style/globals.css";
import { headers } from "next/headers";
import Script from "next/script";
import Providers from "./providers";
import { organizationSchema, siteConfig, websiteSchema } from "@/lib/seo/site";

export const metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: "Basttet Travel | Luxury Egypt Tours", template: "%s | Basttet Travel" },
  description: "Plan private Egypt tours in Luxor, Aswan and beyond with Basttet Travel — curated Nile cruises, temple visits, desert adventures and local support.",
  icons: {
    icon: "/brand/basttet-travel-mark-light.svg",
    apple: "/brand/basttet-travel-mark-light.svg",
  },
};

export default async function RootLayout({ children }) {
  const requestHeaders = await headers();
  const locale = requestHeaders.get("x-locale") || "en";
  const direction = locale === "ar" ? "rtl" : "ltr";
  return (
    <html lang={locale} dir={direction} suppressHydrationWarning>
      <head>
        {/* Structured data is kept once at the root so every page describes the same agency. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@graph": [organizationSchema, websiteSchema],
            }),
          }}
        />
        {/* Analytics is intentionally deferred until the page is idle so it
            cannot compete with the hero image and critical CSS. */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-GXM9KRNJHH"
          strategy="lazyOnload"
        />
        <Script
          id="google-analytics"
          strategy="lazyOnload"
        >{`
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-GXM9KRNJHH');
            `}</Script>
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
