'use client';

import { useFormContext, Controller } from 'react-hook-form';
import { useTranslations } from 'next-intl';

import type { ProductFormSchemaType } from '@/lib/validations/product';
import { BilingualTagInput } from '@/components/shared/bilingual-tag-input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';

export function ProductAttributesFields() {
  const t = useTranslations('admin.products.form');
  const tTags = useTranslations('admin.products.form.tags');

  const {
    control,
    formState: { errors },
  } = useFormContext<ProductFormSchemaType>();

  return (
    <Card className="border-border bg-card shadow-xs">
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-bold text-foreground">
          {t('sections.attributes')}
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          {t('sections.attributesDesc')}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Color Tag Input */}
        <Controller
          name="color"
          control={control}
          render={({ field }) => (
            <BilingualTagInput
              value={field.value}
              onChange={field.onChange}
              label={tTags('colorTitle')}
              description={tTags('colorDesc')}
              placeholderAr={tTags('colorPlaceholderAr')}
              placeholderEn={tTags('colorPlaceholderEn')}
              error={
                errors.color?.message
                  ? t(`validation.${errors.color.message}`)
                  : undefined
              }
            />
          )}
        />

        {/* Origin Tag Input */}
        <Controller
          name="origin"
          control={control}
          render={({ field }) => (
            <BilingualTagInput
              value={field.value}
              onChange={field.onChange}
              label={tTags('originTitle')}
              description={tTags('originDesc')}
              placeholderAr={tTags('originPlaceholderAr')}
              placeholderEn={tTags('originPlaceholderEn')}
              error={
                errors.origin?.message
                  ? t(`validation.${errors.origin.message}`)
                  : undefined
              }
            />
          )}
        />

        {/* Uses Tag Input */}
        <Controller
          name="uses"
          control={control}
          render={({ field }) => (
            <BilingualTagInput
              value={field.value}
              onChange={field.onChange}
              label={tTags('usesTitle')}
              description={tTags('usesDesc')}
              placeholderAr={tTags('usesPlaceholderAr')}
              placeholderEn={tTags('usesPlaceholderEn')}
              error={
                errors.uses?.message
                  ? t(`validation.${errors.uses.message}`)
                  : undefined
              }
            />
          )}
        />

        {/* Surface Finishes Tag Input */}
        <Controller
          name="surface"
          control={control}
          render={({ field }) => (
            <BilingualTagInput
              value={field.value}
              onChange={field.onChange}
              label={tTags('surfaceTitle')}
              description={tTags('surfaceDesc')}
              placeholderAr={tTags('surfacePlaceholderAr')}
              placeholderEn={tTags('surfacePlaceholderEn')}
              error={
                errors.surface?.message
                  ? t(`validation.${errors.surface.message}`)
                  : undefined
              }
            />
          )}
        />

        {/* Published Switch */}
        <div className="pt-4 border-t border-border/70">
          <Controller
            name="published"
            control={control}
            render={({ field }) => (
              <div className="flex items-center justify-between gap-4 rounded-xl border border-border/80 bg-muted/10 p-4">
                <div className="space-y-0.5">
                  <Label htmlFor="product-published" className="text-xs font-semibold text-foreground cursor-pointer">
                    {t('fields.published')}
                  </Label>
                  <p className="text-[11px] text-muted-foreground">
                    {field.value
                      ? t('fields.published')
                      : t('fields.draft')}
                  </p>
                </div>
                <Switch
                  id="product-published"
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </div>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
}
