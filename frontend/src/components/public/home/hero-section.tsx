'use client';

import { useTranslations } from 'next-intl';
import { m, useReducedMotion } from 'framer-motion';
import { ArrowRight, FolderKanban, PhoneCall } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { HeroMetrics } from './hero-metrics';

/**
 * Public Home Page Hero Section.
 * Implements the focal architectural entrance motion sequence
 * with staggered metric revelations and strict prefers-reduced-motion support.
 * Uses lightweight LazyMotion m components.
 */
export function HeroSection() {
  const t = useTranslations('public');
  const shouldReduceMotion = useReducedMotion();

  const easeArchitectural = [0.16, 1, 0.3, 1] as const;

  const containerVariants = {
    hidden: { opacity: shouldReduceMotion ? 1 : 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.08,
        delayChildren: shouldReduceMotion ? 0 : 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: shouldReduceMotion ? 1 : 0,
      y: shouldReduceMotion ? 0 : 16,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.5,
        ease: easeArchitectural,
      },
    },
  };

  return (
    <m.section
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="relative w-full overflow-hidden flex flex-col items-center text-center main_section">
      {/* Ambient background glow with subtle architectural presence */}
      <div
        className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-137.5 h-80 bg-primary/10 blur-3xl z-1 transition-opacity duration-700"
        aria-hidden="true"
      />

      {/* Flagship Headline */}
      <m.h1
        variants={itemVariants}
        className="font-heading text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-foreground max-w-4xl leading-[1.15]">
        {t('hero.title')}
      </m.h1>

      {/* Subtitle Value Proposition */}
      <m.p
        variants={itemVariants}
        className="mt-6 text-sm sm:text-base md:text-lg text-muted-foreground max-w-2xl leading-relaxed">
        {t('hero.subtitle')}
      </m.p>

      {/* Primary Action Buttons */}
      <m.div
        variants={itemVariants}
        className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-center justify-center gap-3.5 sm:gap-4 w-full sm:w-auto">
        <Link href="/projects" className="w-full sm:w-auto">
          <Button
            size="lg"
            className="w-full sm:w-auto rounded-none px-7 h-12 gap-2.5 text-xs sm:text-sm font-mono rtl:font-sans uppercase tracking-wider rtl:tracking-normal font-semibold shadow-xs active:scale-[0.98] transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transform-none cursor-pointer">
            <FolderKanban className="h-4 w-4" aria-hidden="true" />
            <span>{t('hero.exploreProjects')}</span>
            <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
          </Button>
        </Link>

        <Link href="/contact" className="w-full sm:w-auto">
          <Button
            variant="outline"
            size="lg"
            className="w-full sm:w-auto rounded-none px-7 h-12 gap-2.5 text-xs sm:text-sm font-mono rtl:font-sans uppercase tracking-wider rtl:tracking-normal font-semibold border-border hover:bg-muted active:scale-[0.98] transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transform-none cursor-pointer">
            <PhoneCall className="h-4 w-4" aria-hidden="true" />
            <span>{t('hero.contactUs')}</span>
          </Button>
        </Link>
      </m.div>

      {/* 4 Sector Metric Badges Grid with Staggered Entrance and Micro-lifts */}
      <HeroMetrics />
    </m.section>
  );
}
