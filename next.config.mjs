/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Jika kamu menggunakan image dari domain luar (seperti logo/supabase)
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
};

export default nextConfig;
