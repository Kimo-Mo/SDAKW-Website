'use client';

import React, { useRef } from 'react';
import { m, useInView, useReducedMotion, type Variants } from 'framer-motion';

export type RevealVariant = 'fade-up' | 'fade-scale' | 'stagger-children';

export interface RevealProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  yOffset?: number;
  variant?: RevealVariant;
  staggerDelay?: number;
}

const EASE_ARCHITECTURAL = [0.16, 1, 0.3, 1] as const;

export const revealItemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      ease: EASE_ARCHITECTURAL,
    },
  },
};

export function RevealItem({
  children,
  className = '',
}: {
  children: React.ReactNode;
  className?: string;
}) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <m.div variants={revealItemVariants} className={className}>
      {children}
    </m.div>
  );
}

/**
 * Reusable Multi-Variant Scroll-Reveal Wrapper.
 * Supports 'fade-up', 'fade-scale', and 'stagger-children' entrance profiles.
 * Fully honors prefers-reduced-motion across all variants.
 * Uses lightweight LazyMotion m.div component.
 */
export function Reveal({
  children,
  className = '',
  delay = 0,
  duration = 0.5,
  yOffset = 24,
  variant = 'fade-up',
  staggerDelay = 0.08,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-40px 0px' });
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  // Variant: Stagger Children
  if (variant === 'stagger-children') {
    const containerVariants: Variants = {
      hidden: { opacity: 0 },
      visible: {
        opacity: 1,
        transition: {
          staggerChildren: staggerDelay,
          delayChildren: delay,
        },
      },
    };

    return (
      <m.div
        ref={ref}
        initial="hidden"
        animate={isInView ? 'visible' : 'hidden'}
        variants={containerVariants}
        className={className}>
        {children}
      </m.div>
    );
  }

  // Variant: Fade Scale
  if (variant === 'fade-scale') {
    return (
      <m.div
        ref={ref}
        initial={{ opacity: 0, scale: 0.96, y: 14 }}
        animate={isInView ? { opacity: 1, scale: 1, y: 0 } : { opacity: 0, scale: 0.96, y: 14 }}
        transition={{
          duration,
          delay,
          ease: EASE_ARCHITECTURAL,
        }}
        className={className}>
        {children}
      </m.div>
    );
  }

  // Variant: Fade Up (Default)
  return (
    <m.div
      ref={ref}
      initial={{ opacity: 0, y: yOffset }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: yOffset }}
      transition={{
        duration,
        delay,
        ease: EASE_ARCHITECTURAL,
      }}
      className={className}>
      {children}
    </m.div>
  );
}
