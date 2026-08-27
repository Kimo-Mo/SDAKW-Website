'use client';

import React, { useEffect, useState } from 'react';
import { useTranslations } from 'next-intl';
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion';

/**
 * CustomCursor — Signature Architectural Cursor Interaction.
 * Follows the mouse with smooth trailing spring physics on desktop / fine-pointer devices.
 * Expands into an 'Explore' / 'استكشف' pill over elements marked with `data-cursor="explore"`.
 * Completely disabled on touch-only devices and respects prefers-reduced-motion.
 */
export function CustomCursor() {
  const t = useTranslations('public');
  const shouldReduceMotion = useReducedMotion();

  // Subscribe to client hydration without cascading effect renders
  const mounted = React.useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  // Subscribe to touch-only device media query
  const isTouchOnly = React.useSyncExternalStore(
    (onStoreChange) => {
      if (typeof window === 'undefined') return () => {};
      const mqCoarse = window.matchMedia('(hover: none) and (pointer: coarse)');
      const mqFine = window.matchMedia('(pointer: fine)');
      mqCoarse.addEventListener('change', onStoreChange);
      mqFine.addEventListener('change', onStoreChange);
      return () => {
        mqCoarse.removeEventListener('change', onStoreChange);
        mqFine.removeEventListener('change', onStoreChange);
      };
    },
    () => {
      if (typeof window === 'undefined') return false;
      return (
        window.matchMedia('(hover: none) and (pointer: coarse)').matches &&
        !window.matchMedia('(pointer: fine)').matches
      );
    },
    () => false
  );

  const [isVisible, setIsVisible] = useState(false);
  const [isExplore, setIsExplore] = useState(false);

  const rawX = useMotionValue(-100);
  const rawY = useMotionValue(-100);

  // Smooth architectural trailing physics (slight lag/lerp)
  const springConfig = { damping: 28, stiffness: 350, mass: 0.4 };
  const smoothX = useSpring(rawX, springConfig);
  const smoothY = useSpring(rawY, springConfig);

  useEffect(() => {
    if (isTouchOnly) {
      return;
    }

    const handleMouseMove = (e: MouseEvent) => {
      rawX.set(e.clientX);
      rawY.set(e.clientY);
      setIsVisible(true);

      // Check if hovering any element with data-cursor="explore"
      const target = e.target as HTMLElement | null;
      const exploreEl = target?.closest('[data-cursor="explore"]');
      setIsExplore(Boolean(exploreEl));
    };

    const handleMouseLeave = () => {
      setIsVisible(false);
      setIsExplore(false);
    };

    const handleMouseEnter = () => {
      setIsVisible(true);
    };

    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [rawX, rawY, isTouchOnly]);

  if (!mounted || isTouchOnly || shouldReduceMotion) {
    return null;
  }

  return (
    <motion.div
      aria-hidden="true"
      style={{
        x: smoothX,
        y: smoothY,
        translateX: '-50%',
        translateY: '-50%',
      }}
      className="pointer-events-none fixed top-0 left-0 z-9999 flex items-center justify-center select-none"
      initial={{ opacity: 0 }}
      animate={{
        opacity: isVisible ? 1 : 0,
      }}
      transition={{ duration: 0.15 }}>
      {isExplore ? (
        <motion.div
          key="explore-pill"
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.85, opacity: 0 }}
          transition={{ type: 'spring', damping: 24, stiffness: 350 }}
          className="rounded-full bg-foreground text-background px-3.5 py-1.5 text-xs font-semibold tracking-wide shadow-lg flex items-center justify-center whitespace-nowrap">
          <span>{t('cursor.explore')}</span>
        </motion.div>
      ) : (
        <motion.div
          key="cursor-dot"
          className="h-2 w-2 rounded-full bg-foreground shadow-xs"
          transition={{ type: 'spring', damping: 24, stiffness: 350 }}
        />
      )}
    </motion.div>
  );
}
