import { motion } from 'framer-motion';

import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/lib/utils/utils';

interface LoadingStateProps {
  label: string;
  description?: string;
  className?: string;
}

export function LoadingState({ label, description, className }: LoadingStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      role="status"
      aria-live="polite"
      className={cn(
        'flex w-full flex-col items-center justify-center gap-2 p-6 text-center',
        className
      )}>
      <Spinner className="size-5 text-muted-foreground" />
      <div className="flex flex-col items-center gap-1">
        <p className="text-sm font-medium text-foreground">{label}</p>
        {description ? <p className="text-sm text-muted-foreground">{description}</p> : null}
      </div>
    </motion.div>
  );
}
