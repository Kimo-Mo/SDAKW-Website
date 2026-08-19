import React from 'react';
import { useTranslations } from 'next-intl';
import { PhoneCall } from 'lucide-react';
import type { ContactHeaderProps } from '@/types/public';
import { cn } from '@/lib/utils';

/**
 * Contact Page Header Section
 * Displays badge, page title, and localized subtitle.
 */
export function ContactHeader({ className }: ContactHeaderProps) {
  const t = useTranslations('public');

  return (
    <div className={cn('text-center max-w-3xl mx-auto space-y-4', className)}>
      <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary shadow-xs">
        <PhoneCall className="h-3.5 w-3.5" aria-hidden="true" />
        <span>{t('contactPage.badge')}</span>
      </div>

      <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground">
        {t('contactPage.title')}
      </h1>

      <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
        {t('contactPage.subtitle')}
      </p>
    </div>
  );
}
