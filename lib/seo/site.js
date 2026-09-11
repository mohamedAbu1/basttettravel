import { homeMetadata } from "@/lib/metadata/home";
import { aboutMetadata } from "@/lib/metadata/about";
import { contactMetadata } from "@/lib/metadata/contact";
import { tripsMetadata } from "@/lib/metadata/trips";

/**
 * Central SEO configuration. Keeping URLs, locales and social profiles here
 * prevents page metadata from drifting or being copied with small mistakes.
 */
export const siteConfig = {
  name: "Basttet Travel",
  url: "https://basttettravel.com",
  defaultLocale: "en",
  locales: ["en", "es", "fr", "de", "it", "zh"],
  logo: "/HomePageImage/Copilot_20260613_134550.webp",
  ogImage: "/HomePageImage/Copilot_20260613_134550.webp",
  socialProfiles: [
    "https://www.facebook.com/profile.php?id=61591222981163",
    "https://www.instagram.com/ismailharoun225/",
    "https://www.tripadvisor.com/UserReviewEdit-g294205-d34512222-Basttet_Travel-Luxor_Nile_River_Valley.html",
  ],
};

const pageMetadata = {
  home: homeMetadata,
  about: aboutMetadata,
  contact: contactMetadata,
  trips: tripsMetadata,
  privacy: {
    en: {
      title: "Privacy Policy | Basttet Travel",
      description: "Read how Basttet Travel collects, uses and protects visitor and booking information.",
      keywords: "Basttet Travel privacy policy, Egypt travel data protection",
    },
  },
  cancellation: {
    en: {
      title: "Cancellation Policy | Basttet Travel",
      description: "Review Basttet Travel booking cancellation, refund and change policies before you reserve.",
      keywords: "Basttet Travel cancellation policy, Egypt tour refund policy",
    },
  },
};

const fallbackMetadata = {
  title: "Basttet Travel | Luxury Egypt Tours",
  description:
    "Explore Egypt with Basttet Travel: private Luxor and Aswan tours, Nile cruises, temple visits, desert adventures and personalized trips across Egypt.",
  keywords:
    "Egypt tours, Luxor tours, Aswan tours, Nile cruises, Luxor and Aswan itinerary, Egypt travel agency, private Egypt tours, desert safari Egypt",
};

/** Return localized copy while safely falling back to English. */
export function getPageCopy(page, locale = siteConfig.defaultLocale) {
  return pageMetadata[page]?.[locale] || pageMetadata[page]?.en || fallbackMetadata;
}

/** Build canonical, Open Graph and alternate-language metadata consistently. */
export function buildMetadata({ page = "home", locale = "en", path = "" } = {}) {
  const copy = getPageCopy(page, locale);
  const canonical = `${siteConfig.url}/${locale}${path}`.replace(/\/$/, "") || siteConfig.url;
  const imageUrl = `${siteConfig.url}${siteConfig.ogImage}`;

  return {
    metadataBase: new URL(siteConfig.url),
    title: copy.title,
    description: copy.description,
    keywords: copy.keywords,
      alternates: {
      canonical,
      languages: Object.fromEntries(
        [
          ...siteConfig.locales.map((language) => [
          language,
          `${siteConfig.url}/${language}${path}`,
          ]),
          ["x-default", `${siteConfig.url}/en${path}`],
        ],
      ),
    },
    openGraph: {
      type: "website",
      siteName: siteConfig.name,
      title: copy.title,
      description: copy.description,
      url: canonical,
      locale,
      images: [{ url: imageUrl, width: 1200, height: 630, alt: siteConfig.name }],
    },
    twitter: {
      card: "summary_large_image",
      title: copy.title,
      description: copy.description,
      images: [imageUrl],
    },
    robots: { index: true, follow: true },
  };
}

/** Factory used by route layouts so localized metadata follows one code path. */
export function createLocalizedMetadata(page, path) {
  return async function localizedMetadata({ params }) {
    const { locale } = await params;
    const safeLocale = siteConfig.locales.includes(locale)
      ? locale
      : siteConfig.defaultLocale;

    return buildMetadata({ page, locale: safeLocale, path });
  };
}

export const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "TravelAgency",
  name: siteConfig.name,
  url: siteConfig.url,
  logo: `${siteConfig.url}${siteConfig.logo}`,
  image: `${siteConfig.url}${siteConfig.ogImage}`,
  description: fallbackMetadata.description,
  priceRange: "$$",
  areaServed: [
    { "@type": "City", name: "Luxor" },
    { "@type": "City", name: "Aswan" },
    { "@type": "Country", name: "Egypt" },
  ],
  knowsAbout: [
    "Luxor tours",
    "Aswan tours",
    "Nile cruises",
    "Egyptian temples",
    "Egypt desert safaris",
  ],
  address: {
    "@type": "PostalAddress",
    addressLocality: "Luxor",
    addressCountry: "EG",
  },
  contactPoint: {
    "@type": "ContactPoint",
    telephone: "+20 1100507802",
    contactType: "customer service",
    areaServed: "EG",
  },
  sameAs: siteConfig.socialProfiles,
};

export const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: siteConfig.name,
  url: siteConfig.url,
  inLanguage: siteConfig.locales,
  potentialAction: {
    "@type": "SearchAction",
    target: `${siteConfig.url}/en/trips?search={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};
