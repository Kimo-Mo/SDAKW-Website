/**
 * Centralized SEO Utilities & Configuration for SDAKW Frontend
 * Ensures consistent canonical URLs, hreflang alternates, OpenGraph attributes,
 * and text sanitization across Next.js App Router bilingual routes.
 */

export const DEFAULT_SITE_URL = 'https://sdakw.com';

/**
 * Returns the normalized canonical base URL for the site without trailing slashes.
 * Priority: NEXT_PUBLIC_SITE_URL -> NEXT_PUBLIC_APP_URL -> 'https://sdakw.com'
 */
export function getSiteUrl(): string {
  const url =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXT_PUBLIC_APP_URL ||
    DEFAULT_SITE_URL;
  return url.trim().replace(/\/+$/, '');
}

export const BRAND_NAMES = {
  ar: 'شركة سالم دويح العجمي للمقاولات العامة والتجارة',
  en: 'Salem Duwaih Al-Ajmi Co.',
} as const;

export const TITLE_TEMPLATES = {
  ar: '%s | شركة سالم دويح العجمي للمقاولات العامة والتجارة',
  en: '%s | Salem Duwaih Al-Ajmi Co.',
} as const;

export type SupportedLocale = 'ar' | 'en';

/**
 * Resolves OpenGraph locale identifiers (e.g., ar_KW, en_US).
 */
export function getOgLocale(locale: string): string {
  return locale === 'ar' ? 'ar_KW' : 'en_US';
}

/**
 * Resolves alternate OpenGraph locale identifiers.
 */
export function getAlternateOgLocale(locale: string): string {
  return locale === 'ar' ? 'en_US' : 'ar_KW';
}

/**
 * Creates standardized alternates object with canonical and hreflang definitions.
 * Mappings include 'ar', 'en', and 'x-default' strictly mapped to Arabic.
 *
 * @param path Relative route path, e.g. '/about', '/projects/tower', or ''
 * @param currentLocale Current active locale ('ar' | 'en')
 */
export function createAlternates(path = '', currentLocale = 'ar') {
  const siteUrl = getSiteUrl();
  const normalizedPath = path ? (path.startsWith('/') ? path : `/${path}`) : '';
  const sanitizedPath = normalizedPath === '/' ? '' : normalizedPath;

  return {
    canonical: `${siteUrl}/${currentLocale}${sanitizedPath}`,
    languages: {
      ar: `${siteUrl}/ar${sanitizedPath}`,
      en: `${siteUrl}/en${sanitizedPath}`,
      'x-default': `${siteUrl}/ar${sanitizedPath}`,
    },
  };
}

/**
 * Strips HTML, Markdown tokens, collapses extra whitespace, and safely truncates text.
 */
export function cleanDescription(text?: string | null, maxLength = 160): string {
  if (!text) return '';

  const cleaned = text
    .replace(/<[^>]*>/g, '') // remove HTML tags
    .replace(/[[\]()#*_~`>-]/g, '') // strip common markdown symbols
    .replace(/\s+/g, ' ') // collapse multi-spaces and newlines
    .trim();

  if (cleaned.length <= maxLength) {
    return cleaned;
  }

  // Truncate cleanly without cutting off mid-word if possible
  const truncated = cleaned.slice(0, maxLength - 1);
  const lastSpace = truncated.lastIndexOf(' ');
  const safeEnd = lastSpace > maxLength * 0.7 ? lastSpace : maxLength - 1;

  return `${truncated.slice(0, safeEnd).trim()}…`;
}

/**
 * Formats a localized array or string into a clean comma-separated string.
 */
export function formatLocalizedList(value?: string[] | string | null): string {
  if (!value) return '';
  if (Array.isArray(value)) {
    return value
      .map((item) => (typeof item === 'string' ? item.trim() : ''))
      .filter(Boolean)
      .join(', ');
  }
  return typeof value === 'string' ? value.trim() : String(value);
}
