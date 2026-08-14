import { hasLocale } from 'next-intl';
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server';
import { Inter, Noto_Sans_Arabic } from 'next/font/google';
import { notFound } from 'next/navigation';

import { Providers } from './providers';
import { getLocaleDirection, routing } from '@/i18n/routing';
import '@/styles/globals.css';

// Inter covers Latin; Noto Sans Arabic covers Arabic glyphs (Inter itself
// has NO Arabic support). Both variable fonts are applied to <html> always,
// and globals.css picks the active one from the `lang` attribute —
// so headings, body copy and components follow the active locale.
const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
});

const notoSansArabic = Noto_Sans_Arabic({
  variable: '--font-arabic',
  subsets: ['arabic'],
});

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata({ params }: LayoutProps<'/[locale]'>) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });

  return {
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
      lang={locale}
      dir={getLocaleDirection(locale)}
      className={`${inter.variable} ${notoSansArabic.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Providers messages={messages} locale={locale}>
          {children}
        </Providers>
      </body>
    </html>
  );
}
