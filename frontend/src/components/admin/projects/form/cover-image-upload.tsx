'use client';

import { useRef } from 'react';
import { useTranslations } from 'next-intl';
import { UploadCloud, RefreshCw, Trash2, X } from 'lucide-react';
import Image from 'next/image';

import type { BackendImage } from '@/types/admin';
import { Button } from '@/components/ui/button';
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';

interface CoverImageUploadProps {
  coverFile: File | null;
  existingCover: BackendImage | null;
  onSelectCoverFile: (file: File | null) => void;
  onDeleteExistingCover?: () => void;
  isDeletingCover?: boolean;
}

export function CoverImageUpload({
  coverFile,
  existingCover,
  onSelectCoverFile,
  onDeleteExistingCover,
  isDeletingCover = false,
}: CoverImageUploadProps) {
  const t = useTranslations('admin.projects.form.media');
  const coverInputRef = useRef<HTMLInputElement>(null);

  const coverPreviewUrl = coverFile ? URL.createObjectURL(coverFile) : existingCover?.url || null;

  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onSelectCoverFile(file);
    }
  };

  return (
    <div className="space-y-2.5">
      <Label htmlFor="cover-image-input" className="text-xs font-semibold text-foreground">
        {t('coverTitle')}
      </Label>

      <input
        type="file"
        ref={coverInputRef}
        onChange={handleCoverChange}
        accept="image/png,image/jpeg,image/jpg,image/webp"
        className="hidden"
        id="cover-image-input"
      />

      {coverPreviewUrl ? (
        <div className="relative flex flex-col sm:flex-row items-center gap-4 rounded-xl border border-border/80 bg-muted/20 p-3.5">
          <div className="relative h-28 w-44 shrink-0 overflow-hidden rounded-lg border border-border bg-muted">
            <Image
              src={coverPreviewUrl}
              alt="Cover preview"
              fill
              sizes="176px"
              className="object-cover"
            />
          </div>

          <div className="flex flex-col items-start gap-2">
            <span className="text-xs font-medium text-foreground">
              {coverFile ? coverFile.name : t('coverTitle')}
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => coverInputRef.current?.click()}
                className="h-8 gap-1.5 text-xs">
                <RefreshCw className="h-3.5 w-3.5" />
                <span>{t('replaceCover')}</span>
              </Button>

              {coverFile ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    onSelectCoverFile(null);
                    if (coverInputRef.current) coverInputRef.current.value = '';
                  }}
                  className="h-8 gap-1.5 text-xs text-destructive hover:text-destructive hover:bg-destructive/10">
                  <X className="h-3.5 w-3.5" />
                  <span>{t('removeCover')}</span>
                </Button>
              ) : existingCover && onDeleteExistingCover ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={onDeleteExistingCover}
                  disabled={isDeletingCover}
                  className="h-8 gap-1.5 text-xs text-destructive hover:text-destructive hover:bg-destructive/10">
                  {isDeletingCover ? (
                    <Spinner className="size-3.5" />
                  ) : (
                    <Trash2 className="h-3.5 w-3.5" />
                  )}
                  <span>{t('removeCover')}</span>
                </Button>
              ) : null}
            </div>
          </div>
        </div>
      ) : (
        <Empty
          onClick={() => coverInputRef.current?.click()}
          className="border border-dashed border-border/80 bg-muted/10 p-6 text-center transition-colors hover:bg-muted/30 cursor-pointer">
          <EmptyHeader>
            <EmptyMedia
              variant="icon"
              className="size-10 rounded-full bg-primary/10 text-primary [&_svg]:size-5">
              <UploadCloud />
            </EmptyMedia>
            <EmptyTitle className="text-xs font-medium text-foreground">
              {t('dropCover')}
            </EmptyTitle>
            <EmptyDescription className="text-[11px] text-muted-foreground">
              PNG, JPG, WEBP (Max 5MB)
            </EmptyDescription>
          </EmptyHeader>
        </Empty>
      )}
    </div>
  );
}
