import { siteConfig } from "@/lib/seo/site";

/**
 * Generates the XML sitemap from the same locale list used by metadata.
 * Dynamic trip IDs are intentionally omitted because they come from the database.
 */
export default function sitemap() {
  const paths = ["", "/about", "/trips", "/contact", "/privacyPolicy", "/cancellationPolicy"];

  return siteConfig.locales.flatMap((locale) =>
    paths.map((path) => ({
      url: `${siteConfig.url}/${locale}${path}`,
      changeFrequency: path === "/trips" ? "daily" : "weekly",
      priority: path === "" ? 1 : 0.7,
    })),
  );
}
