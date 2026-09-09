import { createLocalizedMetadata } from "@/lib/seo/site";

export const generateMetadata = createLocalizedMetadata("home", "");

export default function LocaleLayout({ children }) {
  return children;
}
