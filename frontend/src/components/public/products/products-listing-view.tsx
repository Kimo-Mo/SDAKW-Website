'use client';

import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter, usePathname } from '@/i18n/navigation';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { getPublicProducts } from '@/lib/api/public-products';
import { ProductsHeader } from './products-header';
import { ProductsFilters } from './products-filters';
import { ProductsGrid } from './products-grid';
import { ProductsPagination } from './products-pagination';
import type {
  ProductCategoryFilter,
  ProductsListingViewProps,
  PublicProductsQueryParams,
} from '@/types/public';

const PAGE_SIZE = 9;

const VALID_CATEGORIES: ProductCategoryFilter[] = [
  'natural_granite',
  'natural_stone',
  'natural_marble',
  'quartz_industrial',
];

/**
 * Public Products Listing View Orchestrator:
 * - Server data dehydration & TanStack Query cache synchronization
 * - URL search params deep-linking (category, page)
 * - Filter transitions with keepPreviousData for race-condition prevention
 * - Automatic page clamping for out-of-range URLs
 * - Smooth scroll on pagination
 */
export function ProductsListingView({
  initialData,
  locale,
}: ProductsListingViewProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const gridSectionRef = useRef<HTMLDivElement>(null);

  // 1. Parse and sanitize search params from URL
  const activeCategory: ProductCategoryFilter = useMemo(() => {
    const raw = searchParams.get('category');
    if (raw && VALID_CATEGORIES.includes(raw as ProductCategoryFilter)) {
      return raw as ProductCategoryFilter;
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
  const queryParams: PublicProductsQueryParams = useMemo(() => {
    const params: PublicProductsQueryParams = {
      page: activePage,
      limit: PAGE_SIZE,
    };
    if (activeCategory !== 'all') {
      params.category = activeCategory;
    }
    return params;
  }, [activeCategory, activePage]);

  // Is this the default initial view (page 1, all categories)?
  const isDefaultView = activeCategory === 'all' && activePage === 1;

  // 3. TanStack Query Server State
  const {
    data,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ['public-products', queryParams],
    queryFn: () => getPublicProducts(queryParams),
    initialData: isDefaultView ? initialData : undefined,
    placeholderData: keepPreviousData,
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const products = data?.products ?? [];
  const pagination = data?.pagination ?? {
    total: initialData?.pagination?.total ?? 0,
    page: activePage,
    limit: PAGE_SIZE,
    totalPages: initialData?.pagination?.totalPages ?? 1,
  };

  const hasActiveFilters = activeCategory !== 'all';

  // 4. Update URL Search Parameters
  const updateUrlParams = useCallback(
    (newParams: {
      category?: ProductCategoryFilter;
      page?: number;
    }) => {
      const params = new URLSearchParams(searchParams.toString());

      const nextCategory =
        newParams.category !== undefined ? newParams.category : activeCategory;
      const nextPage = newParams.page !== undefined ? newParams.page : 1;

      if (nextCategory && nextCategory !== 'all') {
        params.set('category', nextCategory);
      } else {
        params.delete('category');
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
    [activeCategory, pathname, router, searchParams]
  );

  // 5. Page Clamping: if URL has ?page=999, clamp to totalPages when data loads
  useEffect(() => {
    if (data?.pagination?.totalPages && data.pagination.totalPages > 0) {
      if (activePage > data.pagination.totalPages) {
        updateUrlParams({ page: data.pagination.totalPages });
      }
    }
  }, [data?.pagination?.totalPages, activePage, updateUrlParams]);

  // 6. Filter Handlers
  const handleCategoryChange = (category: ProductCategoryFilter) => {
    updateUrlParams({ category, page: 1 });
  };

  const handleResetFilters = () => {
    updateUrlParams({ category: 'all', page: 1 });
  };

  const handlePageChange = (newPage: number) => {
    updateUrlParams({ page: newPage });
    if (gridSectionRef.current) {
      gridSectionRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="flex w-full flex-col">
      {/* Catalog Hero Header */}
      <ProductsHeader totalProducts={pagination.total} />

      {/* Main Content Area */}
      <div
        ref={gridSectionRef}
        className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-16 space-y-8">
        {/* Filters Bar */}
        <ProductsFilters
          selectedCategory={activeCategory}
          onCategoryChange={handleCategoryChange}
          onResetFilters={handleResetFilters}
          hasActiveFilters={hasActiveFilters}
          totalResults={pagination.total}
        />

        {/* Products Grid with Staggered Entrance */}
        <ProductsGrid
          products={products}
          isLoading={isLoading && !data}
          isError={isError}
          onRetry={() => refetch()}
          onResetFilters={handleResetFilters}
          hasActiveFilters={hasActiveFilters}
          locale={locale}
        />

        {/* Pagination Controls */}
        <ProductsPagination
          currentPage={activePage}
          totalPages={pagination.totalPages}
          onPageChange={handlePageChange}
          locale={locale}
        />
      </div>
    </div>
  );
}
