import { createLocalizedMetadata } from "@/lib/seo/site";

export const generateMetadata = createLocalizedMetadata("contact", "/contact");

export default function ContactLayout({ children }) {
  return children;
}
