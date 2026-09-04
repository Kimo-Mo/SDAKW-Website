'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { BrandedImageFallback } from '@/components/public/home/branded-image-fallback';
import type { ProductCardProps } from '@/types/public';
import { cn } from '@/lib/utils';

/**
 * Architectural material showcase card for public products catalog.
 * Image-forward widescreen composition with hover zoom,
 * followed by a typography-led info block: minimal mono category line,
 * localized product name, and material + origin secondary line.
 * Uniform height across every grid row via line-clamp-1 and flex-column.
 */
export function ProductCard({ product, locale, className }: ProductCardProps) {
  const t = useTranslations('public');
  const [imageError, setImageError] = useState(false);

  const localizedName =
    locale === 'ar'
      ? product.name?.ar || product.name?.en || ''
      : product.name?.en || product.name?.ar || '';

  const localizedMaterial =
    locale === 'ar'
      ? product.material?.ar || product.material?.en || ''
      : product.material?.en || product.material?.ar || '';

  const categoryLabel = t(`productsPage.filters.${product.category}` as const);

  // Up to 2 origin values
  const originsList =
    locale === 'ar'
      ? product.origin?.ar ?? []
      : product.origin?.en ?? [];
  const topOrigins = originsList.slice(0, 2).filter(Boolean).join(', ');

  const metaLine = topOrigins
    ? `${localizedMaterial} — ${topOrigins}`
    : localizedMaterial;

  const hasValidImage = Boolean(product.coverImage?.url) && !imageError;

  return (
    <Link
      href={`/products/${product.slug}`}
      data-cursor="explore"
      className={cn(
        'group relative flex h-full flex-col overflow-hidden border border-border bg-card transition-colors duration-300 hover:border-foreground/40 cursor-pointer',
        className
      )}>
      {/* 1. Widescreen Image Area */}
      <div className="relative aspect-16/10 w-full shrink-0 overflow-hidden bg-muted/40">
        {hasValidImage ? (
          <Image
            src={product.coverImage!.url}
            alt={localizedName}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={() => setImageError(true)}
            className="object-cover transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04] motion-reduce:transform-none"
          />
        ) : (
          <BrandedImageFallback aspectRatio="16/10" />
        )}
      </div>

      {/* 2. Typography-Led Info Block */}
      <div className="flex flex-1 flex-col p-5 text-start sm:p-6">
        {/* Category Minimal Mono Line */}
        <p className="text-xs font-mono rtl:font-sans font-semibold uppercase tracking-wider rtl:tracking-normal text-muted-foreground">
          <span
            aria-hidden="true"
            className="me-1 inline-block h-1.5 w-1.5 -translate-y-px bg-foreground"
          />
          <span className="text-foreground">{categoryLabel}</span>
        </p>

        {/* Product Name */}
        <h3 className="mt-3 line-clamp-1 font-heading text-lg font-bold tracking-tight text-foreground sm:text-xl">
          <span className="capitalize">{localizedName}</span>
        </h3>

        {/* Material & Origin Secondary Line (truncated to line-clamp-1) */}
        {metaLine && (
          <p className="mt-1.5 line-clamp-1 text-sm text-muted-foreground">{metaLine}</p>
        )}

        {/* 3. View Cue — pinned to bottom */}
        <div className="mt-auto flex items-center gap-1.5 pt-5">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-foreground">
            <span className="border-b border-foreground pb-0.5">
              {t('productsPage.card.viewDetails')}
            </span>
            <ArrowRight
              className="h-3.5 w-3.5 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] rtl:rotate-180 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 motion-reduce:transform-none"
              aria-hidden="true"
            />
          </span>
        </div>
      </div>
    </Link>
  );
}
