'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Calendar, Landmark, MapPin } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { ProjectMetadataBarProps } from '@/types/public';
import { cn } from '@/lib/utils';

/**
 * Metadata badges and information bar for the public project detail page.
 * Displays project type, execution status, location, government entity (if government),
 * and completion date (if completed).
 */
export function ProjectMetadataBar({ project, locale, className }: ProjectMetadataBarProps) {
  const t = useTranslations('public');

  const localizedLocation =
    locale === 'ar'
      ? project.location?.ar || project.location?.en || ''
      : project.location?.en || project.location?.ar || '';

  const localizedGovernmentEntity =
    locale === 'ar'
      ? project.governmentEntity?.ar || project.governmentEntity?.en || ''
      : project.governmentEntity?.en || project.governmentEntity?.ar || '';

  const formattedCompletionDate = project.completionDate
    ? (() => {
        try {
          const date = new Date(project.completionDate);
          if (isNaN(date.getTime())) return project.completionDate;
          return date.toLocaleDateString(locale === 'ar' ? 'ar-KW' : 'en-US', {
            year: 'numeric',
            month: 'long',
          });
        } catch {
          return project.completionDate;
        }
      })()
    : null;

  return (
    <div className={cn('flex flex-wrap items-center gap-2.5 sm:gap-3 py-2 text-start', className)}>
      {/* Project Type Badge */}
      <Badge
        variant="default"
        className={cn(
          'px-3 py-1 text-xs font-semibold text-white border-none shadow-xs',
          project.projectType === 'government'
            ? 'bg-blue-600 hover:bg-blue-600'
            : 'bg-emerald-600 hover:bg-emerald-600'
        )}>
        {project.projectType === 'government'
          ? t('projectDetail.metadata.projectType.government')
          : t('projectDetail.metadata.projectType.private')}
      </Badge>

      {/* Execution Status Badge */}
      <Badge
        variant="secondary"
        className={cn(
          'px-3 py-1 text-xs font-semibold shadow-xs border-none',
          project.status === 'ongoing'
            ? 'bg-amber-500 text-white hover:bg-amber-500'
            : 'bg-slate-900 text-white dark:bg-slate-800 hover:bg-slate-900'
        )}>
        {project.status === 'ongoing'
          ? t('projectDetail.metadata.status.ongoing')
          : t('projectDetail.metadata.status.completed')}
      </Badge>

      {/* Government Entity Attribution (strictly for government projects) */}
      {project.projectType === 'government' && localizedGovernmentEntity && (
        <div className="inline-flex items-center gap-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/60 px-3 py-1 text-xs font-medium text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-900/60">
          <Landmark
            className="h-3.5 w-3.5 shrink-0 text-blue-600 dark:text-blue-400"
            aria-hidden="true"
          />
          <span>{localizedGovernmentEntity}</span>
        </div>
      )}

      {/* Location */}
      {localizedLocation && (
        <div className="inline-flex items-center gap-1.5 rounded-lg bg-muted/60 px-3 py-1 text-xs font-medium text-muted-foreground border border-border/50">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-primary/80" aria-hidden="true" />
          <span>{localizedLocation}</span>
        </div>
      )}

      {/* Completion Date (strictly when completed and completionDate exists) */}
      {project.status === 'completed' && formattedCompletionDate && (
        <div className="inline-flex items-center gap-1.5 rounded-lg bg-muted/60 px-3 py-1 text-xs font-medium text-muted-foreground border border-border/50">
          <Calendar className="h-3.5 w-3.5 shrink-0 text-muted-foreground/80" aria-hidden="true" />
          <span>
            {t('projectDetail.metadata.completionDate')}: {formattedCompletionDate}
          </span>
        </div>
      )}
    </div>
  );
}
