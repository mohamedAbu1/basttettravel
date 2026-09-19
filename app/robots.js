import { siteConfig } from "@/lib/seo/site";

// robots.txt is independent from the database. Keep it static and cacheable so
// crawlers never wait for application providers or a cold database connection.
export const dynamic = "force-static";
export const revalidate = 86400;

export default function robots() {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin", "/api/"] }],
    sitemap: siteConfig.url + "/sitemap.xml",
    host: siteConfig.url,
  };
}
