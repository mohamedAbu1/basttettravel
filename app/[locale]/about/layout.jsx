import { createLocalizedMetadata } from "@/lib/seo/site";

export const generateMetadata = createLocalizedMetadata("about", "/about");

export default function AboutLayout({ children }) {
  return children;
}
