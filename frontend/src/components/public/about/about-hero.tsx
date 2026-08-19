import React from 'react';
import { useTranslations } from 'next-intl';
import { Building2, Sparkles } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { AboutHeroProps } from '@/types/public';
import { cn } from '@/lib/utils';

/**
 * About Us Page Hero Section
 * Displays brand badge, company title, corporate subtitle, executive tagline,
 * and experience highlights callout.
 */
export function AboutHero({ className }: AboutHeroProps) {
  const t = useTranslations('public');

  return (
    <section
      aria-labelledby="about-hero-heading"
      className={cn(
        'relative overflow-hidden rounded-3xl border border-border/80 bg-linear-to-br from-card via-card to-primary/5 p-8 sm:p-12 lg:p-16 shadow-xs text-center space-y-6',
        className
      )}>
      {/* Background ambient lighting */}
      <div
        className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-primary/10 blur-3xl"
        aria-hidden="true"
      />

      <div className="relative z-10 max-w-3xl mx-auto space-y-5">
        {/* Corporate Profile Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary shadow-xs">
          <Building2 className="h-3.5 w-3.5" aria-hidden="true" />
          <span>{t('aboutPage.badge')}</span>
        </div>

        {/* Main Title & Subtitle */}
        <div className="space-y-2">
          <h1
            id="about-hero-heading"
            className="font-heading text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-tight">
            {t('aboutPage.title')}
          </h1>
          <p className="text-base sm:text-lg font-medium text-muted-foreground">
            {t('aboutPage.subtitle')}
          </p>
        </div>

        {/* Corporate Slogan Tagline */}
        <p className="font-heading text-xl sm:text-2xl font-semibold tracking-tight text-primary">
          {t('aboutPage.tagline')}
        </p>

        {/* Experience Metric Pill */}
        <div className="pt-2 flex justify-center">
          <Badge
            variant="outline"
            className="inline-flex items-center gap-2 px-4 py-2 text-xs sm:text-sm font-semibold text-foreground bg-background/80 backdrop-blur-xs border-border/80 shadow-xs rounded-full">
            <Sparkles className="h-4 w-4 text-amber-500 shrink-0" aria-hidden="true" />
            <span className="text-primary font-bold">{t('aboutPage.experienceYears')}</span>
            <span>{t('aboutPage.experienceLabel')}</span>
          </Badge>
        </div>
      </div>
    </section>
  );
}
