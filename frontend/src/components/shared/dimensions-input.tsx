'use client';

import { useTranslations } from 'next-intl';
import { Plus, Trash2 } from 'lucide-react';

import type { ProductDimension } from '@/types/admin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

export interface DimensionsInputProps {
  value?: ProductDimension[];
  onChange: (value: ProductDimension[]) => void;
  label?: string;
  description?: string;
  error?: string;
  disabled?: boolean;
}

export function DimensionsInput({
  value = [],
  onChange,
  label,
  description,
  error,
  disabled = false,
}: DimensionsInputProps) {
  const t = useTranslations('admin.products.form.dimensions');

  const titleText = label || t('title');
  const descText = description || t('desc');

  const handleAdd = () => {
    if (disabled) return;
    onChange([...value, { length: 0, width: 0, thickness: 0 }]);
  };

  const handleUpdate = (
    index: number,
    field: keyof ProductDimension,
    rawValue: string
  ) => {
    if (disabled) return;
    const parsed = rawValue === '' ? 0 : Number(rawValue);
    const updated = value.map((item, idx) => {
      if (idx !== index) return item;
      return {
        ...item,
        [field]: parsed,
      };
    });
    onChange(updated);
  };

  const handleRemove = (indexToRemove: number) => {
    if (disabled) return;
    onChange(value.filter((_, idx) => idx !== indexToRemove));
  };

  return (
    <div className="space-y-3">
      {/* Header Label and Description */}
      <div className="flex flex-col gap-0.5">
        <Label className="text-xs font-semibold text-foreground">
          {titleText}
        </Label>
        {descText && (
          <p className="text-[11px] text-muted-foreground">{descText}</p>
        )}
      </div>

      {/* List of Dimension Variant Entries */}
      {value.length === 0 ? (
        <div className="rounded-lg border border-border/80 bg-muted/20 p-3 text-xs text-muted-foreground italic">
          {t('empty')}
        </div>
      ) : (
        <div className="space-y-2.5">
          {value.map((item, idx) => {
            const hasError =
              item.length <= 0 || item.width <= 0 || item.thickness <= 0;

            return (
              <div
                key={idx}
                className={cn(
                  'flex flex-col sm:flex-row sm:items-end gap-2.5 sm:gap-3 p-3 rounded-lg border bg-muted/10 transition-colors',
                  hasError && error ? 'border-destructive/60' : 'border-border/80'
                )}>
                {/* Variant Index Badge */}
                <div className="flex items-center justify-between sm:justify-start sm:w-8 shrink-0 pb-1 sm:pb-2">
                  <span className="text-[11px] font-mono font-medium text-muted-foreground">
                    #{idx + 1}
                  </span>
                  <div className="sm:hidden">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemove(idx)}
                      disabled={disabled}
                      className="h-7 text-xs text-muted-foreground hover:text-destructive hover:bg-destructive/10 px-2 gap-1"
                      aria-label={`${t('remove')} #${idx + 1}`}>
                      <Trash2 className="h-3.5 w-3.5" />
                      <span>{t('remove')}</span>
                    </Button>
                  </div>
                </div>

                {/* Length Input */}
                <div className="flex-1 min-w-24 space-y-1">
                  <Label
                    htmlFor={`dim-length-${idx}`}
                    className="text-[11px] font-medium text-muted-foreground">
                    {t('length')} ({t('unit')})
                  </Label>
                  <Input
                    id={`dim-length-${idx}`}
                    type="number"
                    min="0.1"
                    step="any"
                    placeholder="120"
                    value={item.length === 0 ? '' : item.length}
                    onChange={(e) => handleUpdate(idx, 'length', e.target.value)}
                    disabled={disabled}
                    className="h-8.5 text-xs font-mono"
                    aria-label={`${t('length')} (${t('unit')}) #${idx + 1}`}
                  />
                </div>

                {/* Width Input */}
                <div className="flex-1 min-w-24 space-y-1">
                  <Label
                    htmlFor={`dim-width-${idx}`}
                    className="text-[11px] font-medium text-muted-foreground">
                    {t('width')} ({t('unit')})
                  </Label>
                  <Input
                    id={`dim-width-${idx}`}
                    type="number"
                    min="0.1"
                    step="any"
                    placeholder="60"
                    value={item.width === 0 ? '' : item.width}
                    onChange={(e) => handleUpdate(idx, 'width', e.target.value)}
                    disabled={disabled}
                    className="h-8.5 text-xs font-mono"
                    aria-label={`${t('width')} (${t('unit')}) #${idx + 1}`}
                  />
                </div>

                {/* Thickness Input */}
                <div className="flex-1 min-w-24 space-y-1">
                  <Label
                    htmlFor={`dim-thickness-${idx}`}
                    className="text-[11px] font-medium text-muted-foreground">
                    {t('thickness')} ({t('unit')})
                  </Label>
                  <Input
                    id={`dim-thickness-${idx}`}
                    type="number"
                    min="0.1"
                    step="any"
                    placeholder="2"
                    value={item.thickness === 0 ? '' : item.thickness}
                    onChange={(e) => handleUpdate(idx, 'thickness', e.target.value)}
                    disabled={disabled}
                    className="h-8.5 text-xs font-mono"
                    aria-label={`${t('thickness')} (${t('unit')}) #${idx + 1}`}
                  />
                </div>

                {/* Desktop Remove Button */}
                <div className="hidden sm:flex items-center justify-end pb-0.5">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemove(idx)}
                    disabled={disabled}
                    className="h-8.5 w-8.5 text-muted-foreground hover:text-destructive hover:bg-destructive/10 shrink-0"
                    aria-label={`${t('remove')} #${idx + 1}`}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Control Button */}
      {!disabled && (
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAdd}
          disabled={disabled}
          className="h-8.5 gap-1.5 text-xs shrink-0 px-3">
          <Plus className="h-3.5 w-3.5" />
          <span>{t('add')}</span>
        </Button>
      )}

      {/* Component / Form-Level Error Message */}
      {error && (
        <p className="text-[11px] font-medium text-destructive animate-in fade-in">
          {error}
        </p>
      )}
    </div>
  );
}
