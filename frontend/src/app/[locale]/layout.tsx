import type { Metadata } from 'next';
import { hasLocale } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { IBM_Plex_Sans_Arabic, IBM_Plex_Mono } from 'next/font/google';
import { notFound } from 'next/navigation';

import { Providers } from './providers';
import { getLocaleDirection, routing } from '@/i18n/routing';
import {
  BRAND_NAMES,
  TITLE_TEMPLATES,
  createAlternates,
  getAlternateOgLocale,
  getOgLocale,
  getSiteUrl,
} from '@/lib/seo';
import '@/styles/globals.css';

// IBM Plex Sans Arabic covers both Arabic and Latin glyphs with harmonized modernist architectural geometry.
const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  variable: '--font-sans',
  subsets: ['arabic', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
  preload: true,
});

// IBM Plex Mono covers utility labels, dates, project codes, and metadata captions.
const ibmPlexMono = IBM_Plex_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
  preload: true,
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

interface LocaleLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: LocaleLayoutProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });

  const siteUrl = getSiteUrl();
  const isArabic = locale === 'ar';
  const siteName = isArabic ? BRAND_NAMES.ar : BRAND_NAMES.en;
  const titleTemplate = isArabic ? TITLE_TEMPLATES.ar : TITLE_TEMPLATES.en;
  const defaultTitle = t('title');
  const description = t('description');
  const alternates = createAlternates('', locale);

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: defaultTitle,
      template: titleTemplate,
    },
    description,
    applicationName: siteName,
    alternates,
    openGraph: {
      siteName,
      type: 'website',
      locale: getOgLocale(locale),
      alternateLocale: [getAlternateOgLocale(locale)],
      title: {
        default: defaultTitle,
        template: titleTemplate,
      },
      description,
      url: alternates.canonical,
      images: [
        {
          url: '/images/og-share-card.svg',
          width: 1200,
          height: 630,
          alt: siteName,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: {
        default: defaultTitle,
        template: titleTemplate,
      },
      description,
      images: ['/images/og-share-card.svg'],
    },
  };
}

function getApiOrigin(): string | null {
  const target = process.env.BACKEND_API_URL;
  if (!target) return null;
  try {
    const parsed = new URL(target);
    return parsed.protocol.startsWith('http') ? parsed.origin : null;
  } catch {
    return null;
  }
}

export default async function LocaleLayout({ children, params }: LocaleLayoutProps) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Enables static rendering for this locale (see next-intl docs on
  // `setRequestLocale` + `generateStaticParams`).
  setRequestLocale(locale);

  const messages = await getMessages();
  const apiOrigin = getApiOrigin();

  return (
    <html
      data-scroll-behavior="smooth"
      lang={locale}
      suppressHydrationWarning
      dir={getLocaleDirection(locale)}
      className={`${ibmPlexSansArabic.variable} ${ibmPlexMono.variable} h-full antialiased`}>
      <head>
        {/* Preconnect to Cloudinary CDN to minimize image handshake latency */}
        <link rel="preconnect" href="https://res.cloudinary.com" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://res.cloudinary.com" />
        {/* Preconnect to backend API host in non-local environments */}
        {apiOrigin && !apiOrigin.includes('localhost') && (
          <>
            <link rel="preconnect" href={apiOrigin} crossOrigin="use-credentials" />
            <link rel="dns-prefetch" href={apiOrigin} />
          </>
        )}
      </head>
      <body className="min-h-full flex flex-col">
        <Providers messages={messages} locale={locale}>
          {children}
        </Providers>
      </body>
    </html>
  );
}
