'use client';

import * as React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { useTranslations } from 'next-intl';

import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils/utils';

export interface PasswordInputProps extends React.ComponentProps<typeof Input> {
  toggleClassName?: string;
}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, toggleClassName, disabled, ...props }, ref) => {
    const [showPassword, setShowPassword] = React.useState(false);
    const t = useTranslations();

    return (
      <div className="relative w-full">
        <Input
          ref={ref}
          type={showPassword ? 'text' : 'password'}
          className={cn('pe-10', className)}
          disabled={disabled}
          {...props}
        />
        <button
          type="button"
          disabled={disabled}
          onClick={() => setShowPassword((prev) => !prev)}
          aria-label={showPassword ? t('shared.hidePassword') : t('shared.showPassword')}
          aria-pressed={showPassword}
          className={cn(
            'absolute inset-y-0 inset-e-0 flex items-center pe-3 text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring rounded-e-md disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
            toggleClassName
          )}>
          {showPassword ? (
            <EyeOff className="size-4 shrink-0" aria-hidden="true" />
          ) : (
            <Eye className="size-4 shrink-0" aria-hidden="true" />
          )}
        </button>
      </div>
    );
  }
);

PasswordInput.displayName = 'PasswordInput';

export { PasswordInput };
