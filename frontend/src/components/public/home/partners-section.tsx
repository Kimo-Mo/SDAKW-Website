'use client';

import { useTranslations } from 'next-intl';
import { Reveal } from '@/components/shared/reveal';
import { PartnerLogosCarousel } from '@/components/shared/partner-logos-carousel';
import { PARTNERS_LIST } from '@/constants/partners';

/**
 * Public Home Page Partners & Clients Section.
 * Showcases strategic government ministries and private developers collaborating with SDAKW.
 * Features a scroll reveal heading with a continuous auto-scrolling partner logo carousel.
 */
export function PartnersSection() {
  const t = useTranslations('public');

  return (
    <section className="w-full py-14 sm:py-18 lg:py-20">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
        {/* Section Header with Asymmetric Editorial Staging */}
        <Reveal variant="fade-scale">
          <div className="space-y-3 max-w-3xl border-b border-border pb-6 text-start">
            <div className="text-xs font-mono rtl:font-sans font-semibold tracking-widest rtl:tracking-normal text-muted-foreground uppercase">
              05 // {t('partners.badge')}
            </div>

            <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground">
              {t('partners.title')}
            </h2>

            <p className="text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed">
              {t('partners.subtitle')}
            </p>
          </div>
        </Reveal>

        {/* Continuous Auto-scrolling Carousel */}
        <div className="pt-2">
          <PartnerLogosCarousel items={PARTNERS_LIST} speedMs={2500} />
        </div>
      </div>
    </section>
  );
}
