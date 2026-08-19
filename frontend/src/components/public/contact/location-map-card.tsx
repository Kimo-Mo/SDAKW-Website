import React from 'react';
import { useTranslations } from 'next-intl';
import { ArrowUpRight, Building2, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { LocationMapCardProps } from '@/types/public';
import { cn } from '@/lib/utils';

/**
 * Headquarters Location Card with Google Maps Navigation Action
 * Displays Hamad Tower details and launches Google Maps in a new tab.
 */
export function LocationMapCard({ className }: LocationMapCardProps) {
  const t = useTranslations('public');

  // Google Maps Search URL for Hamad Tower, Sharq, Kuwait City
  const googleMapsUrl = 'https://www.google.com/maps/search/?api=1&query=شركة+سالم+دويح+العجمي';

  return (
    <section
      aria-labelledby="location-heading"
      className={cn(
        'relative overflow-hidden rounded-3xl border border-primary/20 bg-linear-to-br from-card via-card to-primary/5 p-6 sm:p-10 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-start',
        className
      )}>
      <div className="flex flex-col md:flex-row items-center gap-5">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary ring-1 ring-primary/20">
          <Building2 className="h-7 w-7" aria-hidden="true" />
        </div>
        <div className="space-y-1.5">
          <div className="flex items-center justify-center md:justify-start gap-2">
            <MapPin className="h-4 w-4 text-primary shrink-0" aria-hidden="true" />
            <h2
              id="location-heading"
              className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              {t('contactPage.map.heading')}
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-xl leading-relaxed">
            {t('contactPage.map.description')}
          </p>
        </div>
      </div>

      <a href={googleMapsUrl} target="_blank" rel="noopener noreferrer" className="shrink-0">
        <Button
          variant="outline"
          size="lg"
          className="gap-2 rounded-xl border-primary/30 hover:border-primary text-foreground hover:bg-primary/10 px-6 h-12 shadow-xs font-semibold cursor-pointer">
          <span>{t('contactPage.map.getDirections')}</span>
          <ArrowUpRight className="h-4 w-4 text-primary" aria-hidden="true" />
        </Button>
      </a>
    </section>
  );
}
