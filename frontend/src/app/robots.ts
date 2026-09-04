import type { MetadataRoute } from 'next';
import { getSiteUrl } from '@/lib/seo';

/**
 * Generates production-grade /robots.txt metadata route.
 * Disallows search engine crawlers from indexing administrative, authentication,
 * and internal API routes while permitting public pages and pointing to the sitemap.
 */
export default function robots(): MetadataRoute.Robots {
  const siteUrl = getSiteUrl();

  return {
    rules: [
      {
        userAgent: '*',
        allow: [
          '/',
          '/*/about',
          '/*/contact',
          '/*/projects',
          '/*/projects/*',
          '/*/products',
          '/*/products/*',
        ],
        disallow: [
          '/admin',
          '/admin/*',
          '/*/admin',
          '/*/admin/*',
          '/login',
          '/*/login',
          '/api/*',
        ],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
