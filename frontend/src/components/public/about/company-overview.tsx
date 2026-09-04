import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Reveal } from '@/components/shared/reveal';
import type { CompanyOverviewProps } from '@/types/public';
import { cn } from '@/lib/utils';

/**
 * Company Overview Section
 * Implements an asymmetric editorial split layout combining an offset
 * architectural image frame with a structured 3-paragraph corporate narrative.
 */
export function CompanyOverview({ className }: CompanyOverviewProps) {
  const t = useTranslations('public');

  return (
    <Reveal variant="fade-scale">
      <section
        aria-labelledby="company-overview-heading"
        className={cn(
          'border border-border bg-card p-6 sm:p-10 lg:p-12 shadow-xs text-start',
          className
        )}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Editorial Narrative (col-span-7) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="space-y-3">
              <div className="text-xs font-mono rtl:font-sans font-semibold tracking-widest rtl:tracking-normal text-muted-foreground uppercase">
                01 // {t('aboutPage.overview.heading')}
              </div>
              <h2
                id="company-overview-heading"
                className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground leading-tight">
                {t('aboutPage.overview.heading')}
              </h2>
            </div>

            {/* Lead Narrative Paragraph */}
            <div className="border-s-2 border-primary ps-4 py-1">
              <p className="text-base sm:text-lg font-medium text-foreground leading-relaxed sm:leading-8">
                {t('aboutPage.overview.p1')}
              </p>
            </div>

            {/* Supporting Narrative Paragraphs */}
            <div className="space-y-4 text-sm sm:text-base text-muted-foreground leading-relaxed sm:leading-7 pt-2">
              <p>{t('aboutPage.overview.p2')}</p>
              <p>{t('aboutPage.overview.p3')}</p>
            </div>
          </div>

          {/* Right Column: Asymmetric Architectural Imagery (col-span-5) */}
          <div className="lg:col-span-5">
            <div className="relative overflow-hidden border border-border bg-muted/20 shadow-xs">
              <div className="relative aspect-4/3 sm:aspect-5/4 lg:aspect-4/5 w-full overflow-hidden">
                <Image
                  src="/images/about-1.webp"
                  alt={t('aboutPage.overview.heading')}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 45vw, 520px"
                  className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-102 motion-reduce:transform-none"
                />
                {/* Monolithic Blueprint Scrim & Tag */}
                <div
                  className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent"
                  aria-hidden="true"
                />
                <div className="absolute inset-s-4 bottom-4 z-10">
                  <div className="inline-flex items-center gap-2 bg-background/90 px-3 py-1.5 text-xs font-mono font-medium text-foreground backdrop-blur-xs border border-border">
                    <span>SDAKW ARCHITECTURAL LEGACY</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Reveal>
  );
}
