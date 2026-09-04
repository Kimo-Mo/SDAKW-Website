import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { ArrowRight, CheckCircle2, ShieldCheck } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { Reveal } from '@/components/shared/reveal';

/**
 * Public Home Page Company Introduction Section.
 * Highlights SDAKW's founding in 1999, executive overview, craftsmanship image, and ISO certifications.
 * Implements an asymmetric editorial layout with monolithic prestige styling.
 */
export function IntroSection() {
  const t = useTranslations('public');

  return (
    <section className="w-full overflow-hidden">
      <div className="main_section grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 xl:gap-16 items-center">
        {/* Left Column: Narrative & Values (Asymmetric Editorial Layout) */}
        <Reveal variant="fade-up" className="lg:col-span-6 xl:col-span-5 space-y-6 text-start">
          <div className="space-y-3">
            <div className="text-xs font-mono rtl:font-sans font-semibold tracking-widest rtl:tracking-normal text-muted-foreground uppercase">
              01 // {t('intro.badge')}
            </div>

            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground leading-tight">
              {t('intro.title')}
            </h2>
          </div>

          {/* Lead Paragraph with Architectural Accent Line */}
          <div className="border-s-2 border-primary ps-4 py-1">
            <p className="text-base sm:text-lg font-medium text-foreground leading-relaxed sm:leading-8">
              {t('intro.paragraph1')}
            </p>
          </div>

          <div className="space-y-4 text-sm sm:text-base text-muted-foreground leading-relaxed">
            <p>{t('intro.paragraph2')}</p>
          </div>

          <div className="pt-2">
            <Link href="/about">
              <Button
                size="lg"
                className="rounded-none px-6 h-11 gap-2.5 text-xs sm:text-sm font-mono rtl:font-sans uppercase tracking-wider rtl:tracking-normal font-semibold shadow-xs active:scale-[0.98] transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transform-none cursor-pointer">
                <span>{t('intro.learnMore')}</span>
                <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
              </Button>
            </Link>
          </div>
        </Reveal>

        {/* Right Column: Asymmetric Editorial Image & ISO Certifications */}
        <Reveal variant="fade-scale" delay={0.15} className="lg:col-span-6 xl:col-span-7 space-y-6">
          {/* Supporting Architectural Craftsmanship Image */}
          <div className="relative overflow-hidden border border-border bg-card shadow-xs">
            <div className="relative aspect-4/3 sm:aspect-16/10 w-full overflow-hidden">
              <Image
                src="/images/about-preview.webp"
                alt={t('intro.imageAlt')}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 650px"
                className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-102 motion-reduce:transform-none"
              />
              {/* Subtle visual gradient scrim */}
              <div
                className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent"
                aria-hidden="true"
              />

              {/* Floating Monolithic Trust Badge */}
              <div className="absolute -inset-s-1 sm:inset-s-6 -bottom-1 sm:bottom-6 z-10">
                <div className="inline-flex items-center gap-2 bg-background/90 px-3 py-1.5 text-xs font-mono rtl:font-sans rtl:tracking-normal font-medium text-foreground backdrop-blur-xs border border-border shadow-xs">
                  <CheckCircle2 className="h-4 w-4 text-chart-2 shrink-0" />
                  <span>{t('intro.trustBadge')}</span>
                </div>
              </div>
            </div>
          </div>

          {/* 3-Pillar ISO Triple Certification Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* ISO 9001 */}
            <div className="group border border-border bg-card p-3.5 shadow-2xs transition-all duration-300 hover:border-foreground/40 hover:bg-muted/20 text-start space-y-2">
              <div className="flex items-center justify-between border-b border-border pb-2">
                <span className="font-mono text-xs sm:text-sm font-bold text-foreground">
                  ISO 9001:2015
                </span>
                <ShieldCheck
                  className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors"
                  aria-hidden="true"
                />
              </div>
              <div className="text-[11px] text-muted-foreground leading-snug">
                {t('intro.iso9001Subtitle')}
              </div>
            </div>

            {/* ISO 14001 */}
            <div className="group border border-border bg-card p-3.5 shadow-2xs transition-all duration-300 hover:border-foreground/40 hover:bg-muted/20 text-start space-y-2">
              <div className="flex items-center justify-between border-b border-border pb-2">
                <span className="font-mono text-xs sm:text-sm font-bold text-foreground">
                  ISO 14001:2015
                </span>
                <ShieldCheck
                  className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors"
                  aria-hidden="true"
                />
              </div>
              <div className="text-[11px] text-muted-foreground leading-snug">
                {t('intro.iso14001Subtitle')}
              </div>
            </div>

            {/* ISO 45001 */}
            <div className="group border border-border bg-card p-3.5 shadow-2xs transition-all duration-300 hover:border-foreground/40 hover:bg-muted/20 text-start space-y-2">
              <div className="flex items-center justify-between border-b border-border pb-2">
                <span className="font-mono text-xs sm:text-sm font-bold text-foreground">
                  ISO 45001:2018
                </span>
                <ShieldCheck
                  className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors"
                  aria-hidden="true"
                />
              </div>
              <div className="text-[11px] text-muted-foreground leading-snug">
                {t('intro.iso45001Subtitle')}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
