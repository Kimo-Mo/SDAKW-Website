import { useTranslations } from 'next-intl';
import { Award, Briefcase, CheckCircle2, Lightbulb, ShieldCheck } from 'lucide-react';
import { Reveal, RevealItem } from '@/components/shared/reveal';
import type { CoreValuesGridProps } from '@/types/public';
import { cn } from '@/lib/utils';

/**
 * 5-Pillar Core Corporate Values Grid
 * Implements an asymmetric editorial matrix with a sticky section header on the start side
 * and an interconnected monolithic grid of values on the end side.
 */
export function CoreValuesGrid({ className }: CoreValuesGridProps) {
  const t = useTranslations('public');

  const values = [
    {
      key: 'quality',
      index: '01',
      icon: Award,
      title: t('aboutPage.values.quality.title'),
      description: t('aboutPage.values.quality.description'),
    },
    {
      key: 'innovation',
      index: '02',
      icon: Lightbulb,
      title: t('aboutPage.values.innovation.title'),
      description: t('aboutPage.values.innovation.description'),
    },
    {
      key: 'professionalism',
      index: '03',
      icon: Briefcase,
      title: t('aboutPage.values.professionalism.title'),
      description: t('aboutPage.values.professionalism.description'),
    },
    {
      key: 'transparency',
      index: '04',
      icon: ShieldCheck,
      title: t('aboutPage.values.transparency.title'),
      description: t('aboutPage.values.transparency.description'),
    },
    {
      key: 'excellence',
      index: '05',
      icon: CheckCircle2,
      title: t('aboutPage.values.excellence.title'),
      description: t('aboutPage.values.excellence.description'),
    },
  ];

  return (
    <section
      aria-labelledby="core-values-heading"
      className={cn('w-full text-start', className)}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
        {/* Left Column: Asymmetric Editorial Header (col-span-4) */}
        <Reveal variant="fade-scale" className="lg:col-span-4 space-y-4">
          <div className="space-y-3 border-s-2 border-primary ps-4 py-1">
            <div className="text-xs font-mono rtl:font-sans font-semibold tracking-widest rtl:tracking-normal text-muted-foreground uppercase">
              05 // {t('aboutPage.values.badge')}
            </div>
            <h2
              id="core-values-heading"
              className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground leading-tight">
              {t('aboutPage.values.heading')}
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              {t('aboutPage.values.subtitle')}
            </p>
          </div>
        </Reveal>

        {/* Right Column: Interconnected Monolithic Values Grid (col-span-8) */}
        <Reveal variant="stagger-children" className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {values.map((value, index) => {
            const Icon = value.icon;
            const isFullWidth = index === 4; // 5th item takes full row

            return (
              <RevealItem
                key={value.key}
                className={cn(isFullWidth && 'sm:col-span-2')}>
                <div className="group border border-border bg-card p-6 shadow-xs transition-all duration-300 hover:border-foreground/40 hover:bg-muted/20 text-start space-y-3 h-full flex flex-col justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between border-b border-border pb-3">
                      <span className="font-mono text-xs font-bold text-foreground">
                        VAL_{value.index}
                      </span>
                      <Icon className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" aria-hidden="true" />
                    </div>

                    <h3 className="font-heading text-base sm:text-lg font-bold text-foreground tracking-tight">
                      {value.title}
                    </h3>

                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                </div>
              </RevealItem>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
