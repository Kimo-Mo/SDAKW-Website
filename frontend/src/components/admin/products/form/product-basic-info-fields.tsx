'use client';

import { useFormContext, Controller } from 'react-hook-form';
import { useTranslations } from 'next-intl';

import type { ProductCategory } from '@/types/admin';
import type { ProductFormSchemaType } from '@/lib/validations/product';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function ProductBasicInfoFields() {
  const t = useTranslations('admin.products.form');
  const tCommon = useTranslations('admin.products');

  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<ProductFormSchemaType>();

  const categoryOptions: { value: ProductCategory; label: string }[] = [
    { value: 'natural_granite', label: tCommon('categories.natural_granite') },
    { value: 'natural_stone', label: tCommon('categories.natural_stone') },
    { value: 'natural_marble', label: tCommon('categories.natural_marble') },
    { value: 'quartz_industrial', label: tCommon('categories.quartz_industrial') },
  ];

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

      <CardContent className="space-y-4">
        {/* Name Fields (Arabic & English) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="name-ar" className="text-xs font-semibold text-foreground">
              {t('fields.nameAr')} <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name-ar"
              {...register('name.ar')}
              placeholder={t('fields.nameArPlaceholder')}
              dir="rtl"
              className={`text-xs text-start ${errors.name?.ar ? 'border-destructive' : ''}`}
            />
            {errors.name?.ar && (
              <p className="text-[11px] font-medium text-destructive">
                {t(`validation.${errors.name.ar.message}`)}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="name-en" className="text-xs font-semibold text-foreground">
              {t('fields.nameEn')} <span className="text-destructive">*</span>
            </Label>
            <Input
              id="name-en"
              {...register('name.en')}
              placeholder={t('fields.nameEnPlaceholder')}
              dir="ltr"
              className={`text-xs text-start ${errors.name?.en ? 'border-destructive' : ''}`}
            />
            {errors.name?.en && (
              <p className="text-[11px] font-medium text-destructive">
                {t(`validation.${errors.name.en.message}`)}
              </p>
            )}
          </div>
        </div>

        {/* Category Select */}
        <div className="space-y-1.5">
          <Label htmlFor="product-category" className="text-xs font-semibold text-foreground">
            {t('fields.category')} <span className="text-destructive">*</span>
          </Label>
          <Controller
            name="category"
            control={control}
            render={({ field }) => (
              <Select
                value={field.value}
                onValueChange={(val) => field.onChange(val as ProductCategory)}>
                <SelectTrigger
                  id="product-category"
                  size="default"
                  className={`text-xs font-medium w-full ${
                    errors.category ? 'border-destructive' : ''
                  }`}
                  aria-label={t('fields.category')}>
                  <SelectValue placeholder={t('fields.categoryPlaceholder')}>
                    {categoryOptions.find((opt) => opt.value === field.value)?.label}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.category && (
            <p className="text-[11px] font-medium text-destructive">
              {t(`validation.${errors.category.message}`)}
            </p>
          )}
        </div>

        {/* Material Fields (Arabic & English) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="material-ar" className="text-xs font-semibold text-foreground">
              {t('fields.materialAr')} <span className="text-destructive">*</span>
            </Label>
            <Input
              id="material-ar"
              {...register('material.ar')}
              placeholder={t('fields.materialArPlaceholder')}
              dir="rtl"
              className={`text-xs text-start ${errors.material?.ar ? 'border-destructive' : ''}`}
            />
            {errors.material?.ar && (
              <p className="text-[11px] font-medium text-destructive">
                {t(`validation.${errors.material.ar.message}`)}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="material-en" className="text-xs font-semibold text-foreground">
              {t('fields.materialEn')} <span className="text-destructive">*</span>
            </Label>
            <Input
              id="material-en"
              {...register('material.en')}
              placeholder={t('fields.materialEnPlaceholder')}
              dir="ltr"
              className={`text-xs text-start ${errors.material?.en ? 'border-destructive' : ''}`}
            />
            {errors.material?.en && (
              <p className="text-[11px] font-medium text-destructive">
                {t(`validation.${errors.material.en.message}`)}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
