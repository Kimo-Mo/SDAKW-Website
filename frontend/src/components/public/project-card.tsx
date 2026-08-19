'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { ArrowRight, Building2, Calendar, Landmark, MapPin } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { Badge } from '@/components/ui/badge';
import { BrandedImageFallback } from '@/components/public/branded-image-fallback';
import type { ProjectCardProps } from '@/types/public';
import { cn } from '@/lib/utils';

/**
 * Reusable project showcase card for public listings and home page featured grid.
 * Displays optimized cover image, classification badges, and localized metadata.
 */
export function ProjectCard({ project, locale, className }: ProjectCardProps) {
  const t = useTranslations('public');
  const [imageError, setImageError] = useState(false);

  const localizedTitle =
    locale === 'ar'
      ? project.title?.ar || project.title?.en || ''
      : project.title?.en || project.title?.ar || '';

  const localizedDescription =
    locale === 'ar'
      ? project.description?.ar || project.description?.en || ''
      : project.description?.en || project.description?.ar || '';

  const localizedLocation =
    locale === 'ar'
      ? project.location?.ar || project.location?.en || ''
      : project.location?.en || project.location?.ar || '';

  const localizedGovernmentEntity =
    locale === 'ar'
      ? project.governmentEntity?.ar || project.governmentEntity?.en || ''
      : project.governmentEntity?.en || project.governmentEntity?.ar || '';

  const completionYear = project.completionDate
    ? (() => {
        const d = new Date(project.completionDate);
        return isNaN(d.getFullYear()) ? project.completionDate : d.getFullYear();
      })()
    : null;

  const hasValidImage = Boolean(project.coverImage?.url) && !imageError;

  return (
    <article
      className={cn(
        'group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-xs transition-all duration-300 hover:shadow-md hover:border-primary/40',
        className
      )}>
      {/* Cover Image & Badges */}
      <div className="relative aspect-video w-full overflow-hidden bg-muted/40">
        {hasValidImage ? (
          <Image
            src={project.coverImage!.url}
            alt={localizedTitle}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={() => setImageError(true)}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <BrandedImageFallback aspectRatio="video" />
        )}

        {/* Top Floating Badges */}
        <div className="pointer-events-none absolute inset-x-3 top-3 flex items-center justify-between gap-2">
          {/* Project Type Badge */}
          <Badge
            variant="default"
            className={cn(
              'border-none px-2.5 py-0.5 text-xs font-semibold text-white shadow-xs backdrop-blur-xs',
              project.projectType === 'government'
                ? 'bg-blue-600/90 hover:bg-blue-600'
                : 'bg-emerald-600/90 hover:bg-emerald-600'
            )}>
            {project.projectType === 'government'
              ? t('featuredProjects.projectType.government')
              : t('featuredProjects.projectType.private')}
          </Badge>

          {/* Project Status Badge */}
          <Badge
            variant="secondary"
            className={cn(
              'border-none px-2.5 py-0.5 text-xs font-semibold shadow-xs backdrop-blur-xs',
              project.status === 'ongoing'
                ? 'bg-amber-500/90 text-white hover:bg-amber-500'
                : 'bg-slate-900/80 text-white hover:bg-slate-900'
            )}>
            {project.status === 'ongoing'
              ? t('featuredProjects.status.ongoing')
              : t('featuredProjects.status.completed')}
          </Badge>
        </div>
      </div>

      {/* Card Content Body */}
      <div className="flex flex-1 flex-col justify-between p-5 sm:p-6 text-start">
        <div className="space-y-2.5">
          {/* Meta badges row (Government Entity or Location & Year) */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Government Entity highlight (strictly for government projects) */}
            {project.projectType === 'government' && localizedGovernmentEntity && (
              <div className="inline-flex items-center gap-1.5 rounded-md bg-blue-50 dark:bg-blue-950/50 px-2 py-0.5 text-xs font-medium text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-900/60 max-w-full">
                <Landmark
                  className="h-3 w-3 shrink-0 text-blue-600 dark:text-blue-400"
                  aria-hidden="true"
                />
                <span className="truncate">{localizedGovernmentEntity}</span>
              </div>
            )}

            {/* Location tag */}
            {localizedLocation && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <MapPin className="h-3.5 w-3.5 shrink-0 text-primary/70" aria-hidden="true" />
                <span className="truncate">{localizedLocation}</span>
              </div>
            )}

            {/* Completion year tag for completed projects */}
            {project.status === 'completed' && completionYear && (
              <div className="inline-flex items-center gap-1 text-xs text-muted-foreground ms-auto">
                <Calendar
                  className="h-3 w-3 shrink-0 text-muted-foreground/70"
                  aria-hidden="true"
                />
                <span>{t('projectsPage.card.completedIn', { year: completionYear })}</span>
              </div>
            )}
          </div>

          {/* Title */}
          <h3 className="font-heading text-base sm:text-lg font-bold tracking-tight text-foreground transition-colors group-hover:text-primary line-clamp-1">
            <Link
              href={`/projects/${project.slug}`}
              className="focus-visible:outline-hidden focus-visible:underline">
              {localizedTitle}
            </Link>
          </h3>

          {/* Description snippet */}
          {localizedDescription && (
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed line-clamp-2">
              {localizedDescription}
            </p>
          )}
        </div>

        {/* Action Link Footer */}
        <div className="mt-5 pt-3 border-t border-border/40 flex items-center justify-between">
          <Link
            href={`/projects/${project.slug}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary transition-colors hover:text-primary/80">
            <span>{t('featuredProjects.viewDetails')}</span>
            <ArrowRight
              className="h-3.5 w-3.5 transition-transform duration-300 rtl:rotate-180 group-hover:translate-x-1 rtl:group-hover:-translate-x-1"
              aria-hidden="true"
            />
          </Link>
        </div>
      </div>
    </article>
  );
}
