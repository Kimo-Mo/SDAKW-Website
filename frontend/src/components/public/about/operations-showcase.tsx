import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Building2, Sparkles, Truck } from 'lucide-react';
import { Reveal, RevealItem } from '@/components/shared/reveal';
import type { OperationsShowcaseProps } from '@/types/public';
import { cn } from '@/lib/utils';

/**
 * Operations & Technical Capacity Showcase Section
 * Combines an asymmetric architectural image container with structured
 * monolithic engineering panels for Civil Contracting, Natural Stone/Marble,
 * and Fleet Readiness.
 */
export function OperationsShowcase({ className }: OperationsShowcaseProps) {
  const t = useTranslations('public');

  const capabilities = [
    {
      key: 'pillar1',
      index: '01',
      icon: Building2,
      title: t('aboutPage.operations.pillar1.title'),
      description: t('aboutPage.operations.pillar1.description'),
      tag: t('aboutPage.operations.pillar1.tag'),
    },
    {
      key: 'pillar2',
      index: '02',
      icon: Sparkles,
      title: t('aboutPage.operations.pillar2.title'),
      description: t('aboutPage.operations.pillar2.description'),
      tag: t('aboutPage.operations.pillar2.tag'),
    },
    {
      key: 'pillar3',
      index: '03',
      icon: Truck,
      title: t('aboutPage.operations.pillar3.title'),
      description: t('aboutPage.operations.pillar3.description'),
      tag: t('aboutPage.operations.pillar3.tag'),
    },
  ];

  return (
    <section
      aria-labelledby="operations-heading"
      className={cn('space-y-8 text-start', className)}>
      {/* Section Header with Asymmetric Editorial Staging */}
      <Reveal variant="fade-scale">
        <div className="space-y-3 max-w-3xl border-b border-border pb-6">
          <div className="text-xs font-mono rtl:font-sans font-semibold tracking-widest rtl:tracking-normal text-muted-foreground uppercase">
            04 // {t('aboutPage.operations.badge')}
          </div>
          <h2
            id="operations-heading"
            className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground leading-tight">
            {t('aboutPage.operations.heading')}
          </h2>
          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            {t('aboutPage.operations.subtitle')}
          </p>
        </div>
      </Reveal>

      {/* Asymmetric Split: Supporting Image + Structural Specification Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        {/* Left: Offset Architectural Image (col-span-5) */}
        <Reveal variant="fade-scale" className="lg:col-span-5 flex">
          <div className="relative overflow-hidden border border-border bg-muted/20 shadow-xs w-full flex flex-col min-h-75 lg:min-h-full">
            <div className="relative flex-1 w-full min-h-75 overflow-hidden">
              <Image
                src="/images/about-2.webp"
                alt={t('aboutPage.operations.heading')}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 45vw, 520px"
                className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-102 motion-reduce:transform-none"
              />
              <div
                className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/70 via-transparent to-transparent"
                aria-hidden="true"
              />
              <div className="absolute inset-s-4 bottom-4 z-10 space-y-1">
                <div className="inline-flex items-center gap-2 bg-background/90 px-3 py-1.5 text-xs font-mono font-medium text-foreground backdrop-blur-xs border border-border">
                  <span>SPECIALIZED HEAVY FLEET & STONE ARTISTRY</span>
                </div>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Right: 3-Pillar Monolithic Specification Panels (col-span-7) */}
        <Reveal variant="stagger-children" className="lg:col-span-7 flex flex-col justify-between space-y-4">
          {capabilities.map((cap) => {
            const Icon = cap.icon;

            return (
              <RevealItem key={cap.key}>
                <div className="group border border-border bg-card p-6 shadow-xs transition-all duration-300 hover:border-foreground/40 hover:bg-muted/20 text-start space-y-3">
                  <div className="flex items-center justify-between border-b border-border pb-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-foreground">
                        {cap.index}.
                      </span>
                      <Icon className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" aria-hidden="true" />
                    </div>
                    <span className="font-mono rtl:font-sans text-[11px] uppercase tracking-wider rtl:tracking-normal px-2 py-0.5 bg-muted text-muted-foreground border border-border">
                      {cap.tag}
                    </span>
                  </div>

                  <h3 className="font-heading text-base sm:text-lg font-bold tracking-tight text-foreground transition-colors group-hover:text-foreground">
                    {cap.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
                    {cap.description}
                  </p>
                </div>
              </RevealItem>
            );
          })}
        </Reveal>
      </div>
    </section>
  );
}
