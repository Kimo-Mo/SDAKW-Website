'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Building2, CheckCircle2, Clock, Landmark, Layers, RotateCcw, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import type { ProjectStatusFilter, ProjectTypeFilter, ProjectsFiltersProps } from '@/types/public';
import { cn } from '@/lib/utils';

/**
 * Monolithic three-tier filter bar for public project listings:
 * - Tier 1: Project Classification (All, Government, Private)
 * - Tier 2: Execution Status (All, Ongoing, Completed)
 * - Tier 3: Featured Projects Toggle Filter
 * - Results counter & Clear Filters action
 */
export function ProjectsFilters({
  selectedType,
  selectedStatus,
  isFeaturedOnly,
  onTypeChange,
  onStatusChange,
  onFeaturedChange,
  onResetFilters,
  hasActiveFilters,
  totalResults,
}: ProjectsFiltersProps) {
  const t = useTranslations('public.projectsPage.filters');

  const typeOptions: Array<{
    id: ProjectTypeFilter;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }> = [
    { id: 'all', label: t('allTypes'), icon: Layers },
    { id: 'government', label: t('government'), icon: Landmark },
    { id: 'private', label: t('private'), icon: Building2 },
  ];

  const statusOptions: Array<{
    id: ProjectStatusFilter;
    label: string;
    icon?: React.ComponentType<{ className?: string }>;
  }> = [
    { id: 'all', label: t('allStatuses') },
    { id: 'ongoing', label: t('ongoing'), icon: Clock },
    { id: 'completed', label: t('completed'), icon: CheckCircle2 },
  ];

  return (
    <div className="border border-border bg-card p-4 sm:p-6 shadow-xs space-y-5 text-start">
      {/* Tier 1: Primary Classification Tabs + Results Counter */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-border/60 pb-4">
        <div className="flex flex-col gap-2">
          <Label className="sr-only">{t('typeLabel')}</Label>
          <div
            className="flex items-center gap-1.5 overflow-x-auto scrollbar-none touch-pan-x bg-muted/40 p-1 border border-border max-w-full"
            role="tablist"
            aria-label={t('allTypes')}>
            {typeOptions.map((option) => {
              const isSelected = selectedType === option.id;
              const Icon = option.icon;

              return (
                <Button
                  key={option.id}
                  type="button"
                  role="tab"
                  variant={isSelected ? 'default' : 'ghost'}
                  size="sm"
                  aria-selected={isSelected}
                  onClick={() => onTypeChange(option.id)}
                  className={cn(
                    'h-8.5 rounded-none px-3.5 text-xs font-mono rtl:font-sans uppercase tracking-wider rtl:tracking-normal font-semibold transition-all whitespace-nowrap gap-2 cursor-pointer',
                    isSelected
                      ? 'bg-foreground text-background shadow-xs hover:bg-foreground/90'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  )}>
                  <Icon
                    className={cn(
                      'h-3.5 w-3.5 shrink-0 transition-colors',
                      isSelected ? 'text-background' : 'text-muted-foreground'
                    )}
                    aria-hidden="true"
                  />
                  <span>{option.label}</span>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Counter and Clear Filters Action */}
        <div className="flex items-center gap-3 self-start lg:self-center">
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
              className="h-8 gap-1.5 px-2.5 rounded-none text-xs font-mono rtl:font-sans uppercase tracking-wider rtl:tracking-normal text-muted-foreground hover:text-destructive hover:bg-destructive/10 cursor-pointer">
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{t('clearFilters')}</span>
            </Button>
          )}
        </div>
      </div>

      {/* Tier 2 & 3: Execution Status Chips + Featured Projects Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        {/* Status Chips */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-none touch-pan-x max-w-full">
          <Label className="sr-only">{t('statusLabel')}</Label>
          {statusOptions.map((option) => {
            const isSelected = selectedStatus === option.id;
            const Icon = option.icon;

            return (
              <Button
                key={option.id}
                type="button"
                variant={isSelected ? 'secondary' : 'outline'}
                size="sm"
                onClick={() => onStatusChange(option.id)}
                className={cn(
                  'h-7 rounded-none px-3 text-xs font-mono rtl:font-sans uppercase tracking-wider rtl:tracking-normal font-medium transition-all whitespace-nowrap border gap-1.5 cursor-pointer',
                  isSelected
                    ? 'border-foreground bg-foreground text-background font-semibold shadow-xs hover:bg-foreground/90'
                    : 'border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground'
                )}>
                {Icon && <Icon className="h-3 w-3 shrink-0" aria-hidden="true" />}
                <span>{option.label}</span>
              </Button>
            );
          })}
        </div>

        {/* Featured Projects Toggle Control */}
        <div className="flex items-center gap-2">
          <Button
            type="button"
            variant={isFeaturedOnly ? 'default' : 'outline'}
            size="sm"
            onClick={() => onFeaturedChange(!isFeaturedOnly)}
            className={cn(
              'h-7 rounded-none px-3 text-xs font-mono rtl:font-sans uppercase tracking-wider rtl:tracking-normal font-medium transition-all whitespace-nowrap border gap-1.5 cursor-pointer',
              isFeaturedOnly
                ? 'border-foreground bg-foreground text-background font-semibold shadow-xs hover:bg-foreground/90'
                : 'border-border bg-card text-muted-foreground hover:bg-muted hover:text-foreground'
            )}>
            <Sparkles
              className={cn('h-3 w-3 shrink-0', isFeaturedOnly ? 'text-background' : 'text-muted-foreground')}
              aria-hidden="true"
            />
            <span>{t('featuredOnly')}</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
