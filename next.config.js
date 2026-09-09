/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    formats: ["image/avif", "image/webp"],
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
  
};

export default nextConfig;
