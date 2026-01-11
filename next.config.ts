import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost', // للتطوير المحلي
      },
      {
        protocol: 'https',
        hostname: 'sukoon-perfumes.com', // 👈 ضع رابط موقعك الحقيقي هنا
      },
      {
        protocol: 'https',
        hostname: 'api.sukoon-perfumes.com', // 👈 ورابط الـ API لو مختلف
      },
      {
         protocol: 'https',
         hostname: 'images.unsplash.com',
      }
    ],
  },
};

export default nextConfig;
