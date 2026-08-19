import React from 'react';
import { useTranslations } from 'next-intl';
import { FileText } from 'lucide-react';
import type { CompanyOverviewProps } from '@/types/public';
import { cn } from '@/lib/utils';

/**
 * Company Overview Section
 * Renders the full 3-paragraph corporate history and operations narrative.
 */
export function CompanyOverview({ className }: CompanyOverviewProps) {
  const t = useTranslations('public');

  return (
    <section
      aria-labelledby="company-overview-heading"
      className={cn(
        'rounded-3xl border border-border/80 bg-card p-6 sm:p-10 lg:p-12 shadow-xs space-y-6 text-start',
        className
      )}>
      {/* Section Header */}
      <div className="flex items-center gap-2.5 pb-4 border-b border-border/40">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <FileText className="h-5 w-5" aria-hidden="true" />
        </div>
        <h2
          id="company-overview-heading"
          className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-foreground">
          {t('aboutPage.overview.heading')}
        </h2>
      </div>

      {/* Narrative Paragraphs */}
      <div className="space-y-4 text-base sm:text-lg text-foreground/90 leading-relaxed sm:leading-8">
        <p>{t('aboutPage.overview.p1')}</p>
        <p>{t('aboutPage.overview.p2')}</p>
        <p>{t('aboutPage.overview.p3')}</p>
      </div>
    </section>
  );
}
