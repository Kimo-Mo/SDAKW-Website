'use client';

import { useTranslations } from 'next-intl';
import { Sparkles } from 'lucide-react';
import { Reveal, RevealItem } from '@/components/shared/reveal';

interface ProductsHeaderProps {
  totalProducts?: number;
}

/**
 * Public Products catalog header.
 * Displays asymmetric editorial masthead with monolithic badge, localized title,
 * architectural accent bar, and total products count.
 */
export function ProductsHeader({ totalProducts }: ProductsHeaderProps) {
  const t = useTranslations('public.productsPage');

  return (
    <section className="relative w-full overflow-hidden border-b border-border bg-muted/10 py-12 sm:py-16 lg:py-18 text-start">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal variant="stagger-children" staggerDelay={0.08}>
          <div className="flex flex-col items-start gap-5 max-w-4xl">
            {/* Category Indicator & Total Count */}
            <RevealItem className="flex flex-wrap items-center gap-3">
              <div className="text-xs font-mono rtl:font-sans font-semibold tracking-widest rtl:tracking-normal text-muted-foreground uppercase">
                02 // {t('badge')}
              </div>

              {typeof totalProducts === 'number' && (
                <div className="inline-flex items-center gap-1.5 border border-border bg-card px-2.5 py-0.5 text-xs font-mono text-foreground shadow-xs">
                  <Sparkles className="h-3 w-3 text-foreground" aria-hidden="true" />
                  <span>{t('totalCount', { count: totalProducts })}</span>
                </div>
              )}
            </RevealItem>

            {/* Headline */}
            <RevealItem>
              <h1 className="font-heading text-3xl font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl leading-tight">
                {t('title')}
              </h1>
            </RevealItem>

            {/* Subtitle with Accent Bar */}
            <RevealItem className="border-s-2 border-primary ps-4 py-1">
              <p className="text-base sm:text-lg font-medium text-foreground leading-relaxed sm:leading-8">
                {t('subtitle')}
              </p>
            </RevealItem>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
