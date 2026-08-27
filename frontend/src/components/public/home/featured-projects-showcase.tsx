'use client';

import { useTranslations } from 'next-intl';
import { useQuery } from '@tanstack/react-query';
import { AlertCircle, ArrowRight, FolderKanban, RefreshCw } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ProjectCard } from '@/components/public/projects/project-card';
import { Reveal, RevealItem } from '@/components/shared/reveal';
import { getPublicProjects } from '@/lib/api/public-projects';
import type { FeaturedProjectsShowcaseProps } from '@/types/public';
import { cn } from '@/lib/utils';

/**
 * Dynamic Featured Projects Showcase.
 * Fetches featured projects from `GET /api/v1/projects?featured=true&limit=3`
 * with automatic fallback to the 3 most recently published projects.
 */
export function FeaturedProjectsShowcase({ locale }: FeaturedProjectsShowcaseProps) {
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
    <section className="main_section">
      {/* Header section with asymmetric editorial staging */}
      <Reveal variant="fade-scale" className="mb-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-4">
          <div className="space-y-3 text-start max-w-2xl">
            <div className="text-xs font-mono rtl:font-sans font-semibold tracking-widest rtl:tracking-normal text-muted-foreground uppercase">
              02 // {t('featuredProjects.badge')}
            </div>

            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
              {t('featuredProjects.title')}
            </h2>

            <p className="text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed">
              {t('featuredProjects.subtitle')}
            </p>
          </div>

          <div className="shrink-0 text-start md:text-end">
            <Link href="/projects">
              <Button
                variant="outline"
                size="sm"
                className="rounded-none px-4 h-9 gap-2 font-mono rtl:font-sans text-xs uppercase tracking-wider rtl:tracking-normal font-semibold border-border hover:bg-muted cursor-pointer active:scale-[0.98] transition-all">
                <span>{t('featuredProjects.viewAll')}</span>
                <ArrowRight className="h-3.5 w-3.5 rtl:rotate-180" aria-hidden="true" />
              </Button>
            </Link>
          </div>
        </div>
      </Reveal>

      {/* Dynamic Content Area */}
      <div>
        {/* Loading State: 3 Skeleton Cards */}
        {isLoading && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {[1, 2, 3].map((key) => (
              <div
                key={key}
                className="border border-border bg-card p-4 sm:p-5 space-y-4 shadow-xs">
                <Skeleton className="aspect-video w-full rounded-none" />
                <div className="space-y-2 pt-2">
                  <Skeleton className="h-4 w-1/3 rounded-none" />
                  <Skeleton className="h-5 w-3/4 rounded-none" />
                  <Skeleton className="h-3.5 w-full rounded-none" />
                </div>
                <div className="pt-3 border-t border-border/40">
                  <Skeleton className="h-3 w-1/4 rounded-none" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State with Retry Button */}
        {!isLoading && isError && (
          <div className="border border-destructive/20 bg-destructive/5 p-8 text-center flex flex-col items-center justify-center space-y-4">
            <div className="flex h-12 w-12 items-center justify-center bg-destructive/10 text-destructive">
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
              className="rounded-none gap-2 font-mono text-xs uppercase tracking-wider">
              <RefreshCw
                className={cn('h-4 w-4', isFetching && 'animate-spin')}
                aria-hidden="true"
              />
              <span>{t('featuredProjects.retry')}</span>
            </Button>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !isError && (!projects || projects.length === 0) && (
          <div className="border border-border bg-card/60 p-8 sm:p-12 text-center flex flex-col items-center justify-center space-y-4">
            <div className="flex h-12 w-12 items-center justify-center bg-primary/10 text-primary">
              <FolderKanban className="h-6 w-6" aria-hidden="true" />
            </div>
            <div className="space-y-1 max-w-md">
              <h3 className="font-heading font-bold text-base text-foreground">
                {t('featuredProjects.empty')}
              </h3>
            </div>
            <Link href="/projects">
              <Button
                variant="outline"
                size="sm"
                className="rounded-none font-mono text-xs uppercase tracking-wider mt-2">
                {t('featuredProjects.viewAll')}
              </Button>
            </Link>
          </div>
        )}

        {/* Data Grid: 3 Projects with Staggered Container Coordination */}
        {!isLoading && !isError && projects && projects.length > 0 && (
          <Reveal variant="stagger-children" staggerDelay={0.12}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
              {projects.map((project) => (
                <RevealItem key={project._id}>
                  <ProjectCard project={project} locale={locale} />
                </RevealItem>
              ))}
            </div>
          </Reveal>
        )}
      </div>
    </section>
  );
}
