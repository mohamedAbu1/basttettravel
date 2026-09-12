import "./style/globals.css";
import { headers } from "next/headers";
import Providers from "./providers";
import { organizationSchema, siteConfig, websiteSchema } from "@/lib/seo/site";

export const metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: "Basttet Travel | Luxury Egypt Tours", template: "%s | Basttet Travel" },
  description: "Discover luxury Nile cruises, desert adventures and unforgettable Egypt tours with Basttet Travel.",
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
        {/* Google Analytics is loaded asynchronously after parsing. */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-GXM9KRNJHH" />
        <script
          id="google-analytics"
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
