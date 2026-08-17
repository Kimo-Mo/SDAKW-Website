'use client';

import { useTranslations } from 'next-intl';
import { AlertCircle } from 'lucide-react';

import { Link } from '@/i18n/navigation';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function ProjectFormSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-9 w-32" />
      </div>
      <Skeleton className="h-64 w-full rounded-xl" />
      <Skeleton className="h-48 w-full rounded-xl" />
      <Skeleton className="h-48 w-full rounded-xl" />
    </div>
  );
}

interface ProjectFormErrorStateProps {
  onRetry: () => void;
}

export function ProjectFormErrorState({ onRetry }: ProjectFormErrorStateProps) {
  const t = useTranslations('admin.projects.form');

  return (
    <Card className="border-destructive/30 bg-destructive/5 shadow-xs">
      <CardContent className="flex flex-col items-center justify-center p-8 text-center">
        <AlertCircle className="h-10 w-10 text-destructive mb-2" />
        <h3 className="font-heading font-semibold text-base text-destructive mb-1">
          {t('errors.loadTitle')}
        </h3>
        <p className="text-xs text-muted-foreground max-w-md mb-5">{t('errors.loadDesc')}</p>
        <div className="flex items-center gap-3">
          <Link
            href="/admin/projects"
            className={buttonVariants({ variant: 'outline', size: 'sm' })}>
            {t('backToProjects')}
          </Link>
          <Button variant="default" size="sm" onClick={onRetry} className="text-xs">
            {t('errors.retry')}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
