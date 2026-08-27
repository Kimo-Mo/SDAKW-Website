'use client';

import { useTranslations } from 'next-intl';
import { AlertCircle, Building2, FilterX, RefreshCw, Send } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ProjectCard } from '@/components/public/projects/project-card';
import { EmptyState } from '@/components/shared/empty-state';
import { Reveal, RevealItem } from '@/components/shared/reveal';
import type { ProjectsGridProps } from '@/types/public';

/**
 * Responsive 3-column grid for public projects with full state handling:
 * - Loading Skeletons
 * - Error Banner with Retry
 * - Dual Empty States (No filter matches vs. Global zero projects)
 * - Animated Project Card Grid with staggered entrance reveals
 */
export function ProjectsGrid({
  projects,
  isLoading,
  isError,
  onRetry,
  onResetFilters,
  hasActiveFilters,
  locale,
}: ProjectsGridProps) {
  const t = useTranslations('public.projectsPage');

  // 1. Loading State: Skeleton Cards
  if (isLoading) {
    return (
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
        aria-busy="true"
        aria-live="polite">
        {Array.from({ length: 6 }).map((_, index) => (
          <div
            key={`project-skeleton-${index}`}
            className="flex flex-col h-full overflow-hidden border border-border bg-card p-0 shadow-xs">
            {/* Image Placeholder */}
            <Skeleton className="aspect-16/10 w-full rounded-none" />

            {/* Card Content Skeleton */}
            <div className="flex flex-1 flex-col p-5 sm:p-6 space-y-3">
              {/* Type // Status line */}
              <Skeleton className="h-4 w-32 rounded-none" />
              {/* Title */}
              <Skeleton className="h-7 w-4/5 rounded-none" />
              {/* Location line */}
              <Skeleton className="h-4 w-1/2 rounded-none" />
              {/* View cue pinned to foot */}
              <div className="mt-auto pt-3">
                <Skeleton className="h-4 w-24 rounded-none" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // 2. Error State: Isolated Error Banner
  if (isError) {
    return (
      <div className="border border-destructive/30 bg-destructive/5 p-8 sm:p-12 text-center max-w-2xl mx-auto shadow-xs">
        <div className="mx-auto flex h-12 w-12 items-center justify-center bg-destructive/10 text-destructive mb-4">
          <AlertCircle className="h-6 w-6" aria-hidden="true" />
        </div>
        <h3 className="font-heading text-lg sm:text-xl font-bold text-foreground mb-2">
          {t('error.title')}
        </h3>
        <p className="text-sm text-muted-foreground leading-relaxed mb-6 max-w-md mx-auto">
          {t('error.description')}
        </p>
        <Button
          onClick={onRetry}
          variant="outline"
          className="gap-2 rounded-none border-border hover:bg-muted text-foreground font-mono text-xs uppercase tracking-wider shadow-xs cursor-pointer">
          <RefreshCw className="h-4 w-4" aria-hidden="true" />
          <span>{t('error.retry')}</span>
        </Button>
      </div>
    );
  }

  // 3. Empty State: No projects found
  if (projects.length === 0) {
    if (hasActiveFilters) {
      // Filter-Empty State
      return (
        <EmptyState
          icon={FilterX}
          title={t('empty.title')}
          description={t('empty.description')}
          actionLabel={t('empty.reset')}
          onAction={onResetFilters}
          className="max-w-6xl rounded-none border border-border"
        />
      );
    }

    // Global Zero Projects State
    return (
      <EmptyState
        icon={Building2}
        title={t('empty.globalTitle')}
        description={t('empty.globalDescription')}
        actionNode={
          <Link href="/contact">
            <Button
              variant="default"
              className="gap-2 rounded-none px-6 shadow-xs font-mono text-xs uppercase tracking-wider cursor-pointer">
              <Send className="h-4 w-4" aria-hidden="true" />
              <span>{t('empty.contactUs')}</span>
            </Button>
          </Link>
        }
        className="max-w-6xl rounded-none border border-border"
      />
    );
  }

  // 4. Success State: Staggered Project Cards Grid with Uniform Heights
  return (
    <Reveal variant="stagger-children" staggerDelay={0.08}>
      <div
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 items-stretch"
        role="region"
        aria-label={t('title')}>
        {projects.map((project) => (
          <RevealItem key={project._id || project.slug} className="h-full">
            <ProjectCard project={project} locale={locale} />
          </RevealItem>
        ))}
      </div>
    </Reveal>
  );
}
