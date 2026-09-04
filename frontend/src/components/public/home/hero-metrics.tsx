'use client';

import { useTranslations } from 'next-intl';
import { m, useReducedMotion, type Variants } from 'framer-motion';
import { Clock, Landmark, Building2, ShieldCheck, type LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface HeroMetricItem {
  id: string;
  index: string;
  icon: LucideIcon;
  value: string;
  label: string;
  variant?: 'primary';
  valueClassName?: string;
  isNumeric?: boolean;
}

export interface HeroMetricsProps {
  /** Optional custom metric items. If omitted, default 4 company sector metrics will be used. */
  items?: HeroMetricItem[];
  /** Optional CSS class name for the wrapper grid container. */
  className?: string;
}

export function HeroMetricCard({
  item,
  index = 0,
  variants,
}: {
  item: HeroMetricItem;
  index?: number;
  variants?: Variants;
}) {
  const Icon = item.icon;

  return (
    <m.div
      custom={index}
      variants={variants}
      className={cn(
        'group border border-border bg-card p-5 sm:p-6 shadow-xs text-start space-y-3',
        'transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:shadow-md hover:border-foreground/40 hover:bg-muted/20 motion-reduce:transform-none'
      )}>
      <div className="flex items-center justify-between border-b border-border pb-3">
        <span className="font-mono text-xs font-bold text-muted-foreground">
          METRIC_{item.index}
        </span>
        <Icon
          className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors"
          aria-hidden="true"
        />
      </div>

      <div
        className={cn(
          item.isNumeric
            ? 'font-mono text-2xl sm:text-3xl font-black tracking-tighter text-foreground'
            : 'font-heading text-base sm:text-lg font-bold tracking-tight text-foreground',
          item.valueClassName
        )}>
        {item.value}
      </div>

      <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{item.label}</p>
    </m.div>
  );
}

export function HeroMetrics({ items, className }: HeroMetricsProps) {
  const t = useTranslations('public');
  const shouldReduceMotion = useReducedMotion();
  const easeArchitectural = [0.16, 1, 0.3, 1] as const;

  const defaultItems: HeroMetricItem[] = [
    {
      id: 'experience',
      index: '01',
      icon: Clock,
      value: t('hero.metrics.experience.value'),
      label: t('hero.metrics.experience.label'),
      isNumeric: true,
      variant: 'primary',
    },
    {
      id: 'government',
      index: '02',
      icon: Landmark,
      value: t('hero.metrics.government.value'),
      label: t('hero.metrics.government.label'),
      variant: 'primary',
    },
    {
      id: 'private',
      index: '03',
      icon: Building2,
      value: t('hero.metrics.private.value'),
      label: t('hero.metrics.private.label'),
      variant: 'primary',
    },
    {
      id: 'iso',
      index: '04',
      icon: ShieldCheck,
      value: t('hero.metrics.iso.value'),
      label: t('hero.metrics.iso.label'),
      variant: 'primary',
    },
  ];

  const metricList = items || defaultItems;

  const metricVariants: Variants = {
    hidden: {
      opacity: shouldReduceMotion ? 1 : 0,
      y: shouldReduceMotion ? 0 : 12,
    },
    visible: (custom: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.45,
        delay: shouldReduceMotion ? 0 : 0.25 + custom * 0.06,
        ease: easeArchitectural,
      },
    }),
  };

  return (
    <div
      className={cn(
        'mt-14 sm:mt-18 w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6',
        className
      )}>
      {metricList.map((item, index) => (
        <HeroMetricCard key={item.id} item={item} index={index} variants={metricVariants} />
      ))}
    </div>
  );
}
