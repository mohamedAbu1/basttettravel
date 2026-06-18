/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      "dxpbyrcbklqrjlytmkum.supabase.co",
      "bsrlydzntfpuyxcqwjpl.supabase.co",
    ],
  },
  output: 'export', // علشان تعمل static export
};

module.exports = nextConfig;
