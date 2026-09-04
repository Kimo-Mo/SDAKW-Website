'use client';

import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient, keepPreviousData } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { Boxes, Plus, RefreshCw, RotateCcw } from 'lucide-react';

import type { BackendProduct, ProductsFilterState } from '@/types/admin';
import { getAdminProducts, deleteAdminProduct } from '@/lib/api/products';
import { toast } from '@/components/ui/toast';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from '@/i18n/navigation';

import { ProductsHeader } from './products-header';
import { ProductsFilters } from './products-filters';
import { ProductsTable } from './products-table';
import { ProductsCardList } from './products-card-list';
import { ProductsPagination } from './products-pagination';
import { ProductDeleteDialog } from './product-delete-dialog';

const INITIAL_FILTERS: ProductsFilterState = {
  search: '',
  category: 'all',
  published: 'all',
  limit: 10,
  page: 1,
};

export function ProductsManager() {
  const t = useTranslations('admin.products');
  const queryClient = useQueryClient();

  const [filters, setFilters] = useState<ProductsFilterState>(INITIAL_FILTERS);
  const [deleteTarget, setDeleteTarget] = useState<BackendProduct | null>(null);

  // Compute clean query arguments
  const queryArgs = {
    page: filters.page,
    limit: filters.limit,
    search: filters.search.trim() ? filters.search.trim() : undefined,
    category: filters.category === 'all' ? undefined : filters.category,
    published: filters.published === 'all' ? undefined : filters.published === 'published',
  };

  // Fetch products with server-side pagination & filters
  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ['admin', 'products', queryArgs],
    queryFn: () => getAdminProducts(queryArgs),
    placeholderData: keepPreviousData,
    staleTime: 30_000,
  });

  const products = data?.products ?? [];
  const pagination = data?.pagination ?? {
    page: filters.page,
    limit: filters.limit,
    total: 0,
    totalPages: 1,
  };

  // Filter change handler (automatically resets to page 1)
  const handleFilterChange = useCallback((updates: Partial<ProductsFilterState>) => {
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

  // Product deletion mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteAdminProduct(id),
    onSuccess: () => {
      // Invalidate product list
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });

      // If this was the only product on a page > 1, step back
      if (products.length === 1 && filters.page > 1) {
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
    filters.category !== 'all' ||
    filters.published !== 'all';

  const isDatabaseEmpty = !hasActiveFilters && pagination.total === 0 && !isLoading;
  const isFilteredEmpty = hasActiveFilters && pagination.total === 0 && !isLoading;

  return (
    <div className="flex flex-col gap-6">
      {/* Page Header */}
      <ProductsHeader />

      {/* Search & Filters */}
      <ProductsFilters
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
              <Boxes className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-heading font-semibold text-base text-foreground mb-1">
              {t('empty.noProductsTitle')}
            </h3>
            <p className="text-xs text-muted-foreground max-w-sm mb-5">
              {t('empty.noProductsDesc')}
            </p>
            <Link
              href="/admin/products/new"
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
          <ProductsTable
            products={products}
            isLoading={isLoading}
            onDelete={(product) => setDeleteTarget(product)}
          />

          <ProductsCardList
            products={products}
            isLoading={isLoading}
            onDelete={(product) => setDeleteTarget(product)}
          />

          {/* Pagination Controls */}
          <ProductsPagination
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
      <ProductDeleteDialog
        isOpen={Boolean(deleteTarget)}
        product={deleteTarget}
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
