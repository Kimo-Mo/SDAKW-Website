'use client';

import { useTranslations } from 'next-intl';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { Reveal } from '@/components/shared/reveal';
import { Separator } from '@/components/ui/separator';
import type { ProductDetailViewProps } from '@/types/public';
import { ProductHero } from './product-hero';
import { ProductSpecifications } from './product-specifications';
import { ProductGallery } from './product-gallery';

/**
 * Public product detail view orchestrator component.
 * Assembles breadcrumbs, hero cover, category indicator, title, material subline,
 * hairline-separated specifications block, and gallery carousel.
 */
export function ProductDetailView({ product, locale }: ProductDetailViewProps) {
  const t = useTranslations('public');

  const localizedName =
    locale === 'ar'
      ? product.name?.ar || product.name?.en || ''
      : product.name?.en || product.name?.ar || '';

  const localizedMaterial =
    locale === 'ar'
      ? product.material?.ar || product.material?.en || ''
      : product.material?.en || product.material?.ar || '';

  const categoryLabel = t(`productDetail.categories.${product.category}` as const);

  return (
    <article className="w-full py-8 sm:py-12 lg:py-16 text-start">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-12">
        {/* Navigation & Breadcrumbs Bar */}
        <Reveal variant="fade-scale">
          <div className="flex flex-wrap items-center justify-between gap-4 pb-3 border-b border-border">
            {/* Back to Products link */}
            <Link
              href="/products"
              className="inline-flex items-center gap-2 text-xs font-mono rtl:font-sans uppercase tracking-wider rtl:tracking-normal font-semibold text-muted-foreground hover:text-foreground transition-colors group">
              <ArrowLeft
                className="h-3.5 w-3.5 transition-transform duration-300 rtl:rotate-180 group-hover:-translate-x-1 rtl:group-hover:translate-x-1"
                aria-hidden="true"
              />
              <span>{t('productDetail.breadcrumb.products')}</span>
            </Link>

            {/* Breadcrumb path */}
            <nav
              aria-label="Breadcrumb"
              className="hidden sm:flex items-center gap-1.5 text-xs font-mono text-muted-foreground">
              <Link href="/" className="hover:text-foreground transition-colors">
                {t('nav.home')}
              </Link>
              <ChevronRight
                className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60 rtl:rotate-180"
                aria-hidden="true"
              />
              <Link href="/products" className="hover:text-foreground transition-colors">
                {t('nav.products')}
              </Link>
              <ChevronRight
                className="h-3.5 w-3.5 shrink-0 text-muted-foreground/60 rtl:rotate-180"
                aria-hidden="true"
              />
              <span
                className="font-semibold text-foreground truncate max-w-50 sm:max-w-xs"
                title={localizedName}>
                {localizedName}
              </span>
            </nav>
          </div>
        </Reveal>

        {/* 1. Hero Cover Image */}
        <Reveal variant="fade-scale">
          <ProductHero coverImage={product.coverImage} title={localizedName} locale={locale} />
        </Reveal>

        {/* 2. Product Headline & Material Subline */}
        <div className="space-y-4">
          <Reveal variant="fade-up" delay={0.05}>
            <div className="space-y-2">
              {/* Category indicator line */}
              <p className="text-xs font-mono rtl:font-sans font-semibold tracking-wider rtl:tracking-normal text-muted-foreground uppercase">
                <span
                  aria-hidden="true"
                  className="me-1.5 inline-block h-1.5 w-1.5 -translate-y-px bg-foreground"
                />
                <span className="text-foreground">{categoryLabel}</span>
              </p>

              {/* Product Headline */}
              <h1 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground leading-tight">
                {localizedName}
              </h1>

              {/* Material Subline */}
              {localizedMaterial && (
                <p className="text-base sm:text-lg text-muted-foreground font-medium">
                  {localizedMaterial}
                </p>
              )}
            </div>
          </Reveal>
        </div>

        {/* 3. Hairline-Divided Specifications Block */}
        <Reveal variant="fade-up" delay={0.08}>
          <ProductSpecifications product={product} locale={locale} />
        </Reveal>

        {/* 4. Gallery Carousel Section (omitted if empty) */}
        {product.gallery && product.gallery.length > 0 && (
          <>
            <Separator className="bg-border" />
            <ProductGallery
              images={product.gallery}
              productTitle={localizedName}
              locale={locale}
            />
          </>
        )}
      </div>
    </article>
  );
}
