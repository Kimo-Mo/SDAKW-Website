import { Globe, LogIn } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

import { buttonVariants } from '@/components/ui/button';
import { Link } from '@/i18n/navigation';
import { getAlternateLocale, type Locale } from '@/i18n/routing';

interface RootPageProps {
  params: Promise<{ locale: string }>;
}

export default async function RootPlaceholderPage({ params }: RootPageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale });
  const alternateLocale = getAlternateLocale(locale as Locale);

  return (
    <main className="flex min-h-screen w-full flex-col items-center justify-center p-6 text-center bg-background">
      <div className="flex w-full max-w-sm flex-col items-center gap-6 rounded-2xl border border-border bg-card p-8 shadow-xs">
        {/* Company / Project Title */}
        <div className="flex flex-col items-center gap-2">
          <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            {t('placeholder.title')}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground">
            {t('placeholder.subtitle')}
          </p>
        </div>

        {/* Actions */}
        <div className="flex w-full flex-col items-center gap-3">
          {/* Admin Login Link */}
          <Link
            href="/login"
            className={buttonVariants({
              className: 'w-full h-10 gap-2 font-medium',
            })}>
            <LogIn className="h-4 w-4" />
            <span>{t('placeholder.adminLogin')}</span>
          </Link>

          {/* Language Switcher */}
          <Link
            href="/"
            locale={alternateLocale}
            className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-border px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
            <Globe className="h-3.5 w-3.5" />
            <span>{t('placeholder.switchLocale')}</span>
          </Link>
        </div>
      </div>
    </main>
  );
}
