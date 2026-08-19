'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { BrandedImageFallback } from '@/components/public/branded-image-fallback';
import type { ProjectHeroProps } from '@/types/public';
import { cn } from '@/lib/utils';

/**
 * Full-width hero cover image component for the public project detail page.
 * Displays optimized cover image with priority loading and branded fallback.
 */
export function ProjectHero({ coverImage, title, className }: ProjectHeroProps) {
  const [imageError, setImageError] = useState(false);

  const hasValidImage = Boolean(coverImage?.url) && !imageError;

  return (
    <div
      className={cn(
        'relative aspect-video sm:aspect-21/9 w-full overflow-hidden rounded-2xl sm:rounded-3xl border border-border/80 bg-muted/30 shadow-xs',
        className
      )}
    >
      {hasValidImage ? (
        <Image
          src={coverImage!.url}
          alt={title}
          fill
          priority
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1200px"
          onError={() => setImageError(true)}
          className="object-cover transition-transform duration-700 hover:scale-102"
        />
      ) : (
        <BrandedImageFallback aspectRatio="video" />
      )}
    </div>
  );
}
