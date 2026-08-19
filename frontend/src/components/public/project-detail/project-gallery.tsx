'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { ImageIcon, Images } from 'lucide-react';
import type { ProjectGalleryProps } from '@/types/public';
import { GalleryLightbox } from './gallery-lightbox';
import { cn } from '@/lib/utils';

interface GalleryThumbnailProps {
  image: { url: string; publicId: string };
  index: number;
  total: number;
  projectTitle: string;
  onClick: () => void;
}

function GalleryThumbnail({ image, index, total, projectTitle, onClick }: GalleryThumbnailProps) {
  const t = useTranslations('public');
  const [imageError, setImageError] = useState(false);

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={t('projectDetail.gallery.imageAlt', { index: index + 1, total })}
      className="group relative aspect-4/3 sm:aspect-square w-full overflow-hidden rounded-xl sm:rounded-2xl border border-border/60 bg-muted/40 shadow-xs focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-primary text-start cursor-pointer transition-all duration-300 hover:border-primary/50 hover:shadow-md">
      {!imageError ? (
        <Image
          src={image.url}
          alt={`${projectTitle} - ${index + 1}`}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          onError={() => setImageError(true)}
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div className="flex h-full w-full flex-col items-center justify-center gap-1.5 bg-muted/50 p-2 text-muted-foreground">
          <ImageIcon className="h-6 w-6 text-muted-foreground/60" aria-hidden="true" />
          <span className="text-xs font-medium truncate max-w-full">
            {index + 1} / {total}
          </span>
        </div>
      )}

      {/* Subtle hover overlay */}
      <div className="absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/15" />
    </button>
  );
}

/**
 * Responsive image gallery section for the public project detail page.
 * Displays thumbnail grid and launches the full-screen overlay lightbox.
 * Strictly omitted when gallery images are absent.
 */
export function ProjectGallery({ images, projectTitle, locale, className }: ProjectGalleryProps) {
  const t = useTranslations('public');
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (!images || images.length === 0) {
    return null;
  }

  const handleOpenLightbox = (index: number) => {
    setSelectedImageIndex(index);
    setIsLightboxOpen(true);
  };

  return (
    <section
      aria-labelledby="project-gallery-heading"
      className={cn('space-y-4 sm:space-y-6', className)}>
      {/* Section Header */}
      <div className="flex items-center gap-2.5 pb-2 border-b border-border/40">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
          <Images className="h-4 w-4" aria-hidden="true" />
        </div>
        <h2
          id="project-gallery-heading"
          className="font-heading text-lg sm:text-xl font-bold tracking-tight text-foreground">
          {t('projectDetail.sections.gallery')}
        </h2>
        <span className="text-xs font-semibold text-muted-foreground ms-auto bg-muted px-2.5 py-0.5 rounded-full">
          {images.length}
        </span>
      </div>

      {/* Thumbnails Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
        {images.map((image, index) => (
          <GalleryThumbnail
            key={image.publicId || `gallery-${index}`}
            image={image}
            index={index}
            total={images.length}
            projectTitle={projectTitle}
            onClick={() => handleOpenLightbox(index)}
          />
        ))}
      </div>

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
