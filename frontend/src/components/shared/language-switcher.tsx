'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { Globe } from 'lucide-react';
import { useRouter, usePathname } from '@/i18n/navigation';
import { getAlternateLocale, type Locale } from '@/i18n/routing';
import { Button } from '@/components/ui/button';

export interface LanguageSwitcherProps {
  locale: string;
  className?: string;
  variant?: 'pill' | 'mobile' | 'admin' | 'ghost';
  onSwitch?: () => void;
}

function LanguageSwitcherInner({
  locale,
  className = '',
  variant = 'pill',
  onSwitch,
}: LanguageSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const alternateLocale = getAlternateLocale(locale as Locale);
  const alternateLabel = alternateLocale === 'ar' ? 'العربية' : 'English';
  const ariaLabel =
    alternateLocale === 'ar' ? 'التبديل إلى اللغة العربية' : 'Switch language to English';

  const handleSwitch = () => {
    const search = searchParams?.toString();
    const targetPath = search ? `${pathname}?${search}` : pathname;

    router.replace(targetPath, { locale: alternateLocale });
    if (onSwitch) {
      onSwitch();
    }
  };

  if (variant === 'mobile') {
    return (
      <Button
        type="button"
        variant="outline"
        onClick={handleSwitch}
        aria-label={ariaLabel}
        className={`w-full justify-between h-12 px-4 rounded-xl font-medium ${className}`}>
        <div className="flex items-center gap-2.5">
          <Globe className="h-4 w-4 text-muted-foreground" />
          <span>{alternateLocale === 'ar' ? 'اللغة' : 'Language'}</span>
        </div>
        <span className="rounded-md bg-muted px-2.5 py-1 text-xs font-semibold text-primary">
          {alternateLabel}
        </span>
      </Button>
    );
  }

  if (variant === 'admin') {
    return (
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={handleSwitch}
        aria-label={ariaLabel}
        className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground ${className}`}>
        <Globe className="h-3.5 w-3.5" />
        <span>{alternateLabel}</span>
      </Button>
    );
  }

  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      onClick={handleSwitch}
      aria-label={ariaLabel}
      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium bg-background/80 shadow-xs backdrop-blur-xs hover:bg-accent ${className}`}>
      <Globe className="h-3.5 w-3.5 text-muted-foreground" />
      <span>{alternateLabel}</span>
    </Button>
  );
}

export function LanguageSwitcher(props: LanguageSwitcherProps) {
  const alternateLocale = getAlternateLocale(props.locale as Locale);
  const alternateLabel = alternateLocale === 'ar' ? 'العربية' : 'English';

  return (
    <Suspense
      fallback={
        props.variant === 'mobile' ? (
          <div className="flex w-full items-center justify-between rounded-xl border border-border bg-card/60 px-4 py-3 text-sm font-medium text-muted-foreground">
            <div className="flex items-center gap-2.5">
              <Globe className="h-4 w-4 text-muted-foreground" />
              <span>{alternateLabel}</span>
            </div>
          </div>
        ) : (
          <div className="inline-flex items-center gap-1.5 rounded-full border border-border/80 bg-background/80 px-3 py-1.5 text-xs font-medium text-muted-foreground">
            <Globe className="h-3.5 w-3.5 text-muted-foreground" />
            <span>{alternateLabel}</span>
          </div>
        )
      }>
      <LanguageSwitcherInner {...props} />
    </Suspense>
  );
}
