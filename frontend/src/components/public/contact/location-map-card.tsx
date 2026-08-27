'use client';

import { useTranslations } from 'next-intl';
import { ArrowUpRight, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Reveal } from '@/components/shared/reveal';
import type { LocationMapCardProps } from '@/types/public';
import { cn } from '@/lib/utils';

/**
 * Headquarters Location Card with Google Maps Navigation Action
 * Displays Hamad Tower details and launches Google Maps in a new tab
 * with asymmetric editorial staging and sharp monolithic framing.
 */
export function LocationMapCard({ className }: LocationMapCardProps) {
  const t = useTranslations('public');

  // Google Maps Search URL for Hamad Tower, Sharq, Kuwait City
  const googleMapsUrl = 'https://www.google.com/maps/search/?api=1&query=شركة+سالم+دويح+العجمي';

  return (
    <Reveal variant="fade-scale">
      <section
        aria-labelledby="location-heading"
        className={cn(
          'border border-border bg-card p-8 sm:p-10 shadow-xs text-start transition-all duration-300 hover:border-foreground/40',
          className
        )}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Location Details */}
          <div className="lg:col-span-8 space-y-3">
            <div className="text-xs font-mono rtl:font-sans font-semibold tracking-widest rtl:tracking-normal text-muted-foreground uppercase">
              HQ // HAMAD TOWER
            </div>

            <div className="flex items-center gap-2.5">
              <MapPin className="h-5 w-5 text-foreground shrink-0" aria-hidden="true" />
              <h2
                id="location-heading"
                className="font-heading text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-foreground">
                {t('contactPage.map.heading')}
              </h2>
            </div>

            <p className="text-xs sm:text-sm md:text-base text-muted-foreground max-w-2xl leading-relaxed">
              {t('contactPage.map.description')}
            </p>
          </div>

          {/* Right Column: Google Maps Action */}
          <div className="lg:col-span-4 flex lg:justify-end">
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                className="w-full sm:w-auto rounded-none px-6 h-12 gap-2.5 font-mono rtl:font-sans text-xs sm:text-sm uppercase tracking-wider rtl:tracking-normal font-semibold border-border hover:bg-muted text-foreground cursor-pointer active:scale-[0.98] transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transform-none">
                <span>{t('contactPage.map.getDirections')}</span>
                <ArrowUpRight className="h-4 w-4 rtl:rotate-180 shrink-0" aria-hidden="true" />
              </Button>
            </a>
          </div>
        </div>
      </section>
    </Reveal>
  );
}
