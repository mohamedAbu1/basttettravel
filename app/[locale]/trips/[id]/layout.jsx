import { buildMetadata, siteConfig } from "@/lib/seo/site";

export async function generateMetadata({ params }) {
  const { locale, id } = await params;
  const safeLocale = siteConfig.locales.includes(locale) ? locale : siteConfig.defaultLocale;
  const base = buildMetadata({ page: "trips", locale: safeLocale, path: `/trips/${id}` });

  return {
    ...base,
    title: `${base.title} | Egypt Tour Details`,
    description: `View the itinerary, inclusions, schedule, price and booking details for this Egypt tour in Luxor, Aswan and the Nile Valley with Basttet Travel.`,
  };
}

export default function TripDetailsLayout({ children }) {
  return children;
}
