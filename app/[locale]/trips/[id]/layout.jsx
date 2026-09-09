import { buildMetadata, siteConfig } from "@/lib/seo/site";

export async function generateMetadata({ params }) {
  const { locale, id } = await params;
  const safeLocale = siteConfig.locales.includes(locale) ? locale : siteConfig.defaultLocale;
  const base = buildMetadata({ page: "trips", locale: safeLocale, path: `/trips/${id}` });

  return {
    ...base,
    title: `${base.title} | Egypt Tour Details`,
    description: `View itinerary, inclusions, schedule and booking details for this Egypt tour with Basttet Travel.`,
  };
}

export default function TripDetailsLayout({ children }) {
  return children;
}
