'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import type { ProjectMetadataBarProps } from '@/types/public';
import { cn } from '@/lib/utils';

/**
 * Metadata strip for the public project detail page, in the About page's
 * editorial language: hairline-bounded rows of minimal --font-mono labels.
 * Displays project type, execution status, location, government entity
 * (strictly for government projects), and completion date (strictly when
 * completed) — no colored badge pills.
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
          if (Number.isNaN(date.getTime())) return null;
          return {
            year: String(date.getFullYear()),
            month: date.toLocaleDateString(locale === 'ar' ? 'ar-KW' : 'en-US', {
              month: 'long',
            }),
          };
        } catch {
          return null;
        }
      })()
    : null;

  const typeLabel =
    project.projectType === 'government'
      ? t('projectDetail.metadata.projectType.government')
      : t('projectDetail.metadata.projectType.private');

  const statusLabel =
    project.status === 'ongoing'
      ? t('projectDetail.metadata.status.ongoing')
      : t('projectDetail.metadata.status.completed');

  const entries: Array<{ id: string; label: string; value: React.ReactNode }> = [
    { id: 'type', label: t('projectDetail.metadata.projectTypeLabel'), value: typeLabel },
    { id: 'status', label: t('projectDetail.metadata.statusLabel'), value: statusLabel },
  ];

  if (localizedLocation) {
    entries.push({
      id: 'location',
      label: t('projectDetail.metadata.location'),
      value: localizedLocation,
    });
  }

  // Government entity attribution — strictly for government projects
  if (project.projectType === 'government' && localizedGovernmentEntity) {
    entries.push({
      id: 'governmentEntity',
      label: t('projectDetail.metadata.governmentEntity'),
      value: localizedGovernmentEntity,
    });
  }

  // Completion Date — strictly when completed and completionDate exists;
  // year emphasized in --font-mono per the editorial direction
  if (project.status === 'completed' && formattedCompletionDate) {
    entries.push({
      id: 'completionDate',
      label: t('projectDetail.metadata.completionDate'),
      value: (
        <>
          <span className="font-mono rtl:font-sans text-base font-semibold text-foreground">
            {formattedCompletionDate.year}
          </span>
          <span className="ms-1.5">{formattedCompletionDate.month}</span>
        </>
      ),
    });
  }

  return (
    <dl
      className={cn(
        'grid grid-cols-2 gap-x-6 gap-y-0 border-y border-border py-1 text-start sm:grid-cols-3 lg:grid-cols-5',
        className
      )}>
      {entries.map((entry) => (
        <div
          key={entry.id}
          className="flex flex-col gap-1 px-1 py-3 sm:px-4">
          <dt className="text-xs font-mono rtl:font-sans font-semibold uppercase tracking-wider rtl:tracking-normal text-muted-foreground">
            {entry.label}
          </dt>
          <dd className="text-sm font-medium text-foreground">{entry.value}</dd>
        </div>
      ))}
    </dl>
  );
}
