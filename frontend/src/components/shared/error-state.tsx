import { motion } from 'framer-motion';
import { TriangleAlertIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils/utils';

interface ErrorStateBaseProps {
  title: string;
  description?: string;
  className?: string;
}

type ErrorStateProps = ErrorStateBaseProps &
  (
    | {
        onRetry?: never;
        retryLabel?: never;
      }
    | {
        retryLabel: string;
        onRetry: () => void;
      }
  );

export function ErrorState({
  title,
  description,
  retryLabel,
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      role="alert"
      className={cn(
        'flex w-full flex-col items-center justify-center gap-4 p-6 text-center',
        className
      )}>
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
        <TriangleAlertIcon aria-hidden="true" className="size-4" />
      </div>
      <div className="flex flex-col items-center gap-1.5">
        <p className="text-sm font-medium text-foreground">{title}</p>
        {description ? (
          <p className="max-w-sm text-sm text-muted-foreground">{description}</p>
        ) : null}
      </div>
      {onRetry ? (
        <Button variant="outline" onClick={onRetry}>
          {retryLabel}
        </Button>
      ) : null}
    </motion.div>
  );
}
