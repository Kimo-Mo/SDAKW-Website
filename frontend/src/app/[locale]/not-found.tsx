'use client';

import { useLocale, useTranslations } from 'next-intl';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { PublicShell } from '@/components/public/layouts/public-shell';

export default function NotFound() {
  const t = useTranslations('notFound');
  const locale = useLocale();

  return (
    <PublicShell locale={locale}>
      <div className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center my-auto min-h-[50vh]">
        <p className="text-sm font-semibold tracking-wider uppercase text-primary">404</p>
        <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground">
          {t('title')}
        </h1>
        <p className="max-w-md text-sm/relaxed text-muted-foreground">{t('description')}</p>
        <Link href="/">
          <Button className="mt-4 rounded-xl px-6 font-medium shadow-xs">{t('backHome')}</Button>
        </Link>
      </div>
    </PublicShell>
  );
}
