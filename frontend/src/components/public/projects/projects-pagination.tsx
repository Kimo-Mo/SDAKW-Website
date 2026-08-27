'use client';

import { useTranslations } from 'next-intl';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import type { ProjectsPaginationProps } from '@/types/public';
import { cn } from '@/lib/utils';

/**
 * Public projects pagination integrated directly with shared shadcn/ui Pagination primitives
 * and styled with sharp monolithic borders.
 */
export function ProjectsPagination({
  currentPage,
  totalPages,
  onPageChange,
}: ProjectsPaginationProps) {
  const t = useTranslations('public.projectsPage.pagination');

  if (totalPages <= 1) {
    return null;
  }

  // Generate pagination items (handling ellipses for > 7 pages)
  const getPageNumbers = () => {
    const pages: Array<number | 'ellipsis'> = [];
    const maxVisible = 7;

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push('ellipsis');

      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) pages.push('ellipsis');
      pages.push(totalPages);
    }

    return pages;
  };

  const pages = getPageNumbers();

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8 border-t border-border">
      {/* Current page indicator info */}
      <p className="text-xs font-mono text-muted-foreground order-2 sm:order-1">
        {t('pageOf', { current: currentPage, total: totalPages })}
      </p>

      {/* Shared shadcn/ui Pagination Component */}
      <Pagination className="w-auto mx-0 order-1 sm:order-2">
        <PaginationContent className="gap-1">
          {/* Previous Page */}
          <PaginationItem>
            <PaginationPrevious
              text={t('previous')}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (currentPage > 1) {
                  onPageChange(currentPage - 1);
                }
              }}
              aria-disabled={currentPage <= 1}
              className={cn(
                'cursor-pointer rounded-none font-mono text-xs uppercase tracking-wider',
                currentPage <= 1 && 'pointer-events-none opacity-50'
              )}
            />
          </PaginationItem>

          {/* Numbered Page Links */}
          {pages.map((page, idx) => {
            if (page === 'ellipsis') {
              return (
                <PaginationItem key={`ellipsis-${idx}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              );
            }

            const isActive = page === currentPage;
            return (
              <PaginationItem key={`page-${page}`}>
                <PaginationLink
                  href="#"
                  isActive={isActive}
                  onClick={(e) => {
                    e.preventDefault();
                    onPageChange(page);
                  }}
                  className={cn(
                    'cursor-pointer h-9 w-9 rounded-none font-mono text-xs font-semibold',
                    isActive && 'bg-foreground text-background hover:bg-foreground/90'
                  )}
                >
                  {page}
                </PaginationLink>
              </PaginationItem>
            );
          })}

          {/* Next Page */}
          <PaginationItem>
            <PaginationNext
              text={t('next')}
              href="#"
              onClick={(e) => {
                e.preventDefault();
                if (currentPage < totalPages) {
                  onPageChange(currentPage + 1);
                }
              }}
              aria-disabled={currentPage >= totalPages}
              className={cn(
                'cursor-pointer rounded-none font-mono text-xs uppercase tracking-wider',
                currentPage >= totalPages && 'pointer-events-none opacity-50'
              )}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
}
