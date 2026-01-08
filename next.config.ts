import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,

  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '', // اتركها فارغة للسماح بأي بورت، أو حدد بورت الباك إند (مثلاً '4000')
        pathname: '/**', // السماح بتحميل الصور من أي مسار
      },
    ],
  }
};

export default nextConfig;
