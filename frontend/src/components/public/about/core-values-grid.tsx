import React from 'react';
import { useTranslations } from 'next-intl';
import { Award, Briefcase, CheckCircle2, Lightbulb, ShieldCheck } from 'lucide-react';
import type { CoreValuesGridProps } from '@/types/public';
import { cn } from '@/lib/utils';

/**
 * 5-Pillar Core Corporate Values Grid
 * Displays Quality, Innovation, Professionalism, Transparency, and Operational Excellence.
 */
export function CoreValuesGrid({ className }: CoreValuesGridProps) {
  const t = useTranslations('public');

  const values = [
    {
      key: 'quality',
      icon: Award,
      title: t('aboutPage.values.quality.title'),
      description: t('aboutPage.values.quality.description'),
    },
    {
      key: 'innovation',
      icon: Lightbulb,
      title: t('aboutPage.values.innovation.title'),
      description: t('aboutPage.values.innovation.description'),
    },
    {
      key: 'professionalism',
      icon: Briefcase,
      title: t('aboutPage.values.professionalism.title'),
      description: t('aboutPage.values.professionalism.description'),
    },
    {
      key: 'transparency',
      icon: ShieldCheck,
      title: t('aboutPage.values.transparency.title'),
      description: t('aboutPage.values.transparency.description'),
    },
    {
      key: 'excellence',
      icon: CheckCircle2,
      title: t('aboutPage.values.excellence.title'),
      description: t('aboutPage.values.excellence.description'),
    },
  ];

  return (
    <section
      aria-labelledby="core-values-heading"
      className={cn('space-y-6 sm:space-y-8 text-start', className)}>
      {/* Section Header */}
      <div className="space-y-2 max-w-2xl">
        <span className="text-xs font-bold uppercase tracking-wider text-primary">
          {t('aboutPage.values.badge')}
        </span>
        <h2
          id="core-values-heading"
          className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          {t('aboutPage.values.heading')}
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground">
          {t('aboutPage.values.subtitle')}
        </p>
      </div>

      {/* 5-Pillar Responsive Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {values.map((value, index) => {
          const Icon = value.icon;
          const isSpanTwo = index === 4; // 5th item nicely styled on large screens

          return (
            <div
              key={value.key}
              className={cn(
                'group relative flex flex-col justify-between rounded-2xl border border-border/70 bg-card p-6 shadow-xs transition-all duration-300 hover:border-primary/40 hover:shadow-md space-y-4',
                isSpanTwo && 'sm:col-span-2 lg:col-span-1'
              )}>
              <div className="space-y-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
                  <Icon className="h-5 w-5" aria-hidden="true" />
                </div>
                <h3 className="font-heading text-lg font-bold text-foreground tracking-tight">
                  {value.title}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {value.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
