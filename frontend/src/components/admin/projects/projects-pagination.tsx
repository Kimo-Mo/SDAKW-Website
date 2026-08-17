'use client';

import { useTranslations } from 'next-intl';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface ProjectsPaginationProps {
  page: number;
  pages: number;
  total: number;
  limit: number;
  onPageChange: (newPage: number) => void;
  onLimitChange: (newLimit: number) => void;
}

export function ProjectsPagination({
  page,
  pages,
  total,
  limit,
  onPageChange,
  onLimitChange,
}: ProjectsPaginationProps) {
  const t = useTranslations('admin.projects.pagination');

  if (total === 0) return null;

  const start = Math.min((page - 1) * limit + 1, total);
  const end = Math.min(page * limit, total);

  // Generate page numbers with windowing
  const getPageNumbers = () => {
    const delta = 1;
    const range: (number | string)[] = [];

    for (let i = Math.max(2, page - delta); i <= Math.min(pages - 1, page + delta); i++) {
      range.push(i);
    }

    if (page - delta > 2) {
      range.unshift('...');
    }
    if (page + delta < pages - 1) {
      range.push('...');
    }

    range.unshift(1);
    if (pages > 1) {
      range.push(pages);
    }

    return range;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-2 text-xs text-muted-foreground">
      {/* Start: Item count range & Page size select */}
      <div className="flex flex-wrap items-center gap-4">
        <span>{t('showing', { start, end, total })}</span>

        <div className="flex items-center gap-1.5">
          <Label htmlFor="pagination-limit" className="shrink-0">
            {t('pageSize')}
          </Label>
          <Select
            value={String(limit)}
            onValueChange={(val) => onLimitChange(Number(val))}>
            <SelectTrigger
              id="pagination-limit"
              size="sm"
              className="h-7 text-xs font-medium"
              aria-label={t('pageSize')}>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* End: Navigation Buttons */}
      <div className="flex items-center gap-1">
        {/* Previous Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page <= 1}
          className="h-8 gap-1 px-2.5 text-xs"
          aria-label={t('prev')}>
          <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
          <span className="hidden sm:inline">{t('prev')}</span>
        </Button>

        {/* Numbered Page Buttons */}
        <div className="flex items-center gap-1">
          {pageNumbers.map((p, idx) => {
            if (p === '...') {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className="px-2 text-xs text-muted-foreground select-none">
                  ...
                </span>
              );
            }

            const pageNum = Number(p);
            const isCurrent = pageNum === page;

            return (
              <Button
                key={pageNum}
                variant={isCurrent ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onPageChange(pageNum)}
                className={`h-8 w-8 p-0 text-xs font-medium ${
                  isCurrent ? 'pointer-events-none' : ''
                }`}
                aria-current={isCurrent ? 'page' : undefined}>
                {pageNum}
              </Button>
            );
          })}
        </div>

        {/* Next Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.min(pages, page + 1))}
          disabled={page >= pages}
          className="h-8 gap-1 px-2.5 text-xs"
          aria-label={t('next')}>
          <span className="hidden sm:inline">{t('next')}</span>
          <ChevronRight className="h-4 w-4 rtl:rotate-180" />
        </Button>
      </div>
    </div>
  );
}
