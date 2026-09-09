import { createLocalizedMetadata } from "@/lib/seo/site";

export const generateMetadata = createLocalizedMetadata("trips", "/trips");

export default function TripsLayout({ children }) {
  return children;
}
