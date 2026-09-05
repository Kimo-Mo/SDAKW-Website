'use client';

import { useTranslations } from 'next-intl';
import { Badge } from '@/components/ui/badge';
import type { ProductSpecificationsProps } from '@/types/public';
import { cn } from '@/lib/utils';

/**
 * Editorial material specifications component for the public product detail page.
 * Displays category, material, and the four bilingual tag arrays (color, origin, uses, surface)
 * as labeled rows with shadcn Badge components, separated by hairline dividers.
 */
export function ProductSpecifications({
  product,
  locale,
  className,
}: ProductSpecificationsProps) {
  const t = useTranslations('public.productDetail');

  const localizedMaterial =
    locale === 'ar'
      ? product.material?.ar || product.material?.en || ''
      : product.material?.en || product.material?.ar || '';

  const categoryLabel = t(`categories.${product.category}` as const);

  const colors =
    locale === 'ar'
      ? product.color?.ar ?? []
      : product.color?.en ?? [];

  const origins =
    locale === 'ar'
      ? product.origin?.ar ?? []
      : product.origin?.en ?? [];

  const usesList =
    locale === 'ar'
      ? product.uses?.ar ?? []
      : product.uses?.en ?? [];

  const surfaces =
    locale === 'ar'
      ? product.surface?.ar ?? []
      : product.surface?.en ?? [];

  const dimensions = product.dimensions ?? [];

  const specificationRows: Array<{
    id: string;
    label: string;
    type: 'text' | 'badges' | 'dimensions';
    textValue?: string;
    badgeValues?: string[];
    dimensionValues?: typeof dimensions;
  }> = [
    {
      id: 'category',
      label: t('attributes.category'),
      type: 'text',
      textValue: categoryLabel,
    },
    {
      id: 'material',
      label: t('attributes.material'),
      type: 'text',
      textValue: localizedMaterial,
    },
    {
      id: 'origin',
      label: t('attributes.origin'),
      type: 'badges',
      badgeValues: origins,
    },
    {
      id: 'color',
      label: t('attributes.color'),
      type: 'badges',
      badgeValues: colors,
    },
    {
      id: 'uses',
      label: t('attributes.uses'),
      type: 'badges',
      badgeValues: usesList,
    },
    {
      id: 'surface',
      label: t('attributes.surface'),
      type: 'badges',
      badgeValues: surfaces,
    },
    {
      id: 'dimensions',
      label: t('attributes.dimensions'),
      type: 'dimensions',
      dimensionValues: dimensions,
    },
  ];

  return (
    <section
      aria-labelledby="material-specifications-heading"
      className={cn('space-y-4 bg-card border border-border p-6 sm:p-8 shadow-xs text-start', className)}>
      {/* Section Header */}
      <div className="text-xs font-mono rtl:font-sans font-semibold tracking-widest rtl:tracking-normal text-muted-foreground uppercase border-b border-border pb-3">
        {t('sections.specificationsKicker')} <span aria-hidden="true">{'//'}</span>{' '}
        <span id="material-specifications-heading">{t('sections.specifications')}</span>
      </div>

      {/* Specifications Rows separated by hairline dividers */}
      <div className="divide-y divide-border">
        {specificationRows.map((row) => {
          if (row.type === 'badges' && (!row.badgeValues || row.badgeValues.length === 0)) {
            return null;
          }
          if (row.type === 'dimensions' && (!row.dimensionValues || row.dimensionValues.length === 0)) {
            return null;
          }
          if (row.type === 'text' && !row.textValue) {
            return null;
          }

          return (
            <div
              key={row.id}
              className="py-4 first:pt-2 last:pb-1 flex flex-col sm:flex-row sm:items-baseline gap-2.5 sm:gap-6">
              {/* Row Label */}
              <div className="w-full sm:w-44 shrink-0 text-xs font-mono rtl:font-sans font-medium uppercase tracking-wider rtl:tracking-normal text-muted-foreground">
                {row.label}
              </div>

              {/* Row Content */}
              <div className="flex-1">
                {row.type === 'text' ? (
                  <span className="text-sm font-semibold text-foreground">
                    {row.textValue}
                  </span>
                ) : row.type === 'dimensions' ? (
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {row.dimensionValues!.map((dim, idx) => (
                      <Badge
                        key={`dim-${idx}-${dim.length}-${dim.width}-${dim.thickness}`}
                        variant="secondary"
                        className="rounded-none font-normal text-xs px-2.5 py-1 bg-muted/60 text-foreground border border-border/80">
                        <span className="font-mono tracking-tight" dir="ltr">
                          {`${dim.length} × ${dim.width} × ${dim.thickness}`}
                        </span>
                        <span className="ms-1.5 font-mono rtl:font-sans text-muted-foreground">
                          {t('attributes.cm')}
                        </span>
                      </Badge>
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-1.5 sm:gap-2">
                    {row.badgeValues!.map((badge, idx) => (
                      <Badge
                        key={`${row.id}-${idx}-${badge}`}
                        variant="secondary"
                        className="rounded-none font-normal text-xs px-2.5 py-1 bg-muted/60 text-foreground border border-border/80">
                        {badge}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
