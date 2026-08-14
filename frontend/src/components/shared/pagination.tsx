import {
  Pagination as PaginationNav,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

import { cn } from '@/lib/utils/utils';

type PageItem = number | 'ellipsis-start' | 'ellipsis-end';

/** Sliding window around the current page (at most 7 slots). */
function getPageItems(currentPage: number, totalPages: number): PageItem[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, index) => index + 1);
  }

  const items: PageItem[] = [1];

  if (currentPage > 3) {
    items.push('ellipsis-start');
  }

  const first = Math.max(2, currentPage - 1);
  const last = Math.min(totalPages - 1, currentPage + 1);
  for (let page = first; page <= last; page += 1) {
    items.push(page);
  }

  if (currentPage < totalPages - 2) {
    items.push('ellipsis-end');
  }

  items.push(totalPages);
  return items;
}

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  /** Visible label for the previous-page control (caller translates). */
  previousLabel: string;
  /** Visible label for the next-page control (caller translates). */
  nextLabel: string;
  /** Accessible label for the navigation landmark (caller translates). */
  ariaLabel: string;
  className?: string;
}

/**
 * Generic pagination with no API or domain knowledge: it only maps a
 * current page / total pages into the shadcn/ui pagination primitives.
 * Chevron icons flip via `rtl:rotate-180` (already applied in
 * `ui/pagination.tsx`), keeping direction correct in both locales.
 */
export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  previousLabel,
  nextLabel,
  ariaLabel,
  className,
}: PaginationProps) {
  if (totalPages < 2) {
    return null;
  }

  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;

  return (
    <PaginationNav aria-label={ariaLabel} className={cn('justify-center', className)}>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            text={previousLabel}
            aria-disabled={!canGoPrevious}
            className={cn(!canGoPrevious && 'pointer-events-none opacity-50')}
            onClick={canGoPrevious ? () => onPageChange(currentPage - 1) : undefined}
          />
        </PaginationItem>

        {getPageItems(currentPage, totalPages).map((item) =>
          typeof item === 'number' ? (
            <PaginationItem key={item}>
              <PaginationLink isActive={item === currentPage} onClick={() => onPageChange(item)}>
                {item}
              </PaginationLink>
            </PaginationItem>
          ) : (
            <PaginationItem key={item}>
              <PaginationEllipsis />
            </PaginationItem>
          )
        )}

        <PaginationItem>
          <PaginationNext
            text={nextLabel}
            aria-disabled={!canGoNext}
            className={cn(!canGoNext && 'pointer-events-none opacity-50')}
            onClick={canGoNext ? () => onPageChange(currentPage + 1) : undefined}
          />
        </PaginationItem>
      </PaginationContent>
    </PaginationNav>
  );
}
