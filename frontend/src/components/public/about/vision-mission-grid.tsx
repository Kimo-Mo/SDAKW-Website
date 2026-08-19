import React from 'react';
import { useTranslations } from 'next-intl';
import { Compass, Target } from 'lucide-react';
import type { VisionMissionGridProps } from '@/types/public';
import { cn } from '@/lib/utils';

/**
 * 2-Column Side-by-Side Vision & Mission Grid
 * Displays balanced highlight cards for corporate Vision and Mission.
 */
export function VisionMissionGrid({ className }: VisionMissionGridProps) {
  const t = useTranslations('public');

  return (
    <section
      aria-label="Vision and Mission"
      className={cn('grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8', className)}>
      {/* 1. Vision Card */}
      <div className="group relative flex flex-col justify-between rounded-3xl border border-primary/20 bg-linear-to-br from-card via-card to-primary/5 p-6 sm:p-8 lg:p-10 shadow-xs transition-all duration-300 hover:border-primary/40 hover:shadow-md text-start space-y-6">
        <div className="space-y-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/20 transition-transform duration-300 group-hover:scale-105">
            <Target className="h-6 w-6" aria-hidden="true" />
          </div>
          <h2 className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            {t('aboutPage.visionMission.visionTitle')}
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed sm:leading-7">
            {t('aboutPage.visionMission.visionText')}
          </p>
        </div>
      </div>

      {/* 2. Mission Card */}
      <div className="group relative flex flex-col justify-between rounded-3xl border border-border/80 bg-linear-to-br from-card via-card to-muted/20 p-6 sm:p-8 lg:p-10 shadow-xs transition-all duration-300 hover:border-primary/40 hover:shadow-md text-start space-y-6">
        <div className="space-y-4">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/20 transition-transform duration-300 group-hover:scale-105">
            <Compass className="h-6 w-6" aria-hidden="true" />
          </div>
          <h2 className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            {t('aboutPage.visionMission.missionTitle')}
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed sm:leading-7">
            {t('aboutPage.visionMission.missionText')}
          </p>
        </div>
      </div>
    </section>
  );
}
