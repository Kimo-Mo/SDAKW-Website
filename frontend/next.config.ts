import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  async rewrites() {
    const backendTarget =
      process.env.BACKEND_API_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      'http://localhost:5000/api/v1';

    return [
      {
        source: '/api/v1/:path*',
        destination: `${backendTarget.replace(/\/+$/, '')}/:path*`,
      },
    ];
  },
};

// Registers src/i18n/request.ts with next-intl. Locale negotiation/redirects
// are handled separately in src/middleware.ts.
const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);