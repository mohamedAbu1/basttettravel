import { createLocalizedMetadata } from "@/lib/seo/site";

export const generateMetadata = createLocalizedMetadata("cancellation", "/cancellationPolicy");

export default function CancellationPolicyLayout({ children }) {
  return children;
}
