'use client';

import { useState, KeyboardEvent } from 'react';
import { useLocale, useTranslations } from 'next-intl';
import { Plus, X } from 'lucide-react';

import type { BilingualPair } from '@/types/admin';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

export interface BilingualTagInputProps {
  value?: BilingualPair[];
  onChange: (value: BilingualPair[]) => void;
  label: string;
  description?: string;
  placeholderAr?: string;
  placeholderEn?: string;
  error?: string;
  disabled?: boolean;
}

export function BilingualTagInput({
  value = [],
  onChange,
  label,
  description,
  placeholderAr,
  placeholderEn,
  error,
  disabled = false,
}: BilingualTagInputProps) {
  const locale = useLocale();
  const t = useTranslations('admin.products.form.tags');

  const [inputAr, setInputAr] = useState('');
  const [inputEn, setInputEn] = useState('');
  const [pairError, setPairError] = useState<string | null>(null);

  const handleAdd = () => {
    const trimmedAr = inputAr.trim();
    const trimmedEn = inputEn.trim();

    if (!trimmedAr && !trimmedEn) {
      return;
    }

    if (!trimmedAr || !trimmedEn) {
      setPairError(t('pairRequired'));
      return;
    }

    setPairError(null);
    onChange([...value, { ar: trimmedAr, en: trimmedEn }]);
    setInputAr('');
    setInputEn('');
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAdd();
    }
  };

  const handleRemove = (indexToRemove: number) => {
    if (disabled) return;
    onChange(value.filter((_, idx) => idx !== indexToRemove));
  };

  // Locale-aware input layout: In Arabic (RTL), Arabic input comes first. In English (LTR), English input comes first.
  const isArabicLocale = locale === 'ar';

  const arInputElement = (
    <div className="flex-1 min-w-35">
      <Input
        value={inputAr}
        onChange={(e) => {
          setInputAr(e.target.value);
          if (pairError) setPairError(null);
        }}
        onKeyDown={handleKeyDown}
        placeholder={placeholderAr || t('colorPlaceholderAr')}
        disabled={disabled}
        dir="rtl"
        className="h-8.5 text-xs text-start"
        aria-label={`${label} (Arabic)`}
      />
    </div>
  );

  const enInputElement = (
    <div className="flex-1 min-w-35">
      <Input
        value={inputEn}
        onChange={(e) => {
          setInputEn(e.target.value);
          if (pairError) setPairError(null);
        }}
        onKeyDown={handleKeyDown}
        placeholder={placeholderEn || t('colorPlaceholderEn')}
        disabled={disabled}
        dir="ltr"
        className="h-8.5 text-xs text-start"
        aria-label={`${label} (English)`}
      />
    </div>
  );

  return (
    <div className="space-y-2.5">
      <div className="flex flex-col gap-0.5">
        <Label className="text-xs font-semibold text-foreground">
          {label}
        </Label>
        {description && (
          <p className="text-[11px] text-muted-foreground">{description}</p>
        )}
      </div>

      {/* Confirmed Tags Badge Cloud */}
      <div className="min-h-10 rounded-lg border border-border/80 bg-muted/20 p-2.5">
        {value.length === 0 ? (
          <p className="text-xs text-muted-foreground italic py-1 px-1">
            {t('empty')}
          </p>
        ) : (
          <div className="flex flex-wrap items-center gap-2">
            {value.map((item, idx) => (
              <Badge
                key={`${item.ar}-${item.en}-${idx}`}
                variant="secondary"
                className="gap-1.5 py-1 px-2.5 text-xs font-normal border border-border/80 bg-card hover:bg-accent transition-colors">
                <span className="font-medium text-foreground">
                  {isArabicLocale ? item.ar : item.en}
                </span>
                <span className="text-muted-foreground/60">/</span>
                <span className="text-muted-foreground">
                  {isArabicLocale ? item.en : item.ar}
                </span>
                {!disabled && (
                  <button
                    type="button"
                    onClick={() => handleRemove(idx)}
                    className="inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full text-muted-foreground hover:bg-destructive hover:text-white transition-colors focus:outline-hidden"
                    aria-label={`Remove ${item.ar} / ${item.en}`}>
                    <X className="h-3 w-3" />
                  </button>
                )}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Add New Pair Row */}
      {!disabled && (
        <div className="space-y-1.5">
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
            {isArabicLocale ? (
              <>
                {arInputElement}
                {enInputElement}
              </>
            ) : (
              <>
                {enInputElement}
                {arInputElement}
              </>
            )}

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleAdd}
              disabled={disabled}
              className="h-8.5 gap-1 text-xs shrink-0 px-3">
              <Plus className="h-3.5 w-3.5" />
              <span>{t('add')}</span>
            </Button>
          </div>

          {/* Inline Pair Validation Error */}
          {pairError && (
            <p className="text-[11px] font-medium text-destructive animate-in fade-in">
              {pairError}
            </p>
          )}
        </div>
      )}

      {/* Controller Form-Level Error */}
      {error && (
        <p className="text-[11px] font-medium text-destructive">{error}</p>
      )}
    </div>
  );
}
