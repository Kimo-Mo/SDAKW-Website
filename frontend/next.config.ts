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
};

// Registers src/i18n/request.ts with next-intl. Locale negotiation/redirects
// are handled separately in src/middleware.ts.
const withNextIntl = createNextIntlPlugin();

export default withNextIntl(nextConfig);