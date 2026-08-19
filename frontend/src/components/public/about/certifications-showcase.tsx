import React from 'react';
import { useTranslations } from 'next-intl';
import { Award, Leaf, ShieldAlert } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import type { CertificationsShowcaseProps } from '@/types/public';
import { cn } from '@/lib/utils';

/**
 * Triple ISO Certifications Showcase Section
 * Highlights ISO 9001:2015, ISO 14001:2015, and ISO 45001:2018 accreditation.
 */
export function CertificationsShowcase({ className }: CertificationsShowcaseProps) {
  const t = useTranslations('public');

  const certs = [
    {
      key: 'iso9001',
      standard: t('aboutPage.certifications.iso9001.title'),
      name: t('aboutPage.certifications.iso9001.name'),
      description: t('aboutPage.certifications.iso9001.description'),
      icon: Award,
      badgeColor:
        'text-blue-700 bg-blue-50 dark:text-blue-300 dark:bg-blue-950/60 border-blue-200 dark:border-blue-900',
    },
    {
      key: 'iso14001',
      standard: t('aboutPage.certifications.iso14001.title'),
      name: t('aboutPage.certifications.iso14001.name'),
      description: t('aboutPage.certifications.iso14001.description'),
      icon: Leaf,
      badgeColor:
        'text-emerald-700 bg-emerald-50 dark:text-emerald-300 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-900',
    },
    {
      key: 'iso45001',
      standard: t('aboutPage.certifications.iso45001.title'),
      name: t('aboutPage.certifications.iso45001.name'),
      description: t('aboutPage.certifications.iso45001.description'),
      icon: ShieldAlert,
      badgeColor:
        'text-amber-700 bg-amber-50 dark:text-amber-300 dark:bg-amber-950/60 border-amber-200 dark:border-amber-900',
    },
  ];

  return (
    <section
      aria-labelledby="certifications-heading"
      className={cn('space-y-6 sm:space-y-8 text-start', className)}>
      {/* Section Header */}
      <div className="space-y-2 max-w-2xl">
        <span className="text-xs font-bold uppercase tracking-wider text-primary">
          {t('aboutPage.certifications.badge')}
        </span>
        <h2
          id="certifications-heading"
          className="font-heading text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          {t('aboutPage.certifications.heading')}
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground">
          {t('aboutPage.certifications.subtitle')}
        </p>
      </div>

      {/* 3-Card ISO Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
        {certs.map((cert) => {
          const Icon = cert.icon;

          return (
            <div
              key={cert.key}
              className="group relative flex flex-col justify-between rounded-2xl border border-border/80 bg-card p-6 shadow-xs transition-all duration-300 hover:border-primary/40 hover:shadow-md space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  <Badge
                    variant="outline"
                    className={cn('px-2.5 py-0.5 text-xs font-bold border', cert.badgeColor)}>
                    <Icon className="h-3.5 w-3.5 me-1.5 shrink-0" aria-hidden="true" />
                    <span>{cert.standard}</span>
                  </Badge>
                </div>
                <h3 className="font-heading text-base sm:text-lg font-bold text-foreground tracking-tight">
                  {cert.name}
                </h3>
                <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                  {cert.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
