'use client';

import * as React from 'react';
import { useTheme } from 'next-themes';
import { useTranslations } from 'next-intl';
import { Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils/utils';

export interface ThemeToggleProps {
  className?: string;
  variant?: 'outline' | 'ghost' | 'admin' | 'mobile';
  size?: 'default' | 'sm' | 'lg' | 'icon';
}

export function ThemeToggle({
  className,
  variant = 'outline',
  size = 'icon',
}: ThemeToggleProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const t = useTranslations('shared.theme');
  const shouldReduceMotion = useReducedMotion();

  // Guard against hydration mismatch
  const mounted = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const isDark = mounted ? resolvedTheme === 'dark' : false;

  const toggleTheme = () => {
    setTheme(isDark ? 'light' : 'dark');
  };

  const ariaLabel = isDark ? t('switchToLight') : t('switchToDark');

  // Mobile Drawer Full-Width Variant (matching LanguageSwitcher mobile style)
  if (variant === 'mobile') {
    return (
      <Button
        type="button"
        variant="outline"
        onClick={toggleTheme}
        aria-label={ariaLabel}
        className={cn(
          'w-full justify-between h-12 px-4 rounded-xl font-medium cursor-pointer',
          className
        )}>
        <div className="flex items-center gap-2.5">
          {mounted ? (
            isDark ? (
              <Sun className="h-4 w-4 text-amber-500" />
            ) : (
              <Moon className="h-4 w-4 text-muted-foreground" />
            )
          ) : (
            <div className="h-4 w-4" />
          )}
          <span>{t('theme')}</span>
        </div>
        <span className="rounded-md bg-muted px-2.5 py-1 text-xs font-semibold text-primary">
          {mounted ? (isDark ? t('dark') : t('light')) : '...'}
        </span>
      </Button>
    );
  }

  // Admin Header Variant
  if (variant === 'admin') {
    return (
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={toggleTheme}
        aria-label={ariaLabel}
        className={cn(
          'inline-flex items-center justify-center h-8 w-8 rounded-lg border border-border text-muted-foreground hover:text-foreground hover:bg-accent cursor-pointer transition-colors p-0',
          className
        )}>
        {mounted ? (
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={isDark ? 'dark' : 'light'}
              initial={shouldReduceMotion ? false : { opacity: 0, rotate: -45, scale: 0.8 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={shouldReduceMotion ? undefined : { opacity: 0, rotate: 45, scale: 0.8 }}
              transition={{ duration: 0.15 }}
              className="flex items-center justify-center">
              {isDark ? (
                <Sun className="h-4 w-4 text-amber-400" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </motion.span>
          </AnimatePresence>
        ) : (
          <span className="h-4 w-4" />
        )}
      </Button>
    );
  }

  // Ghost Variant
  if (variant === 'ghost') {
    return (
      <Button
        type="button"
        variant="ghost"
        size={size}
        onClick={toggleTheme}
        aria-label={ariaLabel}
        className={cn(
          'h-9 w-9 rounded-lg text-muted-foreground hover:text-foreground hover:bg-accent cursor-pointer transition-colors',
          className
        )}>
        {mounted ? (
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={isDark ? 'dark' : 'light'}
              initial={shouldReduceMotion ? false : { opacity: 0, rotate: -45, scale: 0.8 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              exit={shouldReduceMotion ? undefined : { opacity: 0, rotate: 45, scale: 0.8 }}
              transition={{ duration: 0.15 }}
              className="flex items-center justify-center">
              {isDark ? (
                <Sun className="h-4 w-4 text-amber-400" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
            </motion.span>
          </AnimatePresence>
        ) : (
          <span className="h-4 w-4" />
        )}
      </Button>
    );
  }

  // Default Outline / Public Header Pill Variant
  return (
    <Button
      type="button"
      variant="outline"
      size={size}
      onClick={toggleTheme}
      aria-label={ariaLabel}
      className={cn(
        'h-9 w-9 border border-border/80 bg-background/80 shadow-xs backdrop-blur-xs hover:bg-accent text-foreground cursor-pointer transition-colors p-0',
        className
      )}>
      {mounted ? (
        <AnimatePresence mode="wait" initial={false}>
          <motion.span
            key={isDark ? 'dark' : 'light'}
            initial={shouldReduceMotion ? false : { opacity: 0, rotate: -45, scale: 0.8 }}
            animate={{ opacity: 1, rotate: 0, scale: 1 }}
            exit={shouldReduceMotion ? undefined : { opacity: 0, rotate: 45, scale: 0.8 }}
            transition={{ duration: 0.15 }}
            className="flex items-center justify-center">
            {isDark ? (
              <Sun className="h-4 w-4 text-amber-400" />
            ) : (
              <Moon className="h-4 w-4 text-foreground" />
            )}
          </motion.span>
        </AnimatePresence>
      ) : (
        <span className="h-4 w-4" />
      )}
    </Button>
  );
}
