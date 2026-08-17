'use client';

import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { Search, X, RotateCcw } from 'lucide-react';

import type { ProjectsFilterState, ProjectType, ProjectStatus } from '@/types/admin';
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

interface ProjectsFiltersProps {
  filters: ProjectsFilterState;
  onFilterChange: (updates: Partial<ProjectsFilterState>) => void;
  onClearFilters: () => void;
}

export function ProjectsFilters({ filters, onFilterChange, onClearFilters }: ProjectsFiltersProps) {
  const t = useTranslations('admin.projects.filters');
  const tProjects = useTranslations('admin.projects');
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
    filters.projectType !== 'all' ||
    filters.status !== 'all' ||
    filters.published !== 'all' ||
    filters.featured !== 'all';

  const typeOptions = [
    { value: 'all', label: t('allTypes') },
    { value: 'government', label: t('government') },
    { value: 'private', label: t('private') },
  ];

  const statusOptions = [
    { value: 'all', label: t('allStatuses') },
    { value: 'ongoing', label: t('ongoing') },
    { value: 'completed', label: t('completed') },
  ];

  const publishedOptions = [
    { value: 'all', label: t('allPublished') },
    { value: 'published', label: t('isPublished') },
    { value: 'unpublished', label: t('isDraft') },
  ];

  const featuredOptions = [
    { value: 'all', label: t('allFeatured') },
    { value: 'featured', label: t('isFeatured') },
    { value: 'standard', label: t('isStandard') },
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
            placeholder={tProjects('searchPlaceholder')}
            className="ps-9 pe-9 h-9.5 text-sm"
            aria-label="Search projects"
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
            className="gap-1.5 text-xs text-muted-foreground hover:text-foreground shrink-0 h-9.5">
            <RotateCcw className="h-3.5 w-3.5" />
            <span>{t('clear')}</span>
          </Button>
        )}
      </div>

      {/* Bottom row: Filter Dropdowns with Labels */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {/* Project Type Filter */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="filter-project-type" className="text-xs font-semibold text-foreground">
            {t('type')}
          </Label>
          <Select
            value={filters.projectType}
            onValueChange={(val) =>
              onFilterChange({
                projectType: val as 'all' | ProjectType,
              })
            }>
            <SelectTrigger
              id="filter-project-type"
              size="sm"
              className="h-8.5 text-xs font-medium w-full"
              aria-label={t('type')}>
              <SelectValue>
                {typeOptions.find((opt) => opt.value === filters.projectType)?.label}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {typeOptions.map((opt) => (
                <SelectItem key={opt.value} value={opt.value}>
                  {opt.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Status Filter */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="filter-status" className="text-xs font-semibold text-foreground">
            {t('status')}
          </Label>
          <Select
            value={filters.status}
            onValueChange={(val) =>
              onFilterChange({
                status: val as 'all' | ProjectStatus,
              })
            }>
            <SelectTrigger
              id="filter-status"
              size="sm"
              className="h-8.5 text-xs font-medium w-full"
              aria-label={t('status')}>
              <SelectValue>
                {statusOptions.find((opt) => opt.value === filters.status)?.label}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {statusOptions.map((opt) => (
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

        {/* Featured Filter */}
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="filter-featured" className="text-xs font-semibold text-foreground">
            {t('featured')}
          </Label>
          <Select
            value={filters.featured}
            onValueChange={(val) =>
              onFilterChange({
                featured: val as 'all' | 'featured' | 'standard',
              })
            }>
            <SelectTrigger
              id="filter-featured"
              size="sm"
              className="h-8.5 text-xs font-medium w-full"
              aria-label={t('featured')}>
              <SelectValue>
                {featuredOptions.find((opt) => opt.value === filters.featured)?.label}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {featuredOptions.map((opt) => (
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
