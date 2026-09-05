'use client';

import { useState, useMemo } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';

import type { BackendProduct, BilingualPair } from '@/types/admin';
import { productFormSchema, type ProductFormSchemaType } from '@/lib/validations/product';
import {
  getAdminProductById,
  deleteProductCoverImage,
  deleteProductGalleryImage,
} from '@/lib/api/products';
import { Link } from '@/i18n/navigation';
import { toast } from '@/components/ui/toast';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

import { ProductBasicInfoFields } from './product-basic-info-fields';
import { ProductAttributesFields } from './product-attributes-fields';
import { ProductImageUploadSection } from './product-image-upload-section';
import { useProductFormSubmit } from './use-product-form-submit';
import { ProductFormSkeleton, ProductFormErrorState } from './product-form-status-cards';

interface ProductFormProps {
  projectId?: string;
}

const DEFAULT_FORM_VALUES: ProductFormSchemaType = {
  name: { ar: '', en: '' },
  category: 'natural_marble',
  material: { ar: '', en: '' },
  color: [],
  origin: [],
  uses: [],
  surface: [],
  dimensions: [],
  published: true,
};

function toBilingualPairs(arr?: { ar: string[]; en: string[] }): BilingualPair[] {
  if (!arr || !Array.isArray(arr.ar) || !Array.isArray(arr.en)) {
    return [];
  }
  const length = Math.min(arr.ar.length, arr.en.length);
  const pairs: BilingualPair[] = [];
  for (let i = 0; i < length; i++) {
    pairs.push({
      ar: arr.ar[i] || '',
      en: arr.en[i] || '',
    });
  }
  return pairs;
}

interface ProductFormInnerProps {
  productId?: string;
  initialProduct?: BackendProduct;
}

