'use client';

import { useRef } from 'react';
import { useTranslations } from 'next-intl';
import { UploadCloud, Image as ImageIcon, Trash2, X, AlertTriangle } from 'lucide-react';
import Image from 'next/image';

import type { BackendImage } from '@/types/admin';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle } from '@/components/ui/empty';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { toast } from '@/components/ui/toast';

interface GalleryImageUploadProps {
  newGalleryFiles: File[];
  existingGallery: BackendImage[];
  onAddGalleryFiles: (files: File[]) => void;
  onRemoveNewGalleryFile: (index: number) => void;
  onDeleteExistingGallery?: (publicId: string) => void;
  deletingGalleryPublicId?: string | null;
}

export function GalleryImageUpload({
  newGalleryFiles,
  existingGallery,
  onAddGalleryFiles,
  onRemoveNewGalleryFile,
  onDeleteExistingGallery,
  deletingGalleryPublicId = null,
}: GalleryImageUploadProps) {
  const t = useTranslations('admin.projects.form.media');
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const totalGalleryCount = existingGallery.length + newGalleryFiles.length;
  const isGalleryFull = totalGalleryCount >= 10;

  const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const remainingSlots = 10 - (existingGallery.length + newGalleryFiles.length);
    if (remainingSlots <= 0) {
      toast.add({
        title: t('capWarning'),
        type: 'warning',
      });
      if (galleryInputRef.current) galleryInputRef.current.value = '';
      return;
    }

    if (files.length > remainingSlots) {
      toast.add({
        title: t('capWarning'),
        type: 'warning',
      });
    }

    const validFiles = files.slice(0, remainingSlots);
    onAddGalleryFiles(validFiles);

    // Reset input value so same files can be re-selected if removed
    if (galleryInputRef.current) {
      galleryInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-3 pt-4 border-t border-border/70">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <Label htmlFor="gallery-images-input" className="text-xs font-semibold text-foreground">
            {t('galleryTitle')}
          </Label>
          <p className="text-[11px] text-muted-foreground">
            {t('galleryDesc', { count: totalGalleryCount })}
          </p>
        </div>

        {!isGalleryFull && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => galleryInputRef.current?.click()}
            className="gap-1.5 text-xs h-8">
            <UploadCloud className="h-3.5 w-3.5" />
            <span>{t('dropGallery')}</span>
          </Button>
        )}
      </div>

      <input
        type="file"
        ref={galleryInputRef}
        onChange={handleGalleryChange}
        multiple
        accept="image/png,image/jpeg,image/jpg,image/webp"
        className="hidden"
        id="gallery-images-input"
      />

      {/* Gallery Limit Warning */}
      {isGalleryFull && (
        <div className="flex items-center gap-2 rounded-lg bg-amber-500/10 p-2.5 text-xs font-medium text-amber-600 dark:text-amber-400 border border-amber-500/20">
          <AlertTriangle className="h-4 w-4 shrink-0" />
          <span>{t('capWarning')}</span>
        </div>
      )}

      {/* Combined Gallery Thumbnails Grid */}
      {totalGalleryCount === 0 ? (
        <Empty
          onClick={() => galleryInputRef.current?.click()}
          className="border border-dashed border-border/80 bg-muted/10 p-6 text-center transition-colors hover:bg-muted/30 cursor-pointer">
          <EmptyHeader>
            <EmptyMedia
              variant="icon"
              className="size-10 rounded-full bg-primary/10 text-primary [&_svg]:size-5">
              <ImageIcon />
            </EmptyMedia>
            <EmptyTitle className="text-xs font-medium text-foreground">
              {t('dropGallery')}
            </EmptyTitle>
          </EmptyHeader>
        </Empty>
      ) : (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5">
          {/* Existing Gallery Images */}
          {existingGallery.map((img) => {
            const isDeletingThis = deletingGalleryPublicId === img.publicId;

            return (
              <div
                key={img.publicId}
                className="group relative aspect-video overflow-hidden rounded-lg border border-border bg-muted shadow-2xs">
                <Image
                  src={img.url}
                  alt="Gallery item"
                  fill
                  sizes="160px"
                  className="object-cover"
                />

                {onDeleteExistingGallery && (
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={() => onDeleteExistingGallery(img.publicId)}
                    disabled={isDeletingThis}
                    className="absolute inset-e-1.5 top-1.5 h-6 w-6 rounded-md bg-destructive/90 text-white shadow-xs hover:bg-destructive"
                    aria-label={t('removeImage')}>
                    {isDeletingThis ? (
                      <Spinner className="size-3" />
                    ) : (
                      <Trash2 className="h-3.5 w-3.5" />
                    )}
                  </Button>
                )}
              </div>
            );
          })}

          {/* Newly Queued Files */}
          {newGalleryFiles.map((file, idx) => {
            const preview = URL.createObjectURL(file);

            return (
              <div
                key={`queued-${idx}`}
                className="group relative aspect-video overflow-hidden rounded-lg border border-primary/50 bg-muted shadow-2xs">
                <Image
                  src={preview}
                  alt="Queued gallery preview"
                  fill
                  sizes="160px"
                  className="object-cover"
                />

                <Badge className="absolute inset-s-1.5 top-1.5 h-4.5 px-1 text-[9px] font-bold shadow-xs">
                  NEW
                </Badge>

                <Button
                  type="button"
                  variant="destructive"
                  size="icon"
                  onClick={() => onRemoveNewGalleryFile(idx)}
                  className="absolute inset-e-1.5 top-1.5 h-6 w-6 rounded-md bg-destructive/90 text-white shadow-xs hover:bg-destructive"
                  aria-label={t('removeImage')}>
                  <X className="h-3.5 w-3.5" />
                </Button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
