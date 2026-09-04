'use client';

import { useTranslations } from 'next-intl';
import { ArrowLeft, RefreshCw } from 'lucide-react';

import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function ProductFormSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header Skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="h-8 w-60" />
          <Skeleton className="h-4 w-96 max-w-full" />
        </div>
        <div className="flex gap-2">
          <Skeleton className="h-9 w-20" />
          <Skeleton className="h-9 w-28" />
        </div>
      </div>

      {/* Basic Info Card Skeleton */}
      <Card className="border-border bg-card">
        <CardContent className="p-6 space-y-4">
          <Skeleton className="h-5 w-36" />
          <Skeleton className="h-3 w-64" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
          </div>
          <Skeleton className="h-9 w-full" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Skeleton className="h-9 w-full" />
            <Skeleton className="h-9 w-full" />
          </div>
        </CardContent>
      </Card>

      {/* Attributes Card Skeleton */}
      <Card className="border-border bg-card">
        <CardContent className="p-6 space-y-4">
          <Skeleton className="h-5 w-44" />
          <Skeleton className="h-3 w-80" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-28 w-full" />
            <Skeleton className="h-28 w-full" />
          </div>
        </CardContent>
      </Card>

      {/* Media Card Skeleton */}
      <Card className="border-border bg-card">
        <CardContent className="p-6 space-y-4">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-32 w-full" />
          <Skeleton className="h-32 w-full" />
        </CardContent>
      </Card>
    </div>
  );
}

interface ProductFormErrorStateProps {
  onRetry: () => void;
}

export function ProductFormErrorState({ onRetry }: ProductFormErrorStateProps) {
  const t = useTranslations('admin.products.form');

  return (
    <div className="space-y-6">
      <div>
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-2 transition-colors">
          <ArrowLeft className="h-3.5 w-3.5 rtl:rotate-180" />
          <span>{t('backToProducts')}</span>
        </Link>
      </div>

      <Card className="border-destructive/30 bg-destructive/5 shadow-xs">
        <CardContent className="flex flex-col items-center justify-center p-8 text-center">
          <h3 className="font-heading font-semibold text-base text-destructive mb-1">
            {t('errors.loadTitle')}
          </h3>
          <p className="text-xs text-muted-foreground max-w-md mb-4">{t('errors.loadDesc')}</p>
          <Button
            variant="outline"
            size="sm"
            onClick={onRetry}
            className="gap-2 border-destructive/30 hover:bg-destructive/10 text-destructive text-xs">
            <RefreshCw className="h-3.5 w-3.5" />
            <span>{t('errors.retry')}</span>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
