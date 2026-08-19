'use client';

import { useTranslations } from 'next-intl';
import { FolderKanban, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { ProjectsHeaderProps } from '@/types/public';

/**
 * Portfolio page header introducing Salem Duwaih Al Ajmi Company projects.
 * Displays localized title, introductory summary, and total executed project count.
 */
export function ProjectsHeader({ totalProjects }: ProjectsHeaderProps) {
  const t = useTranslations('public.projectsPage');

  return (
    <section className="relative w-full overflow-hidden border-b border-border/50 bg-linear-to-b from-muted/40 via-background to-background py-14 sm:py-16 lg:py-20">
      {/* Subtle architectural background accents */}
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,var(--tw-gradient-stops))] from-primary/5 via-transparent to-transparent opacity-70"
        aria-hidden="true"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start gap-4 md:gap-6">
          {/* Badge & Total Count Row */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3.5 py-1 text-xs font-semibold text-primary shadow-xs backdrop-blur-xs">
              <FolderKanban className="h-3.5 w-3.5 text-primary" aria-hidden="true" />
              <span>{t('badge')}</span>
            </div>

            {typeof totalProjects === 'number' && (
              <Badge
                variant="outline"
                className="gap-1.5 border-border/80 bg-background/80 px-3 py-1 text-xs font-medium text-muted-foreground shadow-xs">
                <Sparkles className="h-3 w-3 text-primary/80" aria-hidden="true" />
                <span>{t('totalCount', { count: totalProjects })}</span>
              </Badge>
            )}
          </div>

          {/* Heading */}
          <h1 className="font-heading text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl lg:text-5xl max-w-4xl text-start leading-[1.15]">
            {t('title')}
          </h1>

          {/* Subtitle */}
          <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base lg:text-lg text-start">
            {t('subtitle')}
          </p>
        </div>
      </div>
    </section>
  );
}
