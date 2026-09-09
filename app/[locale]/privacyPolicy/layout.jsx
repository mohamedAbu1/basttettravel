import { createLocalizedMetadata } from "@/lib/seo/site";

export const generateMetadata = createLocalizedMetadata("privacy", "/privacyPolicy");

export default function PrivacyPolicyLayout({ children }) {
  return children;
}
