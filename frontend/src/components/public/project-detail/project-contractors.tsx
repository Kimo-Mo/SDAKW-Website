'use client';

import { useTranslations } from 'next-intl';
import { Building2 } from 'lucide-react';
import { Reveal, RevealItem } from '@/components/shared/reveal';
import type { ProjectContractorsProps } from '@/types/public';
import { cn } from '@/lib/utils';

/**
 * Contractors section for government projects on the public project detail page.
 * Displays each contractor's bilingual name and scope description in a structured card layout
 * with staggered scroll reveals.
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
      className={cn('space-y-4 sm:space-y-6 text-start', className)}>
      {/* Section Header */}
      <Reveal variant="fade-scale">
        <div className="flex items-center justify-between gap-2.5 pb-3 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div className="text-xs font-mono rtl:font-sans font-semibold tracking-widest rtl:tracking-normal text-muted-foreground uppercase">
              {t('projectDetail.sections.contractorsKicker')} <span aria-hidden="true">{'//'}</span>{' '}
              {t('projectDetail.sections.contractors')}
            </div>
          </div>

          <span className="text-xs font-mono text-muted-foreground bg-card border border-border px-2.5 py-0.5">
            {String(contractors.length).padStart(2, '0')}
          </span>
        </div>
      </Reveal>

      {/* Contractors Monolithic Grid */}
      <Reveal variant="stagger-children" staggerDelay={0.08}>
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
              <RevealItem key={`contractor-${index}`} className="h-full">
                <div className="group relative flex flex-col justify-between border border-border bg-card p-5 sm:p-6 shadow-xs transition-all duration-300 hover:border-foreground/40 hover:shadow-md text-start space-y-3 h-full">
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-2.5">
                      <div className="inline-flex items-center gap-1.5 text-xs font-mono text-muted-foreground">
                        <Building2
                          className="h-3.5 w-3.5 shrink-0 text-primary"
                          aria-hidden="true"
                        />
                        <span>
                          {t('projectDetail.contractors.contractorLabel')} #{String(index + 1).padStart(2, '0')}
                        </span>
                      </div>
                    </div>

                    <h3 className="font-heading text-base sm:text-lg font-bold text-foreground tracking-tight group-hover:text-primary transition-colors">
                      {localizedName}
                    </h3>
                  </div>

                  {localizedDescription && (
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed pt-2">
                      {localizedDescription}
                    </p>
                  )}
                </div>
              </RevealItem>
            );
          })}
        </div>
      </Reveal>
    </section>
  );
}
