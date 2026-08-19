'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Building2, HardHat } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { ProjectContractorsProps } from '@/types/public';
import { cn } from '@/lib/utils';

/**
 * Contractors section for government projects on the public project detail page.
 * Displays each contractor's bilingual name and scope description in a structured card layout.
 * Strictly omitted on private projects or when contractor data is empty.
 */
export function ProjectContractors({ contractors, locale, className }: ProjectContractorsProps) {
  const t = useTranslations('public');

  if (!contractors || contractors.length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby="project-contractors-heading"
      className={cn('space-y-4 sm:space-y-6', className)}>
      {/* Section Header */}
      <div className="flex items-center gap-2.5 pb-2 border-b border-border/40">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600/10 text-blue-600 dark:text-blue-400">
          <HardHat className="h-4 w-4" aria-hidden="true" />
        </div>
        <h2
          id="project-contractors-heading"
          className="font-heading text-lg sm:text-xl font-bold tracking-tight text-foreground">
          {t('projectDetail.sections.contractors')}
        </h2>
        <span className="text-xs font-semibold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/60 border border-blue-200/60 dark:border-blue-900/60 px-2.5 py-0.5 rounded-full ms-auto">
          {contractors.length}
        </span>
      </div>

      {/* Contractors Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        {contractors.map((contractor, index) => {
          const localizedName =
            locale === 'ar'
              ? contractor.name?.ar || contractor.name?.en || ''
              : contractor.name?.en || contractor.name?.ar || '';

          const localizedDescription =
            locale === 'ar'
              ? contractor.description?.ar || contractor.description?.en || ''
              : contractor.description?.en || contractor.description?.ar || '';

          return (
            <div
              key={`contractor-${index}`}
              className="group relative flex flex-col justify-between rounded-2xl border border-border/60 bg-card p-5 sm:p-6 shadow-xs transition-all duration-300 hover:border-blue-500/40 hover:shadow-md text-start space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between gap-2">
                  <Badge
                    variant="outline"
                    className="border-blue-200 dark:border-blue-900 bg-blue-50/50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 text-xs font-semibold px-2 py-0.5">
                    <Building2
                      className="h-3 w-3 me-1 text-blue-600 dark:text-blue-400"
                      aria-hidden="true"
                    />
                    <span>
                      {t('projectDetail.contractors.contractorLabel')} #{index + 1}
                    </span>
                  </Badge>
                </div>

                <h3 className="font-heading text-base sm:text-lg font-bold text-foreground tracking-tight group-hover:text-primary transition-colors">
                  {localizedName}
                </h3>
              </div>

              {localizedDescription && (
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {localizedDescription}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
