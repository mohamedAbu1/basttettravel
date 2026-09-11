import { siteConfig } from "@/lib/seo/site";
import { connectDB } from "@/lib/db";

// Generate this at request time so a temporary database outage never blocks a
// production build or the static pages of the site.
export const dynamic = "force-dynamic";
export const revalidate = 3600;

/**
 * Generates the XML sitemap from the same locale list used by metadata.
 * Dynamic trip IDs are intentionally omitted because they come from the database.
 */
export default async function sitemap() {
  const paths = ["", "/about", "/trips", "/contact", "/privacyPolicy", "/cancellationPolicy"];
  let tripIds = [];

  try {
    const db = await connectDB();
    const [rows] = await db.query("SELECT id, updated_at FROM trips");
    tripIds = rows.map((trip) => ({ id: trip.id, updatedAt: trip.updated_at }));
  } catch (error) {
    // Keep the core sitemap available even if the database is temporarily down.
    console.error("Unable to load trip URLs for sitemap:", error?.message);
  }

  const staticUrls = siteConfig.locales.flatMap((locale) =>
    paths.map((path) => ({
      url: `${siteConfig.url}/${locale}${path}`,
      changeFrequency: path === "/trips" ? "daily" : "weekly",
      priority: path === "" ? 1 : 0.7,
    })),
  );

  const tripUrls = siteConfig.locales.flatMap((locale) =>
    tripIds.map((trip) => ({
      url: `${siteConfig.url}/${locale}/trips/${trip.id}`,
      lastModified: trip.updatedAt || new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    })),
  );

  return [...staticUrls, ...tripUrls];
}
