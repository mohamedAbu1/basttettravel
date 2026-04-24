/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "dxpbyrcbklqrjlytmkum.supabase.co", // أضف دومين Supabase هنا
      "pqeliprhapbghcczgyru.supabase.co", // لو عندك أكثر من bucket
    ],
  },
};

export default nextConfig;
