// app/layout.tsx
import "./style/globals.css";

import Providers from "./providers";
export const metadata = {
  title: "Basttet Travel",
  description: "Luxury Egypt tours with Basttet Travel – Nile cruises, desert adventures, and curated journeys.",
  keywords: "Egypt tours, Luxor trips, Nile cruises, desert adventures",
  openGraph: {
    title: "Basttet Travel",
    description: "Luxury Egypt tours with Basttet Travel",
    url: "https://basttettravel.com/",
    images: ["/images/hero.jpg"],
  },
};
export default function RootLayout({ children }) {
  
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
