'use client';

import { useTranslations } from 'next-intl';
import { AlertCircle, Building2, FilterX, RefreshCw, Send } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ProjectCard } from '@/components/public/project-card';
import { EmptyState } from '@/components/shared/empty-state';
import type { ProjectsGridProps } from '@/types/public';

/**
 * Responsive 3-column grid for public projects with full state handling:
 * - Loading Skeletons
 * - Error Banner with Retry
 * - Dual Empty States (No filter matches vs. Global zero projects)
 * - Animated Project Card Grid
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
            className="flex flex-col overflow-hidden rounded-2xl border border-border/70 bg-card p-0 shadow-xs">
            {/* Image Placeholder */}
            <Skeleton className="aspect-video w-full rounded-none" />

            {/* Card Content Skeleton */}
            <div className="flex flex-1 flex-col justify-between p-5 sm:p-6 space-y-4">
              <div className="space-y-3">
                {/* Badge / Location */}
                <div className="flex items-center gap-2">
                  <Skeleton className="h-4 w-24 rounded-md" />
                  <Skeleton className="h-4 w-16 rounded-md ms-auto" />
                </div>
                {/* Title */}
                <Skeleton className="h-6 w-4/5 rounded-md" />
                {/* Description lines */}
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full rounded-md" />
                  <Skeleton className="h-4 w-2/3 rounded-md" />
                </div>
              </div>

              {/* Link Footer */}
              <div className="pt-3 border-t border-border/40 flex items-center justify-between">
                <Skeleton className="h-4 w-28 rounded-md" />
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
      <div className="rounded-2xl border border-destructive/30 bg-destructive/5 p-8 sm:p-12 text-center max-w-2xl mx-auto shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-destructive/10 text-destructive mb-4">
          <AlertCircle className="h-7 w-7" aria-hidden="true" />
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
          className="gap-2 rounded-xl border-destructive/30 hover:bg-destructive/10 text-foreground font-medium shadow-xs">
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
          className="max-w-6xl"
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
              className="gap-2 rounded-xl px-6 shadow-xs font-medium cursor-pointer">
              <Send className="h-4 w-4" aria-hidden="true" />
              <span>{t('empty.contactUs')}</span>
            </Button>
          </Link>
        }
        className="max-w-6xl"
      />
    );
  }

  // 4. Success State: Project Cards Grid
  return (
    <div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8"
      role="region"
      aria-label={t('title')}>
      {projects.map((project) => (
        <ProjectCard key={project._id || project.slug} project={project} locale={locale} />
      ))}
    </div>
  );
}
