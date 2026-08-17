'use client';

import { useLocale, useTranslations } from 'next-intl';
import { Edit, Trash2, Star, Image as ImageIcon, MapPin, Building2 } from 'lucide-react';
import Image from 'next/image';

import type { BackendProject } from '@/types/admin';
import type { Locale } from '@/i18n/routing';
import { Link } from '@/i18n/navigation';
import { Badge } from '@/components/ui/badge';
import { Button, buttonVariants } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface ProjectsTableProps {
  projects: BackendProject[];
  isLoading: boolean;
  onDelete: (project: BackendProject) => void;
}

export function ProjectsTable({ projects, isLoading, onDelete }: ProjectsTableProps) {
  const t = useTranslations('admin.projects');
  const locale = useLocale() as Locale;

  if (isLoading) {
    return (
      <div className="hidden lg:block overflow-hidden rounded-xl border border-border bg-card shadow-xs">
        <div className="divide-y divide-border">
          <div className="flex h-11 items-center bg-muted/40 px-6">
            <Skeleton className="h-4 w-full" />
          </div>
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex h-16 items-center gap-4 px-6">
              <Skeleton className="h-10 w-14 rounded-md shrink-0" />
              <div className="flex-1 space-y-1.5">
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-3 w-32" />
              </div>
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="h-5 w-16 rounded-full" />
              <div className="flex gap-2">
                <Skeleton className="h-8 w-8 rounded-lg" />
                <Skeleton className="h-8 w-8 rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="hidden lg:block overflow-hidden rounded-xl border border-border bg-card shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-start text-sm">
          <thead className="border-b border-border bg-muted/40 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            <tr>
              <th scope="col" className="px-5 py-3 text-start w-16">
                {t('table.cover')}
              </th>
              <th scope="col" className="px-5 py-3 text-start">
                {t('table.project')}
              </th>
              <th scope="col" className="px-4 py-3 text-start w-32">
                {t('table.type')}
              </th>
              <th scope="col" className="px-4 py-3 text-start w-32">
                {t('table.status')}
              </th>
              <th scope="col" className="px-4 py-3 text-start w-36">
                {t('table.visibility')}
              </th>
              <th scope="col" className="px-5 py-3 text-end w-28">
                {t('table.actions')}
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/70 text-foreground">
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
                <tr key={project._id} className="hover:bg-accent/40 transition-colors group">
                  {/* Thumbnail */}
                  <td className="px-5 py-3.5 align-middle">
                    <div className="relative flex h-11 w-16 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted border border-border/80">
                      {project.coverImage?.url ? (
                        <Image
                          src={project.coverImage.url}
                          alt={displayTitle}
                          fill
                          sizes="64px"
                          className="object-cover"
                        />
                      ) : (
                        <ImageIcon className="h-4 w-4 text-muted-foreground/60" />
                      )}
                    </div>
                  </td>

                  {/* Title & Location / Government Entity */}
                  <td className="px-5 py-3.5 align-middle">
                    <div className="flex flex-col gap-0.5">
                      <Link
                        href={`/admin/projects/${project._id}/edit`}
                        className="font-heading font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                        {displayTitle}
                      </Link>
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        {displayLocation ? (
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="h-3 w-3 shrink-0 text-muted-foreground/70" />
                            <span className="line-clamp-1">{displayLocation}</span>
                          </span>
                        ) : null}
                        {isGovernment && project.governmentEntity ? (
                          <span className="inline-flex items-center gap-1 text-[11px] text-muted-foreground/80">
                            <Building2 className="h-3 w-3 shrink-0" />
                            <span className="line-clamp-1">
                              {locale === 'ar'
                                ? project.governmentEntity.ar || project.governmentEntity.en
                                : project.governmentEntity.en || project.governmentEntity.ar}
                            </span>
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </td>

                  {/* Project Type Badge */}
                  <td className="px-4 py-3.5 align-middle">
                    <Badge
                      variant={isGovernment ? 'default' : 'secondary'}
                      className="text-[11px] font-medium">
                      {isGovernment ? t('badges.government') : t('badges.private')}
                    </Badge>
                  </td>

                  {/* Status Badge */}
                  <td className="px-4 py-3.5 align-middle">
                    <Badge
                      variant={isOngoing ? 'outline' : 'secondary'}
                      className={`text-[11px] font-medium ${
                        isOngoing
                          ? 'border-amber-500/30 text-amber-600 dark:text-amber-400 bg-amber-500/10'
                          : 'border-emerald-500/30 text-emerald-600 dark:text-emerald-400 bg-emerald-500/10'
                      }`}>
                      {isOngoing ? t('badges.ongoing') : t('badges.completed')}
                    </Badge>
                  </td>

                  {/* Visibility Badges (Published & Featured) */}
                  <td className="px-4 py-3.5 align-middle">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <Badge
                        variant={project.published ? 'default' : 'ghost'}
                        className={`text-[11px] ${
                          project.published
                            ? 'bg-emerald-600 text-white dark:bg-emerald-600'
                            : 'border border-border text-muted-foreground'
                        }`}>
                        {project.published ? t('badges.published') : t('badges.draft')}
                      </Badge>

                      {project.featured && (
                        <span
                          className="inline-flex items-center gap-0.5 rounded-md bg-amber-500/15 px-1.5 py-0.5 text-[10px] font-semibold text-amber-600 dark:text-amber-400"
                          title={t('badges.featured')}>
                          <Star className="h-2.5 w-2.5 fill-current" />
                          <span>{t('badges.featured')}</span>
                        </span>
                      )}
                    </div>
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-3.5 align-middle text-end">
                    <div className="inline-flex items-center justify-end gap-1.5">
                      <Link
                        href={`/admin/projects/${project._id}/edit`}
                        className={buttonVariants({
                          variant: 'ghost',
                          size: 'icon',
                          className: 'h-8 w-8 text-muted-foreground hover:text-foreground',
                        })}
                        aria-label={`${t('table.edit')} ${displayTitle}`}>
                        <Edit className="h-4 w-4" />
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDelete(project)}
                        className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                        aria-label={`${t('table.delete')} ${displayTitle}`}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
