import { hasLocale } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { IBM_Plex_Sans_Arabic, IBM_Plex_Mono } from 'next/font/google';
import { notFound } from 'next/navigation';

import { Providers } from './providers';
import { getLocaleDirection, routing } from '@/i18n/routing';
import '@/styles/globals.css';

// IBM Plex Sans Arabic covers both Arabic and Latin glyphs with harmonized modernist architectural geometry.
const ibmPlexSansArabic = IBM_Plex_Sans_Arabic({
  variable: '--font-sans',
  subsets: ['arabic', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
});

// IBM Plex Mono covers utility labels, dates, project codes, and metadata captions.
const ibmPlexMono = IBM_Plex_Mono({
  variable: '--font-mono',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  display: 'swap',
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LayoutProps<'/[locale]'>) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://sdakw.com';

  return {
    metadataBase: new URL(appUrl),
    title: t('title'),
    description: t('description'),
  };
}

export default async function LocaleLayout({ children, params }: LayoutProps<'/[locale]'>) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    notFound();
  }

  // Enables static rendering for this locale (see next-intl docs on
  // `setRequestLocale` + `generateStaticParams`).
  setRequestLocale(locale);

  const messages = await getMessages();

  return (
    <html
      data-scroll-behavior="smooth"
      lang={locale}
      suppressHydrationWarning
      dir={getLocaleDirection(locale)}
      className={`${ibmPlexSansArabic.variable} ${ibmPlexMono.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Providers messages={messages} locale={locale}>
          {children}
        </Providers>
      </body>
    </html>
  );
}
