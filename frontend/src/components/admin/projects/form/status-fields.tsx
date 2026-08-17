'use client';

import { Controller, useFormContext, useWatch } from 'react-hook-form';
import { useTranslations } from 'next-intl';

import type { ProjectFormValues } from '@/types/admin';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export function StatusFields() {
  const t = useTranslations('admin.projects.form');
  const tVal = useTranslations('admin.projects.form.validation');
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext<ProjectFormValues>();

  const currentStatus = useWatch({
    control,
    name: 'status',
    defaultValue: 'ongoing',
  });

  const isCompleted = currentStatus === 'completed';

  const getValidationMessage = (key?: string) => {
    if (!key) return null;
    switch (key) {
      case 'completionDateRequired':
        return tVal('completionDateRequired');
      default:
        return key;
    }
  };

  return (
    <Card className="border-border bg-card shadow-xs">
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-bold text-foreground">
          {t('sections.statusAndVisibility')}
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          {t('sections.statusAndVisibilityDesc')}
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-5">
        {/* Status Selection & Completion Date */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Status Selection */}
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="project-status" className="text-xs font-semibold text-foreground">
              {t('fields.status')} <span className="text-destructive">*</span>
            </Label>
            <Controller
              name="status"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={field.disabled}>
                  <SelectTrigger id="project-status" className="h-9.5 w-full">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ongoing">{t('fields.ongoing')}</SelectItem>
                    <SelectItem value="completed">{t('fields.completed')}</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {/* Conditional Completion Date */}
          {isCompleted && (
            <div className="flex flex-col gap-1.5 animate-in fade-in duration-200">
              <Label htmlFor="completion-date" className="text-xs font-semibold text-foreground">
                {t('fields.completionDate')} <span className="text-destructive">*</span>
              </Label>
              <Input
                id="completion-date"
                type="date"
                {...register('completionDate')}
                aria-invalid={Boolean(errors.completionDate)}
                className={
                  errors.completionDate ? 'border-destructive focus-visible:ring-destructive' : ''
                }
              />
              {errors.completionDate?.message && (
                <p className="text-[11px] font-medium text-destructive">
                  {getValidationMessage(errors.completionDate.message)}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Visibility & Feature Switches */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6 pt-2 border-t border-border/70">
          {/* Published Toggle */}
          <div className="flex items-center gap-2.5">
            <Controller
              name="published"
              control={control}
              render={({ field }) => (
                <Checkbox
                  id="project-published"
                  checked={Boolean(field.value)}
                  onCheckedChange={field.onChange}
                  onBlur={field.onBlur}
                  disabled={field.disabled}
                />
              )}
            />
            <Label
              htmlFor="project-published"
              className="text-xs font-medium text-foreground cursor-pointer select-none">
              {t('fields.published')}
            </Label>
          </div>

          {/* Featured Toggle */}
          <div className="flex items-center gap-2.5">
            <Controller
              name="featured"
              control={control}
              render={({ field }) => (
                <Checkbox
                  id="project-featured"
                  checked={Boolean(field.value)}
                  onCheckedChange={field.onChange}
                  onBlur={field.onBlur}
                  disabled={field.disabled}
                />
              )}
            />
            <Label
              htmlFor="project-featured"
              className="text-xs font-medium text-foreground cursor-pointer select-none">
              {t('fields.featured')}
            </Label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
