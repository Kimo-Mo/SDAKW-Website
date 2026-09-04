'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { ProductCategoryFilter } from '@/types/public';

interface ProductsFiltersProps {
  selectedCategory: ProductCategoryFilter;
  onCategoryChange: (category: ProductCategoryFilter) => void;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
  totalResults?: number;
}

/**
 * Filter bar for public products catalog.
 * Uses shadcn Select with visible Label, translated selected label in trigger,
 * results counter, and Clear Filters button.
 */
export function ProductsFilters({
  selectedCategory,
  onCategoryChange,
  onResetFilters,
  hasActiveFilters,
  totalResults,
}: ProductsFiltersProps) {
  const t = useTranslations('public.productsPage.filters');

  const categoryOptions: Array<{
    value: ProductCategoryFilter;
    label: string;
  }> = [
    { value: 'all', label: t('allCategories') },
    { value: 'natural_granite', label: t('natural_granite') },
    { value: 'natural_stone', label: t('natural_stone') },
    { value: 'natural_marble', label: t('natural_marble') },
    { value: 'quartz_industrial', label: t('quartz_industrial') },
  ];

  return (
    <div className="border border-border bg-card p-4 sm:p-6 shadow-xs space-y-4 text-start">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        {/* Category Select Filter with visible Label */}
        <div className="flex flex-col gap-1.5 w-full sm:w-auto">
          <Label
            htmlFor="public-product-category-filter"
            className="text-xs font-mono rtl:font-sans font-semibold tracking-wider rtl:tracking-normal text-muted-foreground uppercase">
            {t('categoryLabel')}
          </Label>
          <Select
            value={selectedCategory}
            onValueChange={(val) => onCategoryChange(val as ProductCategoryFilter)}>
            <SelectTrigger
              id="public-product-category-filter"
              size="sm"
              className="h-9 rounded-none text-xs font-medium w-full sm:w-64 border-border bg-background"
              aria-label={t('categoryLabel')}>
              <SelectValue>
                {categoryOptions.find((opt) => opt.value === selectedCategory)?.label}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {categoryOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value} className="text-xs">
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Results Counter & Clear Filter Action */}
        <div className="flex items-center gap-3 self-start sm:self-end">
          {typeof totalResults === 'number' && (
            <span className="text-xs font-mono text-muted-foreground">
              {t('showingResults', { count: totalResults })}
            </span>
          )}

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onResetFilters}
              className="h-9 gap-1.5 px-3 rounded-none text-xs font-mono rtl:font-sans uppercase tracking-wider rtl:tracking-normal text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer">
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{t('clearFilters')}</span>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
