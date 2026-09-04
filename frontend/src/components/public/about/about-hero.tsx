'use client';

import { useTranslations } from 'next-intl';
import { m, useReducedMotion } from 'framer-motion';
import { Building2, FileDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { AboutHeroProps } from '@/types/public';
import { cn } from '@/lib/utils';

/**
 * About Us Page Hero Section
 * Implements an asymmetric editorial masthead with monolithic typography,
 * high-contrast mono 26+ years metric block, and sharp architectural framing.
 */
export function AboutHero({ className }: AboutHeroProps) {
  const t = useTranslations('public');
  const shouldReduceMotion = useReducedMotion();

  const easeArchitectural = [0.16, 1, 0.3, 1] as const;

  const containerVariants = {
    hidden: { opacity: shouldReduceMotion ? 1 : 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: shouldReduceMotion ? 0 : 0.08,
        delayChildren: shouldReduceMotion ? 0 : 0.04,
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
      aria-labelledby="about-hero-heading"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className={cn(
        'relative border border-border bg-card p-6 sm:p-10 lg:p-12 shadow-xs text-start',
        className
      )}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-stretch">
        {/* Left / Editorial Narrative Column */}
        <div className="lg:col-span-7 xl:col-span-8 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            {/* Architectural Category Tag */}
            <m.div variants={itemVariants}>
              <div className="inline-flex items-center gap-2 text-xs font-mono font-semibold tracking-wider rtl:tracking-normal rtl:font-sans text-muted-foreground uppercase">
                <Building2 className="h-3.5 w-3.5 text-foreground shrink-0" aria-hidden="true" />
                <span>{t('aboutPage.badge')}</span>
                <span className="text-border" aria-hidden="true">|</span>
              </div>
            </m.div>

            {/* Main Corporate Headline */}
            <m.div variants={itemVariants} className="space-y-2">
              <h1
                id="about-hero-heading"
                className="font-heading text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight text-foreground leading-[1.15]">
                {t('aboutPage.title')}
              </h1>
              <p className="text-base sm:text-lg lg:text-xl font-medium text-muted-foreground">
                {t('aboutPage.subtitle')}
              </p>
            </m.div>

            {/* Corporate Slogan Tagline Callout */}
            <m.div
              variants={itemVariants}
              className="border-s-2 border-foreground ps-4 py-1">
              <p className="font-heading text-lg sm:text-xl lg:text-2xl font-semibold tracking-tight text-foreground/90">
                {t('aboutPage.tagline')}
              </p>
            </m.div>
          </div>

          {/* Download Action */}
          <m.div variants={itemVariants} className="pt-2">
            <a
              href="/documents/sda-corporate-profile.pdf"
              target="_blank"
              rel="noopener noreferrer"
              download
              className="inline-block">
              <Button
                variant="outline"
                size="lg"
                className="rounded-none px-6 h-11 gap-2.5 text-xs sm:text-sm font-mono rtl:font-sans uppercase tracking-wider rtl:tracking-normal font-semibold border-border hover:bg-muted active:scale-[0.98] transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transform-none cursor-pointer">
                <FileDown className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{t('aboutPage.downloadProfile')}</span>
              </Button>
            </a>
          </m.div>
        </div>

        {/* Right / Monolithic Metric Column */}
        <m.div
          variants={itemVariants}
          className="lg:col-span-5 xl:col-span-4 flex flex-col justify-between border border-border bg-muted/30 p-6 sm:p-8 space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-mono text-muted-foreground uppercase tracking-widest border-b border-border pb-3">
              <span>METRIC_01</span>
              <span>EST. 1999</span>
            </div>
            
            {/* Bold Heroic Stat */}
            <div className="font-mono text-6xl sm:text-7xl lg:text-8xl font-black tracking-tighter text-foreground leading-none">
              {t('aboutPage.experienceYears')}
            </div>

            <p className="text-xs sm:text-sm font-sans uppercase tracking-wider rtl:tracking-normal text-muted-foreground leading-relaxed">
              {t('aboutPage.experienceLabel')}
            </p>
          </div>

          {/* Hairline Technical Corner Accents */}
          <div className="pt-4 border-t border-border flex items-center justify-between text-[11px] font-mono text-muted-foreground">
            <span>KUWAIT</span>
            <span>TIER-1 GENERAL CONTRACTING</span>
          </div>
        </m.div>
      </div>
    </m.section>
  );
}
