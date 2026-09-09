import "./style/globals.css";
import Providers from "./providers";
import { organizationSchema, siteConfig } from "@/lib/seo/site";

export const metadata = {
  metadataBase: new URL(siteConfig.url),
  title: { default: "Basttet Travel | Luxury Egypt Tours", template: "%s | Basttet Travel" },
  description: "Discover luxury Nile cruises, desert adventures and unforgettable Egypt tours with Basttet Travel.",
  icons: { icon: "/favicon.ico" },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Structured data is kept once at the root so every page describes the same agency. */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationSchema),
        }} />
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
