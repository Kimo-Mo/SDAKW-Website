'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Search, X, RotateCcw } from 'lucide-react';

import type { ProductsFilterState, ProductCategory } from '@/types/admin';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ProductsFiltersProps {
  filters: ProductsFilterState;
  onFilterChange: (updates: Partial<ProductsFilterState>) => void;
  onClearFilters: () => void;
}

export function ProductsFilters({ filters, onFilterChange, onClearFilters }: ProductsFiltersProps) {
  const t = useTranslations('admin.products.filters');
  const tProducts = useTranslations('admin.products');
  const [prevSearchProp, setPrevSearchProp] = useState(filters.search);
  const [searchInput, setSearchInput] = useState(filters.search);

  // Adjust state during render when filters.search changes externally (e.g. on Clear)
  if (filters.search !== prevSearchProp) {
    setPrevSearchProp(filters.search);
    setSearchInput(filters.search);
  }

  // Debounce search input by 300ms
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== filters.search) {
        onFilterChange({ search: searchInput });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput, filters.search, onFilterChange]);

  const hasActiveFilters =
    filters.search.length > 0 ||
    filters.category !== 'all' ||
    filters.published !== 'all';

  const categoryOptions = [
    { value: 'all', label: t('allCategories') },
    { value: 'natural_granite', label: t('natural_granite') },
    { value: 'natural_stone', label: t('natural_stone') },
    { value: 'natural_marble', label: t('natural_marble') },
    { value: 'quartz_industrial', label: t('quartz_industrial') },
  ];

  const publishedOptions = [
    { value: 'all', label: t('allPublished') },
    { value: 'published', label: t('isPublished') },
    { value: 'unpublished', label: t('isDraft') },
  ];

  return (
    <div className="flex flex-col gap-3.5 rounded-xl border border-border bg-card p-4 shadow-xs">
      {/* Top row: Search bar & Clear button */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute inset-s-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <Input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder={tProducts('searchPlaceholder')}
            className="ps-9 pe-9 text-sm"
            aria-label="Search products"
          />
          {searchInput.length > 0 && (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => {
                setSearchInput('');
                onFilterChange({ search: '' });
              }}
              className="absolute inset-e-1.5 top-1/2 h-6 w-6 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              aria-label="Clear search">
              <X className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>

        {hasActiveFilters && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClearFilters}
            className="gap-1.5 text-xs text-muted-foreground hover:text-foreground shrink-0">
            <RotateCcw className="h-3.5 w-3.5" />
            <span>{t('clear')}</span>
          </Button>
        )}
      </div>

      {/* Bottom row: Filter Dropdowns with Labels */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Category Filter */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="filter-category" className="text-xs font-semibold text-foreground">
            {t('category')}
          </Label>
          <Select
            value={filters.category}
            onValueChange={(val) =>
              onFilterChange({
                category: val as 'all' | ProductCategory,
              })
            }>
            <SelectTrigger
              id="filter-category"
              size="sm"
              className="h-8.5 text-xs font-medium w-full"
              aria-label={t('category')}>
              <SelectValue>
                {categoryOptions.find((opt) => opt.value === filters.category)?.label}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {categoryOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Published Filter */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="filter-published" className="text-xs font-semibold text-foreground">
            {t('published')}
          </Label>
          <Select
            value={filters.published}
            onValueChange={(val) =>
              onFilterChange({
                published: val as 'all' | 'published' | 'unpublished',
              })
            }>
            <SelectTrigger
              id="filter-published"
              size="sm"
              className="h-8.5 text-xs font-medium w-full"
              aria-label={t('published')}>
              <SelectValue>
                {publishedOptions.find((opt) => opt.value === filters.published)?.label}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {publishedOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
