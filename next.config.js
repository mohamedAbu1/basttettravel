/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Production hosts may install with NODE_ENV=production and omit devDependencies.
  // Lint still runs in CI via `npm run lint`, but should not block deployment builds.
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [60, 75, 85],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "basttettravel.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "zxpcoubskncdsruearze.supabase.co",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "lkwlrezhuxercfvtjiiw.supabase.co",
        pathname: "/**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "SAMEORIGIN" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
          ...(process.env.NODE_ENV === "production"
            ? [{ key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" }]
            : []),
        ],
      },
    ];
  },
};

export default nextConfig;
