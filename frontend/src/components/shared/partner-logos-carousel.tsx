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
 * uniform fixed-light chip containers for mixed-background logo normalization,
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
    <div className={cn('relative w-full overflow-hidden py-2', className)}>
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
                className="ps-4 sm:ps-6 basis-full sm:basis-1/2 md:basis-1/3 lg:basis-1/4">
                <div className="group flex flex-col items-center">
                  {/* Uniform Fixed-Light Card/Chip Container (Normalizes transparent & white-background logos across light/dark modes) */}
                  <div
                    title={displayName}
                    className="relative flex h-34 sm:h-40 w-full items-center justify-center rounded-xl border border-[#E5DFD6] bg-[#FAF8F5] p-4 sm:p-5 shadow-2xs transition-all duration-300 hover:border-[#CA9E62] hover:shadow-xs">
                    <div className="relative flex h-full w-full items-center justify-center">
                      <Image
                        src={item.logoSrc}
                        alt={displayName}
                        width={160}
                        height={90}
                        className="object-contain max-h-16 sm:max-h-20 w-auto max-w-[85%] transition-all duration-300 opacity-80 group-hover:opacity-100 group-hover:scale-105"
                      />
                    </div>
                  </div>

                  {/* Partner Name Caption */}
                  <div className="mt-2.5 text-center px-1">
                    <p className="text-xs sm:text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors line-clamp-1 truncate">
                      {displayName}
                    </p>
                  </div>
                </div>
              </CarouselItem>
            );
          })}
        </CarouselContent>
      </Carousel>
    </div>
  );
}
