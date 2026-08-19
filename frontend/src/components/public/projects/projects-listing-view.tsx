'use client';

import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter, usePathname } from '@/i18n/navigation';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getPublicProjects } from '@/lib/api/public-projects';
import { ProjectsHeader } from './projects-header';
import { ProjectsFilters } from './projects-filters';
import { ProjectsGrid } from './projects-grid';
import { ProjectsPagination } from './projects-pagination';
import type {
  ProjectStatusFilter,
  ProjectTypeFilter,
  ProjectsListingViewProps,
  PublicProjectsQueryParams,
} from '@/types/public';

const PAGE_SIZE = 9;

/**
 * Public Projects Listing View Orchestrator:
 * - Server data dehydration & TanStack Query cache synchronization
 * - URL search params deep-linking & browser history synchronization
 * - Filter transitions with keepPreviousData for race-condition prevention
 * - Automatic page clamping for out-of-range URLs
 * - Smooth scroll on pagination
 */
export function ProjectsListingView({
  initialData,
  locale,
}: ProjectsListingViewProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const gridSectionRef = useRef<HTMLDivElement>(null);

  // 1. Parse and sanitize search params from URL
  const activeType: ProjectTypeFilter = useMemo(() => {
    const raw = searchParams.get('projectType');
    if (raw === 'government' || raw === 'private') {
      return raw;
    }
    return 'all';
  }, [searchParams]);

  const activeStatus: ProjectStatusFilter = useMemo(() => {
    const raw = searchParams.get('status');
    if (raw === 'ongoing' || raw === 'completed') {
      return raw;
    }
    return 'all';
  }, [searchParams]);

  const activePage: number = useMemo(() => {
    const raw = searchParams.get('page');
    if (raw) {
      const parsed = parseInt(raw, 10);
      if (!isNaN(parsed) && parsed >= 1) {
        return parsed;
      }
    }
    return 1;
  }, [searchParams]);

  // 2. Derive API query parameters
  const queryParams: PublicProjectsQueryParams = useMemo(() => {
    const params: PublicProjectsQueryParams = {
      page: activePage,
      limit: PAGE_SIZE,
    };
    if (activeType !== 'all') {
      params.projectType = activeType;
    }
    if (activeStatus !== 'all') {
      params.status = activeStatus;
    }
    return params;
  }, [activeType, activeStatus, activePage]);

  // Is this the default initial view (page 1, all filters)?
  const isDefaultView = activeType === 'all' && activeStatus === 'all' && activePage === 1;

  // 3. TanStack Query Server State
  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['public-projects', queryParams],
    queryFn: () => getPublicProjects(queryParams),
    initialData: isDefaultView ? initialData : undefined,
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const projects = data?.projects ?? [];
  const pagination = data?.pagination ?? {
    total: initialData?.pagination?.total ?? 0,
    page: activePage,
    limit: PAGE_SIZE,
    totalPages: initialData?.pagination?.totalPages ?? 1,
  };

  const hasActiveFilters = activeType !== 'all' || activeStatus !== 'all';

  // 4. Update URL Search Parameters
  const updateUrlParams = useCallback(
    (newParams: { type?: ProjectTypeFilter; status?: ProjectStatusFilter; page?: number }) => {
      const params = new URLSearchParams(searchParams.toString());

      const nextType = newParams.type !== undefined ? newParams.type : activeType;
      const nextStatus = newParams.status !== undefined ? newParams.status : activeStatus;
      const nextPage = newParams.page !== undefined ? newParams.page : 1;

      if (nextType && nextType !== 'all') {
        params.set('projectType', nextType);
      } else {
        params.delete('projectType');
      }

      if (nextStatus && nextStatus !== 'all') {
        params.set('status', nextStatus);
      } else {
        params.delete('status');
      }

      if (nextPage && nextPage > 1) {
        params.set('page', nextPage.toString());
      } else {
        params.delete('page');
      }

      const queryString = params.toString();
      const nextUrl = queryString ? `${pathname}?${queryString}` : pathname;
      router.push(nextUrl, { scroll: false });
    },
    [activeType, activeStatus, pathname, router, searchParams]
  );

  // 5. Page Clamping: if URL has ?page=999, clamp to totalPages when data loads (finding E2 / T014)
  useEffect(() => {
    if (data?.pagination?.totalPages && data.pagination.totalPages > 0) {
      if (activePage > data.pagination.totalPages) {
        updateUrlParams({ page: data.pagination.totalPages });
      }
    }
  }, [data?.pagination?.totalPages, activePage, updateUrlParams]);

  // 6. Filter Handlers
  const handleTypeChange = (type: ProjectTypeFilter) => {
    updateUrlParams({ type, page: 1 });
  };

  const handleStatusChange = (status: ProjectStatusFilter) => {
    updateUrlParams({ status, page: 1 });
  };

  const handleResetFilters = () => {
    updateUrlParams({ type: 'all', status: 'all', page: 1 });
  };

  const handlePageChange = (newPage: number) => {
    updateUrlParams({ page: newPage });
    if (gridSectionRef.current) {
      gridSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="flex w-full flex-col">
      {/* Portfolio Header */}
      <ProjectsHeader
        totalProjects={pagination.total}
      />

      {/* Main Content Area */}
      <div
        ref={gridSectionRef}
        className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-16 space-y-8"
      >
        {/* Filters Bar */}
        <ProjectsFilters
          selectedType={activeType}
          selectedStatus={activeStatus}
          onTypeChange={handleTypeChange}
          onStatusChange={handleStatusChange}
          onResetFilters={handleResetFilters}
          hasActiveFilters={hasActiveFilters}
          totalResults={pagination.total}
        />

        {/* Projects Grid with All Observable States */}
        <ProjectsGrid
          projects={projects}
          isLoading={isLoading && !data}
          isError={isError}
          onRetry={() => refetch()}
          onResetFilters={handleResetFilters}
          hasActiveFilters={hasActiveFilters}
          locale={locale}
        />

        {/* Pagination Controls */}
        <ProjectsPagination
          currentPage={activePage}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
          locale={locale}
        />
      </div>
    </div>
  );
}
