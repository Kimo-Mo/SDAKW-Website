'use client';

import { useLocale, useTranslations } from 'next-intl';
import { AlertTriangle } from 'lucide-react';

import type { BackendProduct } from '@/types/admin';
import type { Locale } from '@/i18n/routing';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

interface ProductDeleteDialogProps {
  isOpen: boolean;
  product: BackendProduct | null;
  isDeleting: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function ProductDeleteDialog({
  isOpen,
  product,
  isDeleting,
  onClose,
  onConfirm,
}: ProductDeleteDialogProps) {
  const t = useTranslations('admin.products.deleteDialog');
  const locale = useLocale() as Locale;

  if (!product) return null;

  const productName =
    locale === 'ar'
      ? product.name?.ar || product.name?.en || ''
      : product.name?.en || product.name?.ar || '';

  return (
    <AlertDialog open={isOpen} onOpenChange={(open) => !open && !isDeleting && onClose()}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader className="flex flex-col items-center sm:items-start text-center sm:text-start gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10 text-destructive mb-1">
            <AlertTriangle className="h-5 w-5" />
          </div>

          <AlertDialogTitle className="text-lg font-bold text-foreground">
            {t('title')}
          </AlertDialogTitle>

          <AlertDialogDescription className="text-xs text-muted-foreground leading-relaxed">
            {t('description', { name: productName })}
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter className="mt-4 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-end gap-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClose}
            disabled={isDeleting}
            className="h-9 text-xs">
            {t('cancel')}
          </Button>

          <Button
            type="button"
            variant="destructive"
            size="sm"
            onClick={onConfirm}
            disabled={isDeleting}
            className="h-9 gap-1.5 text-xs font-semibold">
            {isDeleting ? (
              <>
                <Spinner className="size-3.5" />
                <span>{t('deleting')}</span>
              </>
            ) : (
              <span>{t('confirm')}</span>
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
