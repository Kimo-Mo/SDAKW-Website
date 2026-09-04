import { m } from 'framer-motion';
import { FolderSearch, type LucideIcon } from 'lucide-react';
import React from 'react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface EmptyStateProps {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  actionNode?: React.ReactNode;
  icon?: LucideIcon | React.ComponentType<{ className?: string }>;
  className?: string;
}

/**
 * Reusable Standardized Empty State Component
 * Renders an accessible, centered empty illustration, message, and optional action trigger.
 * Located in shared components alongside ErrorState and LoadingState.
 */
export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  actionNode,
  icon: Icon = FolderSearch,
  className,
}: EmptyStateProps) {
  return (
    <m.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      role="status"
      aria-live="polite"
      className={cn(
        'flex w-full flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-border/80 bg-card/60 p-8 sm:p-12 text-center shadow-xs max-w-lg mx-auto',
        className
      )}>
      <div className="flex size-14 shrink-0 items-center justify-center bg-muted text-muted-foreground border border-border/60">
        <Icon aria-hidden="true" className="size-7" />
      </div>

      <div className="flex flex-col items-center gap-1.5 max-w-sm">
        <h3 className="font-heading text-lg font-bold tracking-tight text-foreground">{title}</h3>
        {description && (
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">{description}</p>
        )}
      </div>

      {actionNode ? (
        <div className="pt-1">{actionNode}</div>
      ) : actionLabel && onAction ? (
        <div className="pt-1">
          <Button
            variant="default"
            size="sm"
            onClick={onAction}
            className="rounded-xl px-5 h-10 shadow-xs font-semibold cursor-pointer">
            {actionLabel}
          </Button>
        </div>
      ) : null}
    </m.div>
  );
}
