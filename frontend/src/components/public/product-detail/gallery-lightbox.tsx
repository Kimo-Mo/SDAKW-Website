'use client';

import { useEffect, useState, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useTranslations } from 'next-intl';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ProductGalleryLightboxProps {
  images: Array<{ url: string; publicId: string }>;
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
  locale: string;
}

/**
 * Full-screen overlay lightbox for browsing product gallery images.
 * Supports animated transitions, keyboard navigation (Escape/Arrows),
 * touch swipe, and RTL-aware directional controls.
 */
export function GalleryLightbox({
  images,
  initialIndex,
  isOpen,
  onClose,
  locale,
}: ProductGalleryLightboxProps) {
  const t = useTranslations('public');
  const [prevInitialIndex, setPrevInitialIndex] = useState(initialIndex);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const isRtl = locale === 'ar';

  if (initialIndex !== prevInitialIndex) {
    setPrevInitialIndex(initialIndex);
    setCurrentIndex(initialIndex);
  }

  const total = images.length;

  const handlePrevious = useCallback(() => {
    if (total <= 1) return;
    setCurrentIndex((prev) => (prev === 0 ? total - 1 : prev - 1));
  }, [total]);

  const handleNext = useCallback(() => {
    if (total <= 1) return;
    setCurrentIndex((prev) => (prev === total - 1 ? 0 : prev + 1));
  }, [total]);

  // Keyboard navigation & body scroll lock
  useEffect(() => {
    if (!isOpen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowLeft') {
        if (isRtl) {
          handleNext();
        } else {
          handlePrevious();
        }
      } else if (e.key === 'ArrowRight') {
        if (isRtl) {
          handlePrevious();
        } else {
          handleNext();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, isRtl, handlePrevious, handleNext, onClose]);

  if (!isOpen || images.length === 0) {
    return null;
  }

  const currentImage = images[currentIndex];

  return (
    <AnimatePresence>
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={t('productDetail.sections.gallery')}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-md p-3 sm:p-6 md:p-10 select-none"
        onClick={onClose}>
        {/* Top Control Bar */}
        <div
          className="absolute inset-x-0 top-0 z-20 flex items-center justify-between p-4 sm:p-6 text-white bg-linear-to-b from-black/80 to-transparent"
          onClick={(e) => e.stopPropagation()}>
          {/* Counter */}
          <div className="text-xs font-mono tracking-widest text-white/90 bg-white/10 px-3 py-1 border border-white/20 backdrop-blur-xs">
            {t('productDetail.gallery.lightbox.counter', {
              current: currentIndex + 1,
              total,
            })}
          </div>

          {/* Close Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            aria-label={t('productDetail.gallery.lightbox.close')}
            className="h-10 w-10 rounded-none bg-white/10 text-white hover:bg-white/20 hover:text-white transition-colors cursor-pointer">
            <X className="h-5 w-5" aria-hidden="true" />
          </Button>
        </div>

        {/* Previous Navigation Button */}
        {total > 1 && (
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              handlePrevious();
            }}
            aria-label={t('productDetail.gallery.lightbox.previous')}
            className="absolute left-2 sm:left-6 z-20 h-11 w-11 rounded-none border border-white/20 bg-black/60 text-white hover:bg-white/20 hover:text-white transition-all shadow-lg backdrop-blur-xs focus-visible:ring-1 focus-visible:ring-white cursor-pointer">
            {isRtl ? (
              <ChevronRight className="h-6 w-6" aria-hidden="true" />
            ) : (
              <ChevronLeft className="h-6 w-6" aria-hidden="true" />
            )}
          </Button>
        )}

        {/* Main Image Container with gesture swipe */}
        <div
          className="relative max-h-[85vh] max-w-[90vw] flex items-center justify-center overflow-hidden"
          onClick={(e) => e.stopPropagation()}>
          <AnimatePresence mode="wait">
            <motion.img
              key={`lightbox-img-${currentIndex}`}
              src={currentImage.url}
              alt={t('productDetail.gallery.imageAlt', {
                index: currentIndex + 1,
                total,
              })}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.3}
              onDragEnd={(_, info) => {
                const swipeThreshold = 50;
                if (info.offset.x > swipeThreshold) {
                  if (isRtl) handleNext();
                  else handlePrevious();
                } else if (info.offset.x < -swipeThreshold) {
                  if (isRtl) handlePrevious();
                  else handleNext();
                }
              }}
              className="max-h-[80vh] max-w-full rounded-none border border-white/10 object-contain shadow-2xl cursor-grab active:cursor-grabbing"
            />
          </AnimatePresence>
        </div>

        {/* Next Navigation Button */}
        {total > 1 && (
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            aria-label={t('productDetail.gallery.lightbox.next')}
            className="absolute right-2 sm:right-6 z-20 h-11 w-11 rounded-none border border-white/20 bg-black/60 text-white hover:bg-white/20 hover:text-white transition-all shadow-lg backdrop-blur-xs focus-visible:ring-1 focus-visible:ring-white cursor-pointer">
            {isRtl ? (
              <ChevronLeft className="h-6 w-6" aria-hidden="true" />
            ) : (
              <ChevronRight className="h-6 w-6" aria-hidden="true" />
            )}
          </Button>
        )}
      </motion.div>
    </AnimatePresence>
  );
}
