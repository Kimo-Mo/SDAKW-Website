'use client';

import { useLocale, useTranslations } from 'next-intl';
import { Edit, Trash2, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

import type { BackendProduct } from '@/types/admin';
import type { Locale } from '@/i18n/routing';
import { Link } from '@/i18n/navigation';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface ProductsCardListProps {
  products: BackendProduct[];
  isLoading: boolean;
  onDelete: (product: BackendProduct) => void;
}

export function ProductsCardList({ products, isLoading, onDelete }: ProductsCardListProps) {
  const t = useTranslations('admin.products');
  const locale = useLocale() as Locale;

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3 lg:hidden">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="border border-border/80 p-4 shadow-xs">
            <div className="flex items-start gap-3">
              <Skeleton className="h-16 w-20 rounded-lg shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <div className="flex gap-1.5 pt-1">
                  <Skeleton className="h-5 w-20 rounded-full" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
              </div>
            </div>
            <div className="mt-3 flex justify-end gap-2 border-t border-border/60 pt-3">
              <Skeleton className="h-8 w-20 rounded-md" />
              <Skeleton className="h-8 w-20 rounded-md" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 lg:hidden">
      {products.map((product) => {
        const displayName =
          locale === 'ar'
            ? product.name?.ar || product.name?.en || ''
            : product.name?.en || product.name?.ar || '';

        const displayMaterial =
          locale === 'ar'
            ? product.material?.ar || product.material?.en
            : product.material?.en || product.material?.ar;

        return (
          <Card
            key={product._id}
            className="border border-border/80 bg-card shadow-xs transition-shadow hover:shadow-md">
            <CardContent className="p-4">
              {/* Header area with Thumbnail & Name */}
              <div className="flex items-start gap-3.5">
                <div className="relative flex h-16 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted border border-border/80">
                  {product.coverImage?.url ? (
                    <Image
                      src={product.coverImage.url}
                      alt={displayName}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  ) : (
                    <ImageIcon className="h-5 w-5 text-muted-foreground/60" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <Link
                    href={`/admin/products/${product._id}/edit`}
                    className="font-heading font-semibold text-sm text-foreground hover:text-primary transition-colors line-clamp-1">
                    {displayName}
                  </Link>

                  {displayMaterial && (
                    <p className="mt-0.5 text-xs text-muted-foreground line-clamp-1">
                      {displayMaterial}
                    </p>
                  )}
                </div>
              </div>

              {/* Badges Cluster */}
              <div className="mt-3 flex flex-wrap items-center gap-1.5">
                <Badge variant="secondary" className="text-[10px] font-medium">
                  {t(`categories.${product.category}`)}
                </Badge>

                <Badge
                  variant={product.published ? 'default' : 'ghost'}
                  className={`text-[10px] ${
                    product.published
                      ? 'bg-emerald-600 text-white dark:bg-emerald-600'
                      : 'border border-border text-muted-foreground'
                  }`}>
                  {product.published ? t('badges.published') : t('badges.draft')}
                </Badge>
              </div>

              {/* Action Buttons Footer */}
              <div className="mt-3.5 flex items-center justify-end gap-2 border-t border-border/60 pt-3">
                <Link
                  href={`/admin/products/${product._id}/edit`}
                  className={buttonVariants({
                    variant: 'outline',
                    size: 'sm',
                    className: 'gap-1.5 text-xs h-8',
                  })}>
                  <Edit className="h-3.5 w-3.5" />
                  <span>{t('table.edit')}</span>
                </Link>

                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDelete(product)}
                  className="gap-1.5 text-xs h-8">
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>{t('table.delete')}</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
