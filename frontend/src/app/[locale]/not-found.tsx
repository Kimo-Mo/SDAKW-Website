'use client';

import { useTranslations } from 'next-intl';

import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  const t = useTranslations('notFound');

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 p-6 text-center">
      <p className="text-sm font-medium text-muted-foreground">404</p>
      <h1 className="font-heading text-2xl font-medium tracking-tight">{t('title')}</h1>
      <p className="max-w-sm text-sm/relaxed text-muted-foreground">{t('description')}</p>
      <Link href="/">
        <Button className="mt-2">{t('backHome')}</Button>
      </Link>
    </main>
  );
}
