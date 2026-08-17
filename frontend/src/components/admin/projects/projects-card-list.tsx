'use client';

import { useLocale, useTranslations } from 'next-intl';
import { Edit, Trash2, Star, Image as ImageIcon, MapPin, Building2 } from 'lucide-react';
import Image from 'next/image';

import type { BackendProject } from '@/types/admin';
import type { Locale } from '@/i18n/routing';
import { Link } from '@/i18n/navigation';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface ProjectsCardListProps {
  projects: BackendProject[];
  isLoading: boolean;
  onDelete: (project: BackendProject) => void;
}

export function ProjectsCardList({ projects, isLoading, onDelete }: ProjectsCardListProps) {
  const t = useTranslations('admin.projects');
  const locale = useLocale() as Locale;

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3 lg:hidden">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="border border-border/80 p-4 shadow-xs">
            <div className="flex items-start gap-3">
              <Skeleton className="h-16 w-20 rounded-lg shrink-0" />
              <div className="flex-1 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <div className="flex gap-1.5 pt-1">
                  <Skeleton className="h-5 w-16 rounded-full" />
                  <Skeleton className="h-5 w-16 rounded-full" />
                </div>
              </div>
            </div>
            <div className="mt-3 flex justify-end gap-2 border-t border-border/60 pt-3">
              <Skeleton className="h-8 w-20 rounded-md" />
              <Skeleton className="h-8 w-20 rounded-md" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 lg:hidden">
      {projects.map((project) => {
        const displayTitle =
          locale === 'ar'
            ? project.title?.ar || project.title?.en || ''
            : project.title?.en || project.title?.ar || '';

        const displayLocation =
          locale === 'ar'
            ? project.location?.ar || project.location?.en
            : project.location?.en || project.location?.ar;

        const isGovernment = project.projectType === 'government';
        const isOngoing = project.status === 'ongoing';

        return (
          <Card
            key={project._id}
            className="border border-border/80 bg-card shadow-xs transition-shadow hover:shadow-md">
            <CardContent className="p-4">
              {/* Header area with Thumbnail & Title */}
              <div className="flex items-start gap-3.5">
                <div className="relative flex h-16 w-20 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-muted border border-border/80">
                  {project.coverImage?.url ? (
                    <Image
                      src={project.coverImage.url}
                      alt={displayTitle}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  ) : (
                    <ImageIcon className="h-5 w-5 text-muted-foreground/60" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-1">
                    <Link
                      href={`/admin/projects/${project._id}/edit`}
                      className="font-heading font-semibold text-sm text-foreground hover:text-primary transition-colors line-clamp-1">
                      {displayTitle}
                    </Link>
                    {project.featured && (
                      <span
                        className="inline-flex items-center gap-0.5 rounded-md bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-amber-600 dark:text-amber-400 shrink-0"
                        title={t('badges.featured')}>
                        <Star className="h-2.5 w-2.5 fill-current" />
                      </span>
                    )}
                  </div>

                  <div className="flex flex-col gap-0.5 mt-1 text-xs text-muted-foreground">
                    {displayLocation && (
                      <span className="inline-flex items-center gap-1 line-clamp-1">
                        <MapPin className="h-3 w-3 shrink-0 text-muted-foreground/70" />
                        <span>{displayLocation}</span>
                      </span>
                    )}
                    {isGovernment && project.governmentEntity && (
                      <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground/80 line-clamp-1">
                        <Building2 className="h-3 w-3 shrink-0" />
                        <span>
                          {locale === 'ar'
                            ? project.governmentEntity.ar || project.governmentEntity.en
                            : project.governmentEntity.en || project.governmentEntity.ar}
                        </span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Badges Cluster */}
              <div className="mt-3 flex flex-wrap items-center gap-1.5">
                <Badge
                  variant={isGovernment ? 'default' : 'secondary'}
                  className="text-[10px] font-medium">
                  {isGovernment ? t('badges.government') : t('badges.private')}
                </Badge>

                <Badge
                  variant={isOngoing ? 'outline' : 'secondary'}
                  className={`text-[10px] font-medium ${
                    isOngoing
                      ? 'border-amber-500/30 text-amber-600 dark:text-amber-400 bg-amber-500/10'
                      : 'border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10'
                  }`}>
                  {isOngoing ? t('badges.ongoing') : t('badges.completed')}
                </Badge>

                <Badge
                  variant={project.published ? 'default' : 'ghost'}
                  className={`text-[10px] ${
                    project.published
                      ? 'bg-emerald-600 text-white dark:bg-emerald-600'
                      : 'border border-border text-muted-foreground'
                  }`}>
                  {project.published ? t('badges.published') : t('badges.draft')}
                </Badge>
              </div>

              {/* Action Buttons Footer */}
              <div className="mt-3.5 flex items-center justify-end gap-2 border-t border-border/60 pt-3">
                <Link
                  href={`/admin/projects/${project._id}/edit`}
                  className={buttonVariants({
                    variant: 'outline',
                    size: 'sm',
                    className: 'gap-1.5 text-xs h-8',
                  })}>
                  <Edit className="h-3.5 w-3.5" />
                  <span>{t('table.edit')}</span>
                </Link>

                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDelete(project)}
                  className="gap-1.5 text-xs h-8">
                  <Trash2 className="h-3.5 w-3.5" />
                  <span>{t('table.delete')}</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
