'use client';

import { useTranslations } from 'next-intl';
import { Plus } from 'lucide-react';

import { Link } from '@/i18n/navigation';
import { buttonVariants } from '@/components/ui/button';

export function ProductsHeader() {
  const t = useTranslations('admin.products');

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-1">
        <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {t('title')}
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground">
          {t('subtitle')}
        </p>
      </div>

      <Link
        href="/admin/products/new"
        className={buttonVariants({
          variant: 'default',
          size: 'default',
          className: 'gap-2 shrink-0 self-start sm:self-auto font-semibold shadow-xs',
        })}>
        <Plus className="h-4 w-4" />
        <span>{t('addNewProduct')}</span>
      </Link>
    </div>
  );
}
