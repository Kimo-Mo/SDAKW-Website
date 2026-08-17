'use client';

import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { FolderKanban, Plus, RefreshCw, RotateCcw } from 'lucide-react';

import type { BackendProject, ProjectsFilterState } from '@/types/admin';
import { getAdminProjects, deleteAdminProject } from '@/lib/api/projects';
import { toast } from '@/components/ui/toast';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from '@/i18n/navigation';

import { ProjectsHeader } from './projects-header';
import { ProjectsFilters } from './projects-filters';
import { ProjectsTable } from './projects-table';
import { ProjectsCardList } from './projects-card-list';
import { ProjectsPagination } from './projects-pagination';
import { ProjectDeleteDialog } from './project-delete-dialog';

const INITIAL_FILTERS: ProjectsFilterState = {
  search: '',
  projectType: 'all',
  status: 'all',
  published: 'all',
  featured: 'all',
  limit: 10,
  page: 1,
};

export function ProjectsManager() {
  const t = useTranslations('admin.projects');
  const queryClient = useQueryClient();

  const [filters, setFilters] = useState<ProjectsFilterState>(INITIAL_FILTERS);
  const [deleteTarget, setDeleteTarget] = useState<BackendProject | null>(null);

  // Compute clean query arguments
  const queryArgs = {
    page: filters.page,
    limit: filters.limit,
    search: filters.search.trim() ? filters.search.trim() : undefined,
    status: filters.status === 'all' ? undefined : filters.status,
    projectType: filters.projectType === 'all' ? undefined : filters.projectType,
    published: filters.published === 'all' ? undefined : filters.published === 'published',
    featured: filters.featured === 'all' ? undefined : filters.featured === 'featured',
  };

  // Fetch projects with server-side pagination & filters
  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ['admin', 'projects', queryArgs],
    queryFn: () => getAdminProjects(queryArgs),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });

  const projects = data?.projects ?? [];
  const pagination = data?.pagination ?? {
    page: filters.page,
    limit: filters.limit,
    total: 0,
    totalPages: 1,
  };

  // Filter change handler (automatically resets to page 1)
  const handleFilterChange = useCallback((updates: Partial<ProjectsFilterState>) => {
    setFilters((prev) => ({
      ...prev,
      ...updates,
      page: updates.page !== undefined ? updates.page : 1,
    }));
  }, []);

  const handleClearFilters = useCallback(() => {
    setFilters({
      ...INITIAL_FILTERS,
      limit: filters.limit, // preserve current page size preference
    });
  }, [filters.limit]);

  // Project deletion mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteAdminProject(id),
    onSuccess: () => {
      // Invalidate project list and summary statistics
      queryClient.invalidateQueries({ queryKey: ['admin', 'projects'] });
      queryClient.invalidateQueries({ queryKey: ['admin', 'projects', 'summary'] });

      // If this was the only project on a page > 1, step back
      if (projects.length === 1 && filters.page > 1) {
        setFilters((prev) => ({ ...prev, page: prev.page - 1 }));
      }

      toast.add({
        title: t('toasts.deleteSuccess'),
        type: 'success',
      });
      setDeleteTarget(null);
    },
    onError: () => {
      toast.add({
        title: t('toasts.deleteError'),
        type: 'error',
      });
    },
  });

  const hasActiveFilters =
    filters.search.length > 0 ||
    filters.projectType !== 'all' ||
    filters.status !== 'all' ||
    filters.published !== 'all' ||
    filters.featured !== 'all';

  const isDatabaseEmpty = !hasActiveFilters && pagination.total === 0 && !isLoading;
  const isFilteredEmpty = hasActiveFilters && pagination.total === 0 && !isLoading;

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <ProjectsHeader />

      {/* Search & Filters */}
      <ProjectsFilters
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
      />

      {/* Content Canvas */}
      {isError ? (
        /* Isolated Error Banner */
        <Card className="border-destructive/30 bg-destructive/5 shadow-xs">
          <CardContent className="flex flex-col items-center justify-center p-8 text-center">
            <h3 className="font-heading font-semibold text-base text-destructive mb-1">
              {t('error.title')}
            </h3>
            <p className="text-xs text-muted-foreground max-w-md mb-4">{t('error.description')}</p>
            <Button
              variant="outline"
              size="sm"
              onClick={() => refetch()}
              disabled={isFetching}
              className="gap-2 border-destructive/30 hover:bg-destructive/10 text-destructive text-xs">
              <RefreshCw className={`h-3.5 w-3.5 ${isFetching ? 'animate-spin' : ''}`} />
              <span>{t('error.retry')}</span>
            </Button>
          </CardContent>
        </Card>
      ) : isDatabaseEmpty ? (
        /* Empty Database State */
        <Card className="border-dashed border-border/80 bg-card shadow-xs">
          <CardContent className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-3">
              <FolderKanban className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-heading font-semibold text-base text-foreground mb-1">
              {t('empty.noProjectsTitle')}
            </h3>
            <p className="text-xs text-muted-foreground max-w-sm mb-5">
              {t('empty.noProjectsDesc')}
            </p>
            <Link
              href="/admin/projects/new"
              className={buttonVariants({
                variant: 'default',
                size: 'sm',
                className: 'gap-2',
              })}>
              <Plus className="h-4 w-4" />
              <span>{t('empty.createFirst')}</span>
            </Link>
          </CardContent>
        </Card>
      ) : isFilteredEmpty ? (
        /* Empty Filter Results State */
        <Card className="border border-border/70 bg-card shadow-xs">
          <CardContent className="flex flex-col items-center justify-center py-10 px-4 text-center">
            <h3 className="font-heading font-semibold text-base text-foreground mb-1">
              {t('empty.noFilterResultsTitle')}
            </h3>
            <p className="text-xs text-muted-foreground max-w-sm mb-4">
              {t('empty.noFilterResultsDesc')}
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleClearFilters}
              className="gap-2 text-xs">
              <RotateCcw className="h-3.5 w-3.5" />
              <span>{t('filters.clear')}</span>
            </Button>
          </CardContent>
        </Card>
      ) : (
        /* Table & Card Presentation */
        <div className="space-y-4">
          <ProjectsTable
            projects={projects}
            isLoading={isLoading}
            onDelete={(project) => setDeleteTarget(project)}
          />

          <ProjectsCardList
            projects={projects}
            isLoading={isLoading}
            onDelete={(project) => setDeleteTarget(project)}
          />

          {/* Pagination Controls */}
          <ProjectsPagination
            page={pagination.page}
            pages={pagination.totalPages}
            total={pagination.total}
            limit={filters.limit}
            onPageChange={(newPage) => handleFilterChange({ page: newPage })}
            onLimitChange={(newLimit) => handleFilterChange({ limit: newLimit, page: 1 })}
          />
        </div>
      )}

      {/* Delete Confirmation Alert Dialog */}
      <ProjectDeleteDialog
        isOpen={Boolean(deleteTarget)}
        project={deleteTarget}
        isDeleting={deleteMutation.isPending}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) {
            deleteMutation.mutate(deleteTarget._id);
          }
        }}
      />
    </div>
  );
}
