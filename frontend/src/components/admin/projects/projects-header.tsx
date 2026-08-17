'use client';

import { useTranslations } from 'next-intl';
import { Plus } from 'lucide-react';

import { Link } from '@/i18n/navigation';
import { buttonVariants } from '@/components/ui/button';

export function ProjectsHeader() {
  const t = useTranslations('admin.projects');

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {t('title')}
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-1">{t('subtitle')}</p>
      </div>

      <Link
        href="/admin/projects/new"
        className={buttonVariants({
          variant: 'default',
          size: 'default',
          className: 'gap-2 shadow-xs shrink-0 self-start sm:self-auto',
        })}>
        <Plus className="h-4 w-4" />
        <span>{t('addNewProject')}</span>
      </Link>
    </div>
  );
}
