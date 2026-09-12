import { createLocalizedMetadata } from "@/lib/seo/site";
import LocaleDocumentSettings from "@/components/layout/LocaleDocumentSettings";

export const generateMetadata = createLocalizedMetadata("home", "");

export default function LocaleLayout({ children }) {
  return <><LocaleDocumentSettings />{children}</>;
}
