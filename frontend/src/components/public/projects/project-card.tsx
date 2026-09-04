'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { ArrowRight } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { BrandedImageFallback } from '@/components/public/home/branded-image-fallback';
import type { ProjectCardProps } from '@/types/public';
import { cn } from '@/lib/utils';

/**
 * Architectural project showcase card for public listings and home featured grid.
 * Image-forward widescreen composition with grayscale-to-color hover zoom,
 * followed by a typography-led info block: title, location secondary line,
 * and a minimal monochrome --font-mono type/status indicator (no badge pills,
 * no price-like rhythm). Flex-column + line-clamp keeps grid rows uniform
 * across every breakpoint.
 */
export function ProjectCard({ project, locale, className }: ProjectCardProps) {
  const t = useTranslations('public');
  const [imageError, setImageError] = useState(false);

  const localizedTitle =
    locale === 'ar'
      ? project.title?.ar || project.title?.en || ''
      : project.title?.en || project.title?.ar || '';

  const localizedLocation =
    locale === 'ar'
      ? project.location?.ar || project.location?.en || ''
      : project.location?.en || project.location?.ar || '';

  const localizedGovernmentEntity =
    locale === 'ar'
      ? project.governmentEntity?.ar || project.governmentEntity?.en || ''
      : project.governmentEntity?.en || project.governmentEntity?.ar || '';

  const typeLabel =
    project.projectType === 'government'
      ? t('projectDetail.metadata.projectType.government')
      : t('projectDetail.metadata.projectType.private');

  const statusLabel =
    project.status === 'ongoing'
      ? t('featuredProjects.status.ongoing')
      : t('featuredProjects.status.completed');

  const hasValidImage = Boolean(project.coverImage?.url) && !imageError;

  return (
    <Link
      href={`/projects/${project.slug}`}
      data-cursor="explore"
      className={cn(
        'group relative flex h-full flex-col overflow-hidden border border-border bg-card transition-colors duration-300 hover:border-foreground/40 cursor-pointer',
        className
      )}>
      {/* 1. Widescreen Image Area — grayscale settles into color on hover */}
      <div className="relative aspect-16/10 w-full shrink-0 overflow-hidden bg-muted/40">
        {hasValidImage ? (
          <Image
            src={project.coverImage!.url}
            alt={localizedTitle}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onError={() => setImageError(true)}
            className="object-cover transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-[1.04] motion-reduce:transform-none"
          />
        ) : (
          <BrandedImageFallback aspectRatio="16/10" />
        )}
      </div>

      {/* 2. Typography-Led Info Block */}
      <div className="flex flex-1 flex-col p-5 text-start sm:p-6">
        {/* Type // Status — minimal mono index line, no badge treatment */}
        <p className="text-xs font-mono rtl:font-sans font-semibold uppercase tracking-wider rtl:tracking-normal text-muted-foreground">
          <span
            aria-hidden="true"
            className="me-1 inline-block h-1.5 w-1.5 -translate-y-px bg-foreground"
          />
          {typeLabel} <span aria-hidden="true">{'// '}</span>
          <span className="text-foreground">{statusLabel}</span>
        </p>

        {/* Title */}
        <h3 className="mt-3 line-clamp-1 font-heading text-lg font-bold tracking-tight text-foreground sm:text-xl">
          <span className="capitalize">{localizedTitle}</span>
        </h3>

        {/* Location — secondary line */}
        {localizedLocation && (
          <p className="mt-1.5 truncate text-sm text-muted-foreground">{localizedLocation}</p>
        )}

        {/* Government entity attribution — strictly for government projects */}
        {project.projectType === 'government' && localizedGovernmentEntity && (
          <p className="mt-1.5 truncate text-xs text-muted-foreground/80">
            {localizedGovernmentEntity}
          </p>
        )}

        {/* 3. View Cue — pinned to card foot so rows stay uniform */}
        <div className="mt-auto flex items-center gap-1.5 pt-5">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-foreground">
            <span className="border-b border-foreground pb-0.5">
              {t('featuredProjects.viewDetails')}
            </span>
            <ArrowRight
              className="h-3.5 w-3.5 transition-transform duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] rtl:rotate-180 group-hover:translate-x-1 rtl:group-hover:-translate-x-1 motion-reduce:transform-none"
              aria-hidden="true"
            />
          </span>
        </div>
      </div>
    </Link>
  );
}
