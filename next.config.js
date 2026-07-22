/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "zxpcoubskncdsruearze.supabase.co",
      "lkwlrezhuxercfvtjiiw.supabase.co",
      "basttettravel.com",
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "basttettravel.com",
        pathname: "/images/**",
      },
    ],
  },
  
};

export default nextConfig;
