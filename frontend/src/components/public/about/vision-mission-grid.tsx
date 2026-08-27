import { useTranslations } from 'next-intl';
import { Reveal, RevealItem } from '@/components/shared/reveal';
import type { VisionMissionGridProps } from '@/types/public';
import { cn } from '@/lib/utils';

/**
 * Vision & Mission Editorial Composition
 * Replaces generic identical cards with a deliberate, asymmetrically weighted
 * architectural layout: Mission leads as a large typographic pull-quote statement,
 * while Vision serves as a sharply framed supporting monolith.
 */
export function VisionMissionGrid({ className }: VisionMissionGridProps) {
  const t = useTranslations('public');

  return (
    <section
      aria-label="Vision and Mission"
      className={cn('w-full', className)}>
      <Reveal variant="stagger-children" className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-stretch">
        {/* 1. Mission: Heroic Dominant Pull-Quote Statement (col-span-7 or 8) */}
        <RevealItem className="lg:col-span-7 xl:col-span-8 flex">
          <div className="flex flex-col justify-between border border-border bg-card p-6 sm:p-10 lg:p-12 shadow-xs text-start space-y-6 w-full border-s-4 border-s-foreground">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <span className="text-xs font-mono rtl:font-sans font-semibold tracking-widest rtl:tracking-normal text-muted-foreground uppercase">
                  02 // {t('aboutPage.visionMission.missionTitle')}
                </span>
                <span className="text-xs font-mono text-muted-foreground">FOUNDATION</span>
              </div>

              <h2 className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                {t('aboutPage.visionMission.missionTitle')}
              </h2>

              {/* Bold Large Mission Typographic Statement */}
              <p className="font-heading text-lg sm:text-xl lg:text-2xl font-semibold text-foreground/95 leading-relaxed sm:leading-snug lg:leading-normal">
                {t('aboutPage.visionMission.missionText')}
              </p>
            </div>

            <div className="pt-4 border-t border-border flex items-center justify-between text-xs font-mono text-muted-foreground">
              <span>CORE PURPOSE</span>
              <span>STRATEGIC IMPACT</span>
            </div>
          </div>
        </RevealItem>

        {/* 2. Vision: Complementary Architectural Monolith (col-span-5 or 4) */}
        <RevealItem className="lg:col-span-5 xl:col-span-4 flex">
          <div className="flex flex-col justify-between border border-input bg-muted/50 p-6 sm:p-8 lg:p-10 shadow-sm text-start space-y-6 w-full">
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-border pb-3">
                <span className="text-xs font-mono rtl:font-sans font-semibold tracking-widest rtl:tracking-normal text-muted-foreground uppercase">
                  03 // {t('aboutPage.visionMission.visionTitle')}
                </span>
                <span className="text-xs font-mono text-muted-foreground">ASPIRATION</span>
              </div>

              <h2 className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                {t('aboutPage.visionMission.visionTitle')}
              </h2>

              <p className="text-sm sm:text-base text-muted-foreground leading-relaxed sm:leading-7">
                {t('aboutPage.visionMission.visionText')}
              </p>
            </div>

            <div className="pt-4 border-t border-border flex items-center justify-between text-xs font-mono text-muted-foreground">
              <span>LONG-TERM HORIZON</span>
              <span>REGIONAL BENCHMARK</span>
            </div>
          </div>
        </RevealItem>
      </Reveal>
    </section>
  );
}