function ProductFormInner({ productId, initialProduct }: ProductFormInnerProps) {
  const t = useTranslations('admin.products.form');
  const queryClient = useQueryClient();
  const isEditMode = Boolean(productId);

  // Compute defaultValues synchronously for initial form mount
  const defaultValues: ProductFormSchemaType = useMemo(() => {
    if (!initialProduct) {
      return DEFAULT_FORM_VALUES;
    }
    return {
      name: {
        ar: initialProduct.name?.ar || '',
        en: initialProduct.name?.en || '',
      },
      category: initialProduct.category || 'natural_marble',
      material: {
        ar: initialProduct.material?.ar || '',
        en: initialProduct.material?.en || '',
      },
      color: toBilingualPairs(initialProduct.color),
      origin: toBilingualPairs(initialProduct.origin),
      uses: toBilingualPairs(initialProduct.uses),
      surface: toBilingualPairs(initialProduct.surface),
      dimensions: Array.isArray(initialProduct.dimensions)
        ? initialProduct.dimensions.map((d) => ({
            length: d.length,
            width: d.width,
            thickness: d.thickness,
          }))
        : [],
      published: initialProduct.published !== undefined ? initialProduct.published : true,
    };
  }, [initialProduct]);

  // Form Orchestrator
  const methods = useForm<ProductFormSchemaType>({
    resolver: zodResolver(productFormSchema),
    defaultValues,
    mode: 'onTouched',
  });

  const {
    handleSubmit,
    formState: { isSubmitting },
  } = methods;

  // Media Queues & State
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [newGalleryFiles, setNewGalleryFiles] = useState<File[]>([]);
  const [removedCover, setRemovedCover] = useState(false);
  const [deletedGalleryIds, setDeletedGalleryIds] = useState<string[]>([]);
  const [isDeletingCover, setIsDeletingCover] = useState(false);
  const [deletingGalleryPublicId, setDeletingGalleryPublicId] = useState<string | null>(null);

  // Submit Orchestration Custom Hook
  const { creationStep, handleSubmitForm } = useProductFormSubmit({
    productId,
    coverFile,
    newGalleryFiles,
    onClearCoverFile: () => setCoverFile(null),
    onClearGalleryFiles: () => setNewGalleryFiles([]),
  });

  const existingCover = removedCover ? null : initialProduct?.coverImage || null;
  const existingGallery = (initialProduct?.gallery || []).filter(
    (img) => !deletedGalleryIds.includes(img.publicId)
  );

  // Existing Cover Image Deletion
  const handleDeleteExistingCover = async () => {
    if (!productId) return;
    try {
      setIsDeletingCover(true);
      await deleteProductCoverImage(productId);
      setRemovedCover(true);
      queryClient.invalidateQueries({ queryKey: ['admin', 'products', productId] });
      toast.add({
        title: t('toasts.deleteCoverSuccess'),
        type: 'success',
      });
    } catch {
      toast.add({
        title: t('toasts.deleteCoverError'),
        type: 'error',
      });
    } finally {
      setIsDeletingCover(false);
    }
  };

  // Existing Gallery Image Deletion
  const handleDeleteExistingGallery = async (publicId: string) => {
    if (!productId) return;
    try {
      setDeletingGalleryPublicId(publicId);
      await deleteProductGalleryImage(productId, publicId);
      setDeletedGalleryIds((prev) => [...prev, publicId]);
      queryClient.invalidateQueries({ queryKey: ['admin', 'products', productId] });
      toast.add({
        title: t('toasts.deleteGallerySuccess'),
        type: 'success',
      });
    } catch {
      toast.add({
        title: t('toasts.deleteGalleryError'),
        type: 'error',
      });
    } finally {
      setDeletingGalleryPublicId(null);
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(handleSubmitForm)} className="space-y-6">
        {/* Page Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <Link
              href="/admin/products"
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-2 transition-colors">
              <ArrowLeft className="h-3.5 w-3.5 rtl:rotate-180" />
              <span>{t('backToProducts')}</span>
            </Link>
            <h1 className="font-heading text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              {isEditMode ? t('editTitle') : t('createTitle')}
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              {isEditMode ? t('editSubtitle') : t('createSubtitle')}
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0 self-start sm:self-auto">
            <Link
              href="/admin/products"
              className={buttonVariants({ variant: 'outline', size: 'default' })}>
              {t('buttons.cancel')}
            </Link>
            <Button
              type="submit"
              disabled={isSubmitting || creationStep !== 'idle'}
              className="gap-2 font-semibold shadow-xs">
              {isSubmitting || creationStep !== 'idle' ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>{t('buttons.saving')}</span>
                </>
              ) : (
                <>
                  <Save className="h-4 w-4" />
                  <span>{isEditMode ? t('buttons.update') : t('buttons.create')}</span>
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Step-by-Step Progress Banner during Multi-step submission */}
        {creationStep !== 'idle' && (
          <Card className="border-primary/30 bg-primary/5 shadow-xs animate-in fade-in">
            <CardContent className="flex items-center gap-3 p-4">
              <Loader2 className="h-5 w-5 animate-spin text-primary shrink-0" />
              <div className="flex-1 text-xs">
                <span className="font-bold text-foreground">
                  {creationStep === 'creating' && t('steps.creating')}
                  {creationStep === 'uploadingCover' && t('steps.uploadingCover')}
                  {creationStep === 'uploadingGallery' &&
                    t('steps.uploadingGallery', { count: newGalleryFiles.length })}
                </span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Form Sections */}
        <ProductBasicInfoFields />
        <ProductAttributesFields />
        <ProductImageUploadSection
          coverFile={coverFile}
          existingCover={existingCover}
          onSelectCoverFile={setCoverFile}
          onDeleteExistingCover={isEditMode ? handleDeleteExistingCover : undefined}
          isDeletingCover={isDeletingCover}
          newGalleryFiles={newGalleryFiles}
          existingGallery={existingGallery}
          onAddGalleryFiles={(files) => setNewGalleryFiles((prev) => [...prev, ...files])}
          onRemoveNewGalleryFile={(idx) =>
            setNewGalleryFiles((prev) => prev.filter((_, i) => i !== idx))
          }
          onDeleteExistingGallery={isEditMode ? handleDeleteExistingGallery : undefined}
          deletingGalleryPublicId={deletingGalleryPublicId}
        />

        {/* Bottom Actions Bar */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
          <Link
            href="/admin/products"
            className={buttonVariants({ variant: 'outline', size: 'default' })}>
            {t('buttons.cancel')}
          </Link>
          <Button
            type="submit"
            disabled={isSubmitting || creationStep !== 'idle'}
            className="gap-2 font-semibold shadow-xs">
            {isSubmitting || creationStep !== 'idle' ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>{t('buttons.saving')}</span>
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                <span>{isEditMode ? t('buttons.update') : t('buttons.create')}</span>
              </>
            )}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
}

export function ProductForm({ projectId }: ProductFormProps) {
  const isEditMode = Boolean(projectId);

  // Fetch Product in Edit Mode
  const {
    data: productData,
    isLoading: isProductLoading,
    isError: isProductError,
    refetch: refetchProduct,
  } = useQuery({
    queryKey: ['admin', 'products', projectId],
    queryFn: () => getAdminProductById(projectId!),
    enabled: isEditMode,
    staleTime: 30_000,
  });

  // Loading skeleton while fetching product in edit mode
  if (isEditMode && isProductLoading) {
    return <ProductFormSkeleton />;
  }

  // Error card if product query fails in edit mode
  if (isEditMode && (isProductError || !productData)) {
    return <ProductFormErrorState onRetry={() => refetchProduct()} />;
  }

  return <ProductFormInner productId={projectId} initialProduct={productData} />;
}
