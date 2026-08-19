'use client';

import { useTranslations } from 'next-intl';
import { useQuery } from '@tanstack/react-query';
import {
  AlertCircle,
  ArrowRight,
  FolderKanban,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ProjectCard } from '@/components/public/project-card';
import { getPublicProjects } from '@/lib/api/public-projects';
import type { FeaturedProjectsShowcaseProps } from '@/types/public';
import { cn } from '@/lib/utils';

/**
 * Dynamic Featured Projects Showcase.
 * Fetches featured projects from `GET /api/v1/projects?featured=true&limit=3`
 * with automatic fallback to the 3 most recently published projects.
 */
export function FeaturedProjectsShowcase({
  locale,
}: FeaturedProjectsShowcaseProps) {
  const t = useTranslations('public');

  const {
    data: projects,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ['public-projects', { featured: true, limit: 3 }],
    queryFn: async () => {
      const featuredRes = await getPublicProjects({ featured: true, limit: 3 });
      if (featuredRes.projects && featuredRes.projects.length > 0) {
        return featuredRes.projects;
      }
      // Zero-featured fallback: load 3 most recent published projects
      const recentRes = await getPublicProjects({ limit: 3 });
      return recentRes.projects || [];
    },
    staleTime: 5 * 60 * 1000,
  });

  return (
    <section className="w-full py-16 sm:py-20 lg:py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Header section with title and View All link */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4">
        <div className="space-y-2.5 text-start max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1 text-xs font-semibold text-primary shadow-xs">
            <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{t('featuredProjects.badge')}</span>
          </div>

          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            {t('featuredProjects.title')}
          </h2>

          <p className="text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed">
            {t('featuredProjects.subtitle')}
          </p>
        </div>

        <div className="shrink-0 text-start md:text-end">
          <Link href="/projects">
            <Button
              variant="ghost"
              className="text-primary hover:text-primary hover:bg-primary/10 gap-1.5 font-semibold text-sm px-4 h-10 rounded-xl"
            >
              <span>{t('featuredProjects.viewAll')}</span>
              <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
            </Button>
          </Link>
        </div>
      </div>

      {/* Dynamic Content Area */}
      <div className="mt-8 sm:mt-10">
        {/* Loading State: 3 Skeleton Cards */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {[1, 2, 3].map((key) => (
              <div
                key={key}
                className="overflow-hidden rounded-2xl border border-border bg-card p-4 sm:p-5 space-y-4 shadow-xs"
              >
                <Skeleton className="aspect-video w-full rounded-xl" />
                <div className="space-y-2 pt-2">
                  <Skeleton className="h-4 w-1/3" />
                  <Skeleton className="h-5 w-3/4" />
                  <Skeleton className="h-3.5 w-full" />
                </div>
                <div className="pt-3 border-t border-border/40">
                  <Skeleton className="h-3 w-1/4" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State with Retry Button */}
        {!isLoading && isError && (
          <div className="rounded-2xl border border-destructive/20 bg-destructive/5 p-8 text-center flex flex-col items-center justify-center space-y-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-destructive/10 text-destructive">
              <AlertCircle className="h-6 w-6" aria-hidden="true" />
            </div>
            <div className="space-y-1 max-w-md">
              <h3 className="font-heading font-bold text-base text-foreground">
                {t('featuredProjects.error')}
              </h3>
            </div>
            <Button
              onClick={() => refetch()}
              disabled={isFetching}
              variant="outline"
              size="sm"
              className="rounded-xl gap-2 font-medium"
            >
              <RefreshCw className={cn('h-4 w-4', isFetching && 'animate-spin')} aria-hidden="true" />
              <span>{t('featuredProjects.retry')}</span>
            </Button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !isError && (!projects || projects.length === 0) && (
          <div className="rounded-2xl border border-border bg-card/60 p-8 sm:p-12 text-center flex flex-col items-center justify-center space-y-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <FolderKanban className="h-6 w-6" aria-hidden="true" />
            </div>
            <div className="space-y-1 max-w-md">
              <h3 className="font-heading font-bold text-base text-foreground">
                {t('featuredProjects.empty')}
              </h3>
            </div>
            <Link href="/projects">
              <Button variant="outline" size="sm" className="rounded-xl font-medium mt-2">
                {t('featuredProjects.viewAll')}
              </Button>
            </Link>
          </div>
        )}

        {/* Data Grid: 3 Projects */}
        {!isLoading && !isError && projects && projects.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {projects.map((project) => (
              <ProjectCard key={project._id} project={project} locale={locale} />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
