'use client';

import { useState, useSyncExternalStore } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { BrandedImageFallback } from '@/components/public/home/branded-image-fallback';
import type { ProductGalleryProps } from '@/types/public';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  type CarouselApi,
} from '@/components/ui/carousel';
import { GalleryLightbox } from './gallery-lightbox';
import { Reveal } from '@/components/shared/reveal';
import { cn } from '@/lib/utils';

interface GallerySlideProps {
  image: { url: string; publicId: string };
  index: number;
  total: number;
  productTitle: string;
  onClick: () => void;
}

function GallerySlide({ image, index, total, productTitle, onClick }: GallerySlideProps) {
  const t = useTranslations('public');
  const [imageError, setImageError] = useState(false);

  const hasValidImage = Boolean(image?.url) && !imageError;

  return (
    <div
      onClick={onClick}
      className="group/slide relative aspect-16/10 sm:aspect-21/9 w-full overflow-hidden border border-border bg-card cursor-pointer shadow-xs h-full">
      {hasValidImage ? (
        <Image
          src={image.url}
          alt={`${productTitle} - ${t('productDetail.gallery.imageAlt', { index: index + 1, total })}`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 75vw, (max-width: 1280px) 50vw, 420px"
          onError={() => setImageError(true)}
          className="object-contain transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover/slide:scale-102"
        />
      ) : (
        <BrandedImageFallback aspectRatio="video" />
      )}
    </div>
  );
}

/**
 * Manually controlled image gallery carousel for the public product detail page.
 * Uses shadcn/ui Carousel with RTL-aware sliding, keyboard accessibility, touch swipe,
 * slide indicator, and full-screen lightbox modal expansion.
 */
export function ProductGallery({ images, productTitle, locale, className }: ProductGalleryProps) {
  const t = useTranslations('public');
  const [api, setApi] = useState<CarouselApi>();
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const isRtl = locale === 'ar';

  const total = images?.length ?? 0;

  // Track active slide index via useSyncExternalStore
  const current = useSyncExternalStore(
    (onStoreChange) => {
      if (!api) return () => {};
      api.on('select', onStoreChange);
      api.on('reInit', onStoreChange);
      return () => {
        api.off('select', onStoreChange);
        api.off('reInit', onStoreChange);
      };
    },
    () => (api ? api.selectedScrollSnap() + 1 : 1),
    () => 1
  );

  if (!images || images.length === 0) {
    return null;
  }

  const handleOpenLightbox = (index: number) => {
    setSelectedImageIndex(index);
    setIsLightboxOpen(true);
  };

  return (
    <section
      aria-labelledby="product-gallery-heading"
      className={cn('space-y-4 sm:space-y-6 text-start', className)}>
      <Reveal variant="fade-scale">
        {/* Section Header */}
        <div className="flex items-center justify-between gap-2.5 pb-3 border-b border-border">
          <div className="flex items-center gap-2.5">
            <div
              id="product-gallery-heading"
              className="text-xs font-mono rtl:font-sans font-semibold tracking-widest rtl:tracking-normal text-muted-foreground uppercase">
              {t('productDetail.sections.galleryKicker')} <span aria-hidden="true">{'//'}</span>{' '}
              {t('productDetail.sections.gallery')}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Slide Counter */}
            <span className="text-xs font-mono text-muted-foreground bg-card border border-border px-2.5 py-0.5">
              {String(current).padStart(2, '0')} / {String(total).padStart(2, '0')}
            </span>
          </div>
        </div>
      </Reveal>

      {/* Manual Carousel Container */}
      <Reveal variant="fade-scale" delay={0.1}>
        <div className="relative group">
          <Carousel
            setApi={setApi}
            opts={{
              direction: isRtl ? 'rtl' : 'ltr',
              loop: true,
            }}
            className="w-full">
            <CarouselContent>
              {images.map((image, index) => (
                <CarouselItem
                  className="basis-full md:basis-3/4 lg:basis-1/2 xl:basis-1/3 aspect-video"
                  key={image.publicId || `gallery-${index}`}>
                  <GallerySlide
                    image={image}
                    index={index}
                    total={total}
                    productTitle={productTitle}
                    onClick={() => handleOpenLightbox(index)}
                  />
                </CarouselItem>
              ))}
            </CarouselContent>

            {/* Navigation Controls */}
            {total > 1 && (
              <div className="flex items-center justify-end gap-2 pt-3">
                <CarouselPrevious className="static translate-y-0 h-9 w-9 rounded-none border border-border bg-card text-foreground hover:bg-muted cursor-pointer" />
                <CarouselNext className="static translate-y-0 h-9 w-9 rounded-none border border-border bg-card text-foreground hover:bg-muted cursor-pointer" />
              </div>
            )}
          </Carousel>
        </div>
      </Reveal>

      {/* Lightbox Modal */}
      <GalleryLightbox
        images={images}
        initialIndex={selectedImageIndex}
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        locale={locale}
      />
    </section>
  );
}
