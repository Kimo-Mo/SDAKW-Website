'use client';

import { useFormContext } from 'react-hook-form';
import { useTranslations } from 'next-intl';

import type { ProjectFormValues } from '@/types/admin';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export function BasicInfoFields() {
  const t = useTranslations('admin.projects.form');
  const tVal = useTranslations('admin.projects.form.validation');
  const {
    register,
    formState: { errors },
  } = useFormContext<ProjectFormValues>();

  const getValidationMessage = (key?: string) => {
    if (!key) return null;
    switch (key) {
      case 'titleArRequired':
        return tVal('titleArRequired');
      case 'titleEnRequired':
        return tVal('titleEnRequired');
      case 'descArRequired':
        return tVal('descArRequired');
      case 'descEnRequired':
        return tVal('descEnRequired');
      default:
        return key;
    }
  };

  return (
    <Card className="border-border bg-card shadow-xs">
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-bold text-foreground">
          {t('sections.basicInfo')}
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          {t('sections.basicInfoDesc')}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Project Titles (Arabic & English) */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Title Arabic */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="title-ar" className="text-xs font-semibold text-foreground">
                {t('fields.titleAr')} <span className="text-destructive">*</span>
              </Label>
              <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-bold text-muted-foreground">
                AR
              </span>
            </div>
            <Input
              id="title-ar"
              dir="rtl"
              placeholder={t('fields.titleArPlaceholder')}
              {...register('title.ar')}
              aria-invalid={Boolean(errors.title?.ar)}
              className={
                errors.title?.ar ? 'border-destructive focus-visible:ring-destructive' : ''
              }
            />
            {errors.title?.ar?.message && (
              <p className="text-[11px] font-medium text-destructive">
                {getValidationMessage(errors.title.ar.message)}
              </p>
            )}
          </div>

          {/* Title English */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="title-en" className="text-xs font-semibold text-foreground">
                {t('fields.titleEn')} <span className="text-destructive">*</span>
              </Label>
              <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-bold text-muted-foreground">
                EN
              </span>
            </div>
            <Input
              id="title-en"
              dir="ltr"
              placeholder={t('fields.titleEnPlaceholder')}
              {...register('title.en')}
              aria-invalid={Boolean(errors.title?.en)}
              className={
                errors.title?.en ? 'border-destructive focus-visible:ring-destructive' : ''
              }
            />
            {errors.title?.en?.message && (
              <p className="text-[11px] font-medium text-destructive">
                {getValidationMessage(errors.title.en.message)}
              </p>
            )}
          </div>
        </div>

        {/* Project Descriptions (Arabic & English) */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Description Arabic */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="desc-ar" className="text-xs font-semibold text-foreground">
                {t('fields.descAr')} <span className="text-destructive">*</span>
              </Label>
              <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-bold text-muted-foreground">
                AR
              </span>
            </div>
            <Textarea
              id="desc-ar"
              dir="rtl"
              rows={4}
              placeholder={t('fields.descArPlaceholder')}
              {...register('description.ar')}
              aria-invalid={Boolean(errors.description?.ar)}
              className={
                errors.description?.ar ? 'border-destructive focus-visible:ring-destructive' : ''
              }
            />
            {errors.description?.ar?.message && (
              <p className="text-[11px] font-medium text-destructive">
                {getValidationMessage(errors.description.ar.message)}
              </p>
            )}
          </div>

          {/* Description English */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="desc-en" className="text-xs font-semibold text-foreground">
                {t('fields.descEn')} <span className="text-destructive">*</span>
              </Label>
              <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-bold text-muted-foreground">
                EN
              </span>
            </div>
            <Textarea
              id="desc-en"
              dir="ltr"
              rows={4}
              placeholder={t('fields.descEnPlaceholder')}
              {...register('description.en')}
              aria-invalid={Boolean(errors.description?.en)}
              className={
                errors.description?.en ? 'border-destructive focus-visible:ring-destructive' : ''
              }
            />
            {errors.description?.en?.message && (
              <p className="text-[11px] font-medium text-destructive">
                {getValidationMessage(errors.description.en.message)}
              </p>
            )}
          </div>
        </div>

        {/* Locations (Arabic & English - Optional) */}
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* Location Arabic */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="loc-ar" className="text-xs font-semibold text-foreground">
                {t('fields.locAr')}
              </Label>
              <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-bold text-muted-foreground">
                AR
              </span>
            </div>
            <Input
              id="loc-ar"
              dir="rtl"
              placeholder={t('fields.locArPlaceholder')}
              {...register('location.ar')}
            />
          </div>

          {/* Location English */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="loc-en" className="text-xs font-semibold text-foreground">
                {t('fields.locEn')}
              </Label>
              <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-bold text-muted-foreground">
                EN
              </span>
            </div>
            <Input
              id="loc-en"
              dir="ltr"
              placeholder={t('fields.locEnPlaceholder')}
              {...register('location.en')}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
