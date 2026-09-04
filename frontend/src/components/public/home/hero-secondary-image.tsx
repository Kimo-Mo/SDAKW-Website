'use client';

import { useRef } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { m, useScroll, useTransform, useReducedMotion } from 'framer-motion';

/**
 * HeroSecondaryImage — Signature Architectural Showcase Image.
 * Sits directly below the hero headline/metrics, presenting a confident,
 * monolithic architectural perspective with a subtle scroll-linked parallax and depth scale.
 * Strictly respects prefers-reduced-motion with an instant static layout.
 */
export function HeroSecondaryImage() {
  const t = useTranslations('public');
  const containerRef = useRef<HTMLDivElement>(null);
  const shouldReduceMotion = useReducedMotion();

  // Scroll-linked parallax tracking
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [0.88, 1, 1.03]);
  const y = useTransform(scrollYProgress, [0, 1], [-20, 20]);
  const imageY = useTransform(scrollYProgress, [0, 1], [-30, 30]);

  return (
    <section
      ref={containerRef}
      aria-label={t('hero.secondaryImageAlt')}
      className="main_section py-0!">
      <m.div
        style={shouldReduceMotion ? undefined : { scale, y }}
        className="relative overflow-hidden border border-border bg-card shadow-xs">
        {/* Outer aspect ratio container */}
        <div className="relative aspect-video sm:aspect-21/9 w-full overflow-hidden">
          <m.div
            style={shouldReduceMotion ? undefined : { y: imageY, scale: 1.08 }}
            className="absolute inset-0 w-full h-full">
            <Image
              src="/images/hero-secondary.webp"
              alt={t('hero.secondaryImageAlt')}
              fill
              priority
              fetchPriority="high"
              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 90vw, 1200px"
              className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] hover:scale-102 motion-reduce:transform-none"
            />
          </m.div>

          {/* Architectural gradient scrim for seamless visual grounding */}
          <div
            className="pointer-events-none absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent"
            aria-hidden="true"
          />

          {/* Floating Monolithic Brand Tag */}
          <div className="absolute -inset-s-1 sm:inset-s-8 -bottom-1 sm:bottom-8 z-10">
            <div className="inline-flex items-center gap-2.5 border border-border bg-background/90 px-3 py-1.5 text-xs font-mono rtl:font-sans rtl:tracking-normal font-medium text-foreground backdrop-blur-xs shadow-xs">
              <span className="h-2 w-2 bg-chart-2 animate-pulse shrink-0" />
              <span>{t('brand.name')}</span>
            </div>
          </div>
        </div>
      </m.div>
    </section>
  );
}
