'use client';

import { useFieldArray, useFormContext } from 'react-hook-form';
import { useTranslations } from 'next-intl';
import { Plus, Trash2, Users, AlertCircle } from 'lucide-react';

import type { ProjectFormValues } from '@/types/admin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export function ContractorFieldArray() {
  const t = useTranslations('admin.projects.form.contractors');
  const tVal = useTranslations('admin.projects.form.validation');
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<ProjectFormValues>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'contractors',
  });

  const handleAddContractor = () => {
    append({
      name: { ar: '', en: '' },
      description: { ar: '', en: '' },
    });
  };

  const contractorsRootError = errors.contractors?.root?.message || errors.contractors?.message;

  return (
    <div className="space-y-4 pt-3 border-t border-border/80">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-primary" />
          <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            {t('title')} <span className="text-destructive">*</span>
          </h4>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAddContractor}
          className="gap-1.5 text-xs h-8">
          <Plus className="h-3.5 w-3.5" />
          <span>{t('add')}</span>
        </Button>
      </div>

      {/* Root Array Error (e.g. at least 1 contractor required) */}
      {contractorsRootError && (
        <div className="flex items-center gap-2 rounded-lg bg-destructive/10 p-2.5 text-xs font-medium text-destructive border border-destructive/20 animate-in fade-in">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{tVal('contractorsRequired')}</span>
        </div>
      )}

      {fields.length === 0 ? (
        <div className="rounded-lg border border-dashed border-border/80 p-4 text-center text-xs text-muted-foreground">
          {t('empty')}
        </div>
      ) : (
        <div className="space-y-3.5">
          {fields.map((field, index) => {
            const contractorErrors = errors.contractors?.[index];

            return (
              <div
                key={field.id}
                className="relative rounded-lg border border-border/80 bg-muted/20 p-3.5 transition-all space-y-3">
                <div className="flex items-center justify-between border-b border-border/60 pb-2">
                  <span className="text-xs font-semibold text-foreground">
                    {t('title')} #{index + 1}
                  </span>

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => remove(index)}
                    className="h-7 text-xs text-destructive hover:text-destructive hover:bg-destructive/10 gap-1 px-2"
                    aria-label={`${t('remove')} #${index + 1}`}>
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>{t('remove')}</span>
                  </Button>
                </div>

                {/* Contractor Names (Arabic & English) */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {/* Name Arabic */}
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <Label
                        htmlFor={`contractor-name-ar-${index}`}
                        className="text-[11px] font-semibold text-foreground">
                        {t('nameAr')} <span className="text-destructive">*</span>
                      </Label>
                      <span className="text-[9px] font-bold text-muted-foreground">AR</span>
                    </div>
                    <Input
                      id={`contractor-name-ar-${index}`}
                      dir="rtl"
                      placeholder={t('nameArPlaceholder')}
                      {...register(`contractors.${index}.name.ar`)}
                      aria-invalid={Boolean(contractorErrors?.name?.ar)}
                      className={
                        contractorErrors?.name?.ar
                          ? 'border-destructive focus-visible:ring-destructive text-xs h-8.5'
                          : 'text-xs h-8.5'
                      }
                    />
                    {contractorErrors?.name?.ar?.message && (
                      <p className="text-[10px] font-medium text-destructive">
                        {tVal('contractorNameArRequired')}
                      </p>
                    )}
                  </div>

                  {/* Name English */}
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <Label
                        htmlFor={`contractor-name-en-${index}`}
                        className="text-[11px] font-semibold text-foreground">
                        {t('nameEn')} <span className="text-destructive">*</span>
                      </Label>
                      <span className="text-[9px] font-bold text-muted-foreground">EN</span>
                    </div>
                    <Input
                      id={`contractor-name-en-${index}`}
                      dir="ltr"
                      placeholder={t('nameEnPlaceholder')}
                      {...register(`contractors.${index}.name.en`)}
                      aria-invalid={Boolean(contractorErrors?.name?.en)}
                      className={
                        contractorErrors?.name?.en
                          ? 'border-destructive focus-visible:ring-destructive text-xs h-8.5'
                          : 'text-xs h-8.5'
                      }
                    />
                    {contractorErrors?.name?.en?.message && (
                      <p className="text-[10px] font-medium text-destructive">
                        {tVal('contractorNameEnRequired')}
                      </p>
                    )}
                  </div>
                </div>

                {/* Contractor Descriptions (Arabic & English) */}
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {/* Description Arabic */}
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <Label
                        htmlFor={`contractor-desc-ar-${index}`}
                        className="text-[11px] font-semibold text-foreground">
                        {t('descAr')} <span className="text-destructive">*</span>
                      </Label>
                      <span className="text-[9px] font-bold text-muted-foreground">AR</span>
                    </div>
                    <Input
                      id={`contractor-desc-ar-${index}`}
                      dir="rtl"
                      placeholder={t('descArPlaceholder')}
                      {...register(`contractors.${index}.description.ar`)}
                      aria-invalid={Boolean(contractorErrors?.description?.ar)}
                      className={
                        contractorErrors?.description?.ar
                          ? 'border-destructive focus-visible:ring-destructive text-xs h-8.5'
                          : 'text-xs h-8.5'
                      }
                    />
                    {contractorErrors?.description?.ar?.message && (
                      <p className="text-[10px] font-medium text-destructive">
                        {tVal('contractorDescArRequired')}
                      </p>
                    )}
                  </div>

                  {/* Description English */}
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                      <Label
                        htmlFor={`contractor-desc-en-${index}`}
                        className="text-[11px] font-semibold text-foreground">
                        {t('descEn')} <span className="text-destructive">*</span>
                      </Label>
                      <span className="text-[9px] font-bold text-muted-foreground">EN</span>
                    </div>
                    <Input
                      id={`contractor-desc-en-${index}`}
                      dir="ltr"
                      placeholder={t('descEnPlaceholder')}
                      {...register(`contractors.${index}.description.en`)}
                      aria-invalid={Boolean(contractorErrors?.description?.en)}
                      className={
                        contractorErrors?.description?.en
                          ? 'border-destructive focus-visible:ring-destructive text-xs h-8.5'
                          : 'text-xs h-8.5'
                      }
                    />
                    {contractorErrors?.description?.en?.message && (
                      <p className="text-[10px] font-medium text-destructive">
                        {tVal('contractorDescEnRequired')}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
