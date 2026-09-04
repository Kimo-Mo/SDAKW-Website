import type { BrandedImageFallbackProps } from '@/types/public';
import { cn } from '@/lib/utils';

/**
 * Branded Luxury Architectural Image Fallback
 * Renders an elegant geometric placeholder with the SDAKW emblem when an image
 * is missing, loading, or fails to fetch, strictly preserving the container aspect ratio.
 */
export function BrandedImageFallback({
  className,
  aspectRatio = 'video',
  showLabel = true,
}: BrandedImageFallbackProps) {
  const aspectClass =
    aspectRatio === 'square'
      ? 'aspect-square'
      : aspectRatio === '4/3'
        ? 'aspect-4/3'
        : aspectRatio === '16/10'
          ? 'aspect-16/10'
          : 'aspect-video';

  return (
    <div
      role="img"
      aria-label="SDAKW Project Image Placeholder"
      className={cn(
        'relative w-full overflow-hidden bg-card flex flex-col items-center justify-center p-6 text-center select-none border border-hairline',
        aspectClass,
        className
      )}>
      {/* Background Architectural Grid Accent */}
      <div
        className="pointer-events-none absolute inset-0 opacity-15 bg-[radial-gradient(var(--muted-foreground)_1px,transparent_1px)] bg-size-[16px_16px]"
        aria-hidden="true"
      />

      <div className="relative z-10 flex flex-col items-center gap-3">
        {/* Geometric Emblem SVG */}
        <div className="flex h-14 w-14 items-center justify-center bg-card border border-border/80 shadow-xs text-primary transition-transform duration-300">
          <svg
            className="h-8 w-8"
            viewBox="0 0 48 48"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true">
            {/* Architectural Diamond / Tower Icon */}
            <polygon points="24,4 44,24 24,44 4,24" />
            <path d="M16,32 L16,20 L24,12 L32,20 L32,32 Z" fill="currentColor" fillOpacity="0.15" />
            <line x1="24" y1="12" x2="24" y2="32" />
          </svg>
        </div>

        {showLabel && (
          <div className="space-y-0.5">
            <p className="font-heading text-xs sm:text-sm font-bold tracking-tight text-foreground/80 uppercase">
              SDAKW
            </p>
            <p className="text-xs sm:text-xs text-muted-foreground font-medium">
              Salem Duwaih Al Ajmi Co.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
