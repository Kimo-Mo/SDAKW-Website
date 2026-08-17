'use client';

import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { useTranslations } from 'next-intl';

import type { ProjectFormValues } from '@/types/admin';
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
import { ContractorFieldArray } from './contractor-field-array';

export function ClassificationFields() {
  const t = useTranslations('admin.projects.form');
  const tVal = useTranslations('admin.projects.form.validation');
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<ProjectFormValues>();

  const currentType = useWatch({
    control,
    name: 'projectType',
    defaultValue: 'private',
  });

  const isGovernment = currentType === 'government';

  const getValidationMessage = (key?: string) => {
    if (!key) return null;
    switch (key) {
      case 'govEntityArRequired':
        return tVal('govEntityArRequired');
      case 'govEntityEnRequired':
        return tVal('govEntityEnRequired');
      default:
        return key;
    }
  };

  return (
    <Card className="border-border bg-card shadow-xs">
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-bold text-foreground">
          {t('sections.classification')}
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          {t('sections.classificationDesc')}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Project Type Select */}
        <div className="flex flex-col gap-1.5 max-w-sm">
          <Label htmlFor="project-type" className="text-xs font-semibold text-foreground">
            {t('fields.projectType')} <span className="text-destructive">*</span>
          </Label>
          <Controller
            name="projectType"
            control={control}
            render={({ field }) => (
              <Select value={field.value} onValueChange={field.onChange} disabled={field.disabled}>
                <SelectTrigger id="project-type" className="h-9.5 w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="private">{t('fields.private')}</SelectItem>
                  <SelectItem value="government">{t('fields.government')}</SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </div>

        {/* Government Only: Government Entity & Dynamic Contractors */}
        {isGovernment && (
          <div className="space-y-5 animate-in fade-in duration-200">
            {/* Government Entity Fields (Arabic & English) */}
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 pt-2 border-t border-border/70">
              {/* Government Entity Arabic */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="gov-entity-ar" className="text-xs font-semibold text-foreground">
                    {t('fields.governmentEntityAr')} <span className="text-destructive">*</span>
                  </Label>
                  <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-bold text-muted-foreground">
                    AR
                  </span>
                </div>
                <Input
                  id="gov-entity-ar"
                  dir="rtl"
                  placeholder={t('fields.governmentEntityArPlaceholder')}
                  {...register('governmentEntity.ar')}
                  aria-invalid={Boolean(errors.governmentEntity?.ar)}
                  className={
                    errors.governmentEntity?.ar
                      ? 'border-destructive focus-visible:ring-destructive'
                      : ''
                  }
                />
                {errors.governmentEntity?.ar?.message && (
                  <p className="text-[11px] font-medium text-destructive">
                    {getValidationMessage(errors.governmentEntity.ar.message)}
                  </p>
                )}
              </div>

              {/* Government Entity English */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="gov-entity-en" className="text-xs font-semibold text-foreground">
                    {t('fields.governmentEntityEn')} <span className="text-destructive">*</span>
                  </Label>
                  <span className="rounded bg-muted px-1.5 py-0.5 text-[10px] font-bold text-muted-foreground">
                    EN
                  </span>
                </div>
                <Input
                  id="gov-entity-en"
                  dir="ltr"
                  placeholder={t('fields.governmentEntityEnPlaceholder')}
                  {...register('governmentEntity.en')}
                  aria-invalid={Boolean(errors.governmentEntity?.en)}
                  className={
                    errors.governmentEntity?.en
                      ? 'border-destructive focus-visible:ring-destructive'
                      : ''
                  }
                />
                {errors.governmentEntity?.en?.message && (
                  <p className="text-[11px] font-medium text-destructive">
                    {getValidationMessage(errors.governmentEntity.en.message)}
                  </p>
                )}
              </div>
            </div>

            {/* Dynamic Contractors List */}
            <ContractorFieldArray />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
