'use client';

import { useTranslations } from 'next-intl';

import type { BackendImage } from '@/types/admin';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

import { CoverImageUpload } from './cover-image-upload';
import { GalleryImageUpload } from './gallery-image-upload';

interface ImageUploadSectionProps {
  // Cover State
  coverFile: File | null;
  existingCover: BackendImage | null;
  onSelectCoverFile: (file: File | null) => void;
  onDeleteExistingCover?: () => void;
  isDeletingCover?: boolean;

  // Gallery State
  newGalleryFiles: File[];
  existingGallery: BackendImage[];
  onAddGalleryFiles: (files: File[]) => void;
  onRemoveNewGalleryFile: (index: number) => void;
  onDeleteExistingGallery?: (publicId: string) => void;
  deletingGalleryPublicId?: string | null;
}

export function ImageUploadSection({
  coverFile,
  existingCover,
  onSelectCoverFile,
  onDeleteExistingCover,
  isDeletingCover = false,
  newGalleryFiles,
  existingGallery,
  onAddGalleryFiles,
  onRemoveNewGalleryFile,
  onDeleteExistingGallery,
  deletingGalleryPublicId = null,
}: ImageUploadSectionProps) {
  const t = useTranslations('admin.projects.form.media');

  return (
    <Card className="border-border bg-card shadow-xs">
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-bold text-foreground">
          {t('coverTitle')} & {t('galleryTitle')}
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          {t('coverDesc')}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        <CoverImageUpload
          coverFile={coverFile}
          existingCover={existingCover}
          onSelectCoverFile={onSelectCoverFile}
          onDeleteExistingCover={onDeleteExistingCover}
          isDeletingCover={isDeletingCover}
        />

        <GalleryImageUpload
          newGalleryFiles={newGalleryFiles}
          existingGallery={existingGallery}
          onAddGalleryFiles={onAddGalleryFiles}
          onRemoveNewGalleryFile={onRemoveNewGalleryFile}
          onDeleteExistingGallery={onDeleteExistingGallery}
          deletingGalleryPublicId={deletingGalleryPublicId}
        />
      </CardContent>
    </Card>
  );
}
