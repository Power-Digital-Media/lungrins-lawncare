import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  trailingSlash: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    qualities: [50, 60, 75],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'checkinsandreviews.s3.us-east-2.amazonaws.com',
        pathname: '/**',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/admin/",
        destination: "/admin/drop-pin/",
        permanent: true,
      },
      {
        source: "/admin/pin-drop/",
        destination: "/admin/drop-pin/",
        permanent: true,
      }
    ];
  }
};

export default nextConfig;
