import type { MetadataRoute } from 'next';
import { getSiteUrl } from '@/lib/seo';

export const revalidate = 3600; // Hourly ISR for sitemap generation

interface DynamicSitemapRecord {
  slug: string;
  updatedAt?: string;
  createdAt?: string;
}

/**
 * Safely fetches all published items with timeout and graceful error recovery.
 */
async function fetchDynamicPublishedItems(
  resource: 'projects' | 'products'
): Promise<DynamicSitemapRecord[]> {
  const backendBase = (
    process.env.BACKEND_API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    'http://localhost:5000/api/v1'
  ).replace(/\/+$/, '');

  const items: DynamicSitemapRecord[] = [];
  let page = 1;
  let totalPages = 1;
  const maxPages = 20; // Guard against infinite pagination; covers up to 1,000 items

  while (page <= totalPages && page <= maxPages) {
    const url = `${backendBase}/${resource}?page=${page}&limit=50`;
    const response = await fetch(url, {
      next: { revalidate: 3600 },
      signal: AbortSignal.timeout(8000),
      headers: {
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      console.warn(
        `[sitemap] Backend responded with status ${response.status} for ${resource} (page ${page})`
      );
      break;
    }

    const payload = (await response.json()) as {
      success?: boolean;
      data?: {
        [key: string]: unknown;
        pagination?: {
          totalPages?: number;
        };
      };
    };

    const rawList = payload.data?.[resource];
    if (!Array.isArray(rawList) || rawList.length === 0) {
      break;
    }

    for (const record of rawList) {
      const item = record as {
        slug?: unknown;
        published?: unknown;
        updatedAt?: unknown;
        createdAt?: unknown;
      };

      if (
        typeof item.slug === 'string' &&
        item.slug.trim().length > 0 &&
        item.published !== false
      ) {
        items.push({
          slug: item.slug.trim(),
          updatedAt: typeof item.updatedAt === 'string' ? item.updatedAt : undefined,
          createdAt: typeof item.createdAt === 'string' ? item.createdAt : undefined,
        });
      }
    }

    totalPages = payload.data?.pagination?.totalPages ?? 1;
    page += 1;
  }

  return items;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = getSiteUrl();
  const staticLastModified = new Date();

  // 1. Static Routes Configuration
  const staticRouteConfigs: Array<{
    path: string;
    priority: number;
    changeFrequency: 'weekly' | 'monthly';
  }> = [
    { path: '', priority: 1.0, changeFrequency: 'weekly' }, // Home
    { path: '/projects', priority: 0.9, changeFrequency: 'weekly' }, // Projects listing
    { path: '/products', priority: 0.9, changeFrequency: 'weekly' }, // Products listing
    { path: '/about', priority: 0.7, changeFrequency: 'monthly' }, // About Us
    { path: '/contact', priority: 0.7, changeFrequency: 'monthly' }, // Contact Us
  ];

  const entries: MetadataRoute.Sitemap = [];

  // Generate dual-locale static entries
  for (const route of staticRouteConfigs) {
    const arUrl = `${siteUrl}/ar${route.path}`;
    const enUrl = `${siteUrl}/en${route.path}`;
    const alternates = {
      languages: {
        ar: arUrl,
        en: enUrl,
        'x-default': arUrl,
      },
    };

    // Arabic canonical entry
    entries.push({
      url: arUrl,
      lastModified: staticLastModified,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
      alternates,
    });

    // English canonical entry
    entries.push({
      url: enUrl,
      lastModified: staticLastModified,
      changeFrequency: route.changeFrequency,
      priority: route.priority,
      alternates,
    });
  }

  // 2. Dynamic Routes (Projects & Products) with fault tolerance
  let publishedProjects: DynamicSitemapRecord[] = [];
  let publishedProducts: DynamicSitemapRecord[] = [];

  try {
    publishedProjects = await fetchDynamicPublishedItems('projects');
  } catch (error) {
    console.warn(
      '[sitemap] Gracefully caught projects fetch failure during sitemap generation:',
      error
    );
  }

  try {
    publishedProducts = await fetchDynamicPublishedItems('products');
  } catch (error) {
    console.warn(
      '[sitemap] Gracefully caught products fetch failure during sitemap generation:',
      error
    );
  }

  // Generate dynamic project detail entries (priority: 0.8, changeFrequency: 'monthly')
  for (const project of publishedProjects) {
    const lastModified = project.updatedAt
      ? new Date(project.updatedAt)
      : project.createdAt
        ? new Date(project.createdAt)
        : staticLastModified;

    const arUrl = `${siteUrl}/ar/projects/${project.slug}`;
    const enUrl = `${siteUrl}/en/projects/${project.slug}`;
    const alternates = {
      languages: {
        ar: arUrl,
        en: enUrl,
        'x-default': arUrl,
      },
    };

    entries.push({
      url: arUrl,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
      alternates,
    });

    entries.push({
      url: enUrl,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
      alternates,
    });
  }

  // Generate dynamic product detail entries (priority: 0.8, changeFrequency: 'monthly')
  for (const product of publishedProducts) {
    const lastModified = product.updatedAt
      ? new Date(product.updatedAt)
      : product.createdAt
        ? new Date(product.createdAt)
        : staticLastModified;

    const arUrl = `${siteUrl}/ar/products/${product.slug}`;
    const enUrl = `${siteUrl}/en/products/${product.slug}`;
    const alternates = {
      languages: {
        ar: arUrl,
        en: enUrl,
        'x-default': arUrl,
      },
    };

    entries.push({
      url: arUrl,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
      alternates,
    });

    entries.push({
      url: enUrl,
      lastModified,
      changeFrequency: 'monthly',
      priority: 0.8,
      alternates,
    });
  }

  return entries;
}
