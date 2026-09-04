'use client';

import { useLocale, useTranslations } from 'next-intl';
import { Edit, Trash2, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';

import type { BackendProduct } from '@/types/admin';
import type { Locale } from '@/i18n/routing';
import { Link } from '@/i18n/navigation';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface ProductsTableProps {
  products: BackendProduct[];
  isLoading: boolean;
  onDelete: (product: BackendProduct) => void;
}

export function ProductsTable({ products, isLoading, onDelete }: ProductsTableProps) {
  const t = useTranslations('admin.products');
  const locale = useLocale() as Locale;

  if (isLoading) {
    return (
      <div className="hidden lg:block overflow-hidden rounded-xl border border-border bg-card shadow-xs">
        <div className="divide-y divide-border">
          <div className="flex h-11 items-center bg-muted/40 px-6">
            <Skeleton className="h-4 w-full" />
          </div>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex h-16 items-center gap-4 px-6">
              <Skeleton className="h-10 w-14 rounded-md shrink-0" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-32" />
              </div>
              <Skeleton className="h-5 w-24 rounded-full" />
              <Skeleton className="h-5 w-16 rounded-full" />
              <div className="flex gap-2">
                <Skeleton className="h-8 w-8 rounded-lg" />
                <Skeleton className="h-8 w-8 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="hidden lg:block overflow-hidden rounded-xl border border-border bg-card shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-start text-sm">
          <thead className="border-b border-border bg-muted/40 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <tr>
              <th scope="col" className="px-5 py-3 text-start w-16">
                {t('table.cover')}
              </th>
              <th scope="col" className="px-5 py-3 text-start">
                {t('table.product')}
              </th>
              <th scope="col" className="px-4 py-3 text-start w-36">
                {t('table.category')}
              </th>
              <th scope="col" className="px-4 py-3 text-start w-32">
                {t('table.visibility')}
              </th>
              <th scope="col" className="px-5 py-3 text-end w-28">
                {t('table.actions')}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/70 text-foreground">
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
                <tr key={product._id} className="hover:bg-accent/40 transition-colors group">
                  {/* Thumbnail */}
                  <td className="px-5 py-3.5 align-middle">
                    <div className="relative flex h-11 w-16 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted border border-border/80">
                      {product.coverImage?.url ? (
                        <Image
                          src={product.coverImage.url}
                          alt={displayName}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      ) : (
                        <ImageIcon className="h-4 w-4 text-muted-foreground/60" />
                      )}
                    </div>
                  </td>

                  {/* Name & Material */}
                  <td className="px-5 py-3.5 align-middle">
                    <div className="flex flex-col gap-0.5">
                      <Link
                        href={`/admin/products/${product._id}/edit`}
                        className="font-heading font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                        {displayName}
                      </Link>
                      {displayMaterial ? (
                        <span className="text-xs text-muted-foreground line-clamp-1">
                          {displayMaterial}
                        </span>
                      ) : null}
                    </div>
                  </td>

                  {/* Category Badge */}
                  <td className="px-4 py-3.5 align-middle">
                    <Badge variant="secondary" className="text-[11px] font-medium">
                      {t(`categories.${product.category}`)}
                    </Badge>
                  </td>

                  {/* Visibility Badge */}
                  <td className="px-4 py-3.5 align-middle">
                    <Badge
                      variant={product.published ? 'default' : 'ghost'}
                      className={`text-[11px] ${
                        product.published
                          ? 'bg-emerald-600 text-white dark:bg-emerald-600'
                          : 'border border-border text-muted-foreground'
                      }`}>
                      {product.published ? t('badges.published') : t('badges.draft')}
                    </Badge>
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-3.5 align-middle text-end">
                    <div className="inline-flex items-center justify-end gap-1.5">
                      <Link
                        href={`/admin/products/${product._id}/edit`}
                        className={buttonVariants({
                          variant: 'ghost',
                          size: 'icon',
                          className: 'h-8 w-8 text-muted-foreground hover:text-foreground',
                        })}
                        aria-label={`${t('table.edit')} ${displayName}`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(product)}
                        className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        aria-label={`${t('table.delete')} ${displayName}`}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
