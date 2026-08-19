'use client';

import React from 'react';
import { useTranslations } from 'next-intl';
import { Building2, CheckCircle2, Clock, Landmark, Layers, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import type { ProjectStatusFilter, ProjectTypeFilter, ProjectsFiltersProps } from '@/types/public';
import { cn } from '@/lib/utils';

/**
 * Two-tier segmented filter bar for public project listings:
 * - Tier 1: Project Classification (All, Government, Private)
 * - Tier 2: Execution Status (All, Ongoing, Completed)
 * - Reset Filters trigger & Results counter
 */
export function ProjectsFilters({
  selectedType,
  selectedStatus,
  onTypeChange,
  onStatusChange,
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
    <div className="space-y-4">
      {/* Tier 1: Primary Classification Segmented Pills */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="flex flex-col gap-1.5">
          <Label className="sr-only">{t('typeLabel')}</Label>
          <div
            className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none touch-pan-x rounded-2xl bg-muted/60 p-1.5 border border-border/60 max-w-full"
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
                  variant={isSelected ? 'outline' : 'ghost'}
                  size="sm"
                  aria-selected={isSelected}
                  onClick={() => onTypeChange(option.id)}
                  className={cn(
                    'h-9 rounded-xl px-4 text-xs sm:text-sm font-semibold transition-all whitespace-nowrap gap-2',
                    isSelected
                      ? 'bg-background text-foreground shadow-xs border-border/50 hover:bg-background'
                      : 'text-muted-foreground hover:text-foreground hover:bg-background/40'
                  )}>
                  <Icon
                    className={cn(
                      'h-4 w-4 shrink-0 transition-colors',
                      isSelected ? 'text-primary' : 'text-muted-foreground'
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
        <div className="flex items-center gap-3 self-end sm:self-center">
          {typeof totalResults === 'number' && (
            <span className="text-xs font-medium text-muted-foreground">
              {t('showingResults', { count: totalResults })}
            </span>
          )}

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onResetFilters}
              className="h-8 gap-1.5 px-2.5 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-lg">
              <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{t('clearFilters')}</span>
            </Button>
          )}
        </div>
      </div>

      {/* Tier 2: Secondary Status Compact Chips */}
      <div className="flex flex-col gap-1.5">
        <Label className="sr-only">{t('statusLabel')}</Label>
        <div
          className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none touch-pan-x max-w-full"
          role="group"
          aria-label={t('allStatuses')}>
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
                  'h-7 rounded-full px-3 text-xs font-medium transition-all whitespace-nowrap border gap-1.5',
                  isSelected
                    ? 'border-primary/50 bg-primary/10 text-primary font-semibold shadow-xs hover:bg-primary/15'
                    : 'border-border/70 bg-card/60 text-muted-foreground hover:bg-muted/60 hover:text-foreground'
                )}>
                {Icon && <Icon className="h-3 w-3 shrink-0" aria-hidden="true" />}
                <span>{option.label}</span>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
