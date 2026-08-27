'use client';

import * as React from 'react';
import Image from 'next/image';
import { useLocale } from 'next-intl';
import Autoplay from 'embla-carousel-autoplay';
import { useReducedMotion } from 'framer-motion';

import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { cn } from '@/lib/utils/utils';
import type { PartnerItem } from '@/constants/partners';

export interface PartnerLogosCarouselProps {
  items: PartnerItem[];
  className?: string;
  speedMs?: number;
}

/**
 * PartnerLogosCarousel — Reusable Continuous Auto-Scrolling Client/Partner Showcase.
 * Features smooth continuous auto-scrolling with Embla Autoplay, pause-on-hover/focus,
 * automatic RTL logical direction handling, grayscale-to-color transitions,
 * and complete autoplay disabling under prefers-reduced-motion.
 */
export function PartnerLogosCarousel({
  items,
  className = '',
  speedMs = 2500,
}: PartnerLogosCarouselProps) {
  const locale = useLocale();
  const isRtl = locale === 'ar';
  const shouldReduceMotion = useReducedMotion();

  // Configure Autoplay plugin (pauses on hover and interaction, disabled on reduced motion)
  const autoplayPlugin = React.useMemo(() => {
    if (shouldReduceMotion) {
      return [];
    }
    return [
      Autoplay({
        delay: speedMs,
        stopOnInteraction: false,
        stopOnMouseEnter: true,
      }),
    ];
  }, [shouldReduceMotion, speedMs]);

  // Duplicate items array slightly to ensure continuous smooth infinite marquee loop
  const displayItems = React.useMemo(() => {
    if (!items || items.length === 0) return [];
    return [...items, ...items];
  }, [items]);

  return (
    <div className={cn('relative w-full overflow-hidden', className)}>
      {/* Side gradient feathering for smooth edge transitions */}
      <div
        className="pointer-events-none absolute inset-y-0 inset-s-0 z-10 w-16 sm:w-24 bg-linear-to-e from-background to-transparent"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-y-0 inset-e-0 z-10 w-16 sm:w-24 bg-linear-to-s from-background to-transparent"
        aria-hidden="true"
      />

      <Carousel
        opts={{
          align: 'start',
          loop: true,
          direction: isRtl ? 'rtl' : 'ltr',
          dragFree: true,
        }}
        plugins={autoplayPlugin}
        className="w-full">
        <CarouselContent className="-ms-4 sm:-ms-6 items-center">
          {displayItems.map((item, index) => {
            const displayName =
              typeof item.name === 'string' ? item.name : isRtl ? item.name.ar : item.name.en;

            return (
              <CarouselItem
                key={`${item.id}-${index}`}
                className="ps-4 sm:ps-6 basis-1/1 sm:basis-1/2 md:basis-1/3 ">
                <div
                  title={displayName}
                  className="group relative flex h-32.5 items-center justify-center border border-border/70 bg-card/60 px-6 py-4 shadow-2xs transition-all duration-300 hover:border-foreground/40 hover:bg-card hover:shadow-xs">
                  <div className="relative  w-full max-w-32.5 flex items-center justify-center">
                    <Image
                      src={item.logoSrc}
                      alt={displayName}
                      width={130}
                      height={130}
                      className="object-contain max-h-24 w-auto transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                </div>
                  <div className="mt-2 text-center">
                    <p className="text-sm">{displayName}</p>
                  </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>
    </div>
  );
}
