import "./style/globals.css";
import Providers from "./providers";
import Script from "next/script";

export const metadata = {
  title: "Basttet Travel | Luxury Egypt Tours",
  description: "Luxury Egypt tours with Basttet Travel – Nile cruises, desert adventures, and curated journeys.",
  keywords: "Egypt tours, Luxor trips, Nile cruises, desert adventures",
  openGraph: {
    title: "Basttet Travel | Luxury Egypt Tours",
    description: "Luxury Egypt tours with Basttet Travel – Nile cruises, desert adventures, and curated journeys.",
    url: "https://basttettravel.com/",
    images: ["https://basttettravel.com/iamges/Dahabeya-program-SOBEK-900x600.webp"],
  },
  twitter: {
    card: "summary_large_image",
    title: "Basttet Travel | Luxury Egypt Tours",
    description: "Luxury Egypt tours with Basttet Travel – Nile cruises, desert adventures, and curated journeys.",
    images: ["https://basttettravel.com/iamges/Copilot_20260613_134550.webp"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* ✅ Canonical */}
        <link rel="canonical" href="https://basttettravel.com/" />

        {/* ✅ Open Graph */}
        <meta property="og:title" content="Basttet Travel | Luxury Egypt Tours" />
        <meta property="og:description" content="Luxury Egypt tours with Basttet Travel – Nile cruises, desert adventures, and curated journeys." />
        <meta property="og:image" content="https://basttettravel.com/iamges/Dahabeya-program-SOBEK-900x600.webp" />
        <meta property="og:url" content="https://basttettravel.com/" />

        {/* ✅ Twitter Cards */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Basttet Travel | Luxury Egypt Tours" />
        <meta name="twitter:description" content="Luxury Egypt tours with Basttet Travel – Nile cruises, desert adventures, and curated journeys." />
        <meta name="twitter:image" content="https://basttettravel.com/iamges/Copilot_20260613_134550.webp" />

        {/* ✅ Structured Data */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "TravelAgency",
            "name": "Basttet Travel",
            "url": "https://basttettravel.com",
            "logo": "https://basttettravel.com/iamges/Copilot_20260613_134550.webp",
            "image": [
              "https://basttettravel.com/iamges/pexels-axp-photography-500641970-18991592.webp",
              "https://basttettravel.com/iamges/Dahabeya-program-SOBEK-900x600.webp"
            ],
            "description": "Luxury Egypt tours with Basttet Travel – Nile cruises, desert adventures, and curated journeys.",
            "address": {
              "@type": "PostalAddress",
              "streetAddress": "Luxor, Egypt",
              "addressCountry": "EG"
            },
            "contactPoint": {
              "@type": "ContactPoint",
              "telephone": "+20 1100507802",
              "contactType": "customer service",
              "areaServed": "EG"
            },
            "sameAs": [
              "https://www.facebook.com/profile.php?id=61591222981163",
              "https://www.instagram.com/ismailharoun225/",
              "https://www.tripadvisor.com/UserReviewEdit-g294205-d34512222-Basttet_Travel-Luxor_Nile_River_Valley.html"
            ]
          })
        }} />

        {/* ✅ Google Analytics */}
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
