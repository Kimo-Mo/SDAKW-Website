'use client';

import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { Building2 } from 'lucide-react';
import { Reveal, RevealItem } from '@/components/shared/reveal';
import type { ContactHeaderProps } from '@/types/public';
import { cn } from '@/lib/utils';

/**
 * Contact Page Header Section
 * Displays asymmetric editorial masthead pairing corporate title and narrative
 * with an offset architectural headquarters showcase image.
 */
export function ContactHeader({ className }: ContactHeaderProps) {
  const t = useTranslations('public');

  return (
    <div className={cn('w-full', className)}>
      <Reveal variant="stagger-children" staggerDelay={0.1}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Heading & Editorial Narrative */}
          <RevealItem className="lg:col-span-6 xl:col-span-7 space-y-6 text-start">
            <div className="space-y-3">
              <div className="text-xs font-mono rtl:font-sans font-semibold tracking-widest rtl:tracking-normal text-muted-foreground uppercase">
                01 // {t('contactPage.badge')}
              </div>

              <h1 className="font-heading text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-foreground leading-tight">
                {t('contactPage.title')}
              </h1>
            </div>

            {/* Subtitle with Architectural Accent Line */}
            <div className="border-s-2 border-primary ps-4 py-1">
              <p className="text-base sm:text-lg font-medium text-foreground leading-relaxed sm:leading-8">
                {t('contactPage.subtitle')}
              </p>
            </div>
          </RevealItem>

          {/* Right Column: Supporting Architectural Headquarters Image */}
          <RevealItem className="lg:col-span-6 xl:col-span-5">
            <div className="relative overflow-hidden border border-border bg-card shadow-xs">
              <div className="relative aspect-4/3 sm:aspect-16/10 w-full overflow-hidden">
                <Image
                  src="/images/contact-1.webp"
                  alt={t('contactPage.title')}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 550px"
                  className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-102 motion-reduce:transform-none"
                />

                {/* Subtle visual gradient scrim */}
                <div
                  className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent"
                  aria-hidden="true"
                />

                {/* Floating Monolithic Location Tag */}
                <div className="absolute -inset-s-1 sm:inset-s-6 -bottom-1 sm:bottom-6 z-10">
                  <div className="inline-flex items-center gap-2 bg-background/90 px-3 py-1.5 text-xs font-mono rtl:font-sans rtl:tracking-normal font-medium text-foreground backdrop-blur-xs border border-border shadow-xs">
                    <Building2 className="h-4 w-4 text-chart-2 shrink-0" />
                    <span>HAMAD TOWER // SHARQ, KUWAIT</span>
                  </div>
                </div>
              </div>
            </div>
          </RevealItem>
        </div>
      </Reveal>
    </div>
  );
}
