'use client';

import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useTranslations } from 'next-intl';

import type { ProductFormValues } from '@/types/admin';
import { normalizeProductPayload, type ProductFormSchemaType } from '@/lib/validations/product';
import {
  createAdminProduct,
  updateAdminProduct,
  uploadProductCoverImage,
  uploadProductGalleryImages,
} from '@/lib/api/products';
import { useRouter } from '@/i18n/navigation';
import { toast } from '@/components/ui/toast';

export type CreationStep = 'idle' | 'creating' | 'uploadingCover' | 'uploadingGallery' | 'done';

interface UseProductFormSubmitParams {
  productId?: string;
  coverFile: File | null;
  newGalleryFiles: File[];
  onClearCoverFile: () => void;
  onClearGalleryFiles: () => void;
}

export function useProductFormSubmit({
  productId,
  coverFile,
  newGalleryFiles,
  onClearCoverFile,
  onClearGalleryFiles,
}: UseProductFormSubmitParams) {
  const t = useTranslations('admin.products.form');
  const router = useRouter();
  const queryClient = useQueryClient();
  const isEditMode = Boolean(productId);

  const [creationStep, setCreationStep] = useState<CreationStep>('idle');

  const handleSubmitForm = async (values: ProductFormSchemaType) => {
    const payload = normalizeProductPayload(values as ProductFormValues);

    if (isEditMode && productId) {
      // ===== EDIT FLOW (Multi-step with Granular Feedback) =====
      let coverFailed = false;
      let galleryFailed = false;

      try {
        setCreationStep('creating');
        // 1. Update text attributes
        await updateAdminProduct(productId, payload);

        // 2. Upload replacement cover if selected
        if (coverFile) {
          setCreationStep('uploadingCover');
          try {
            await uploadProductCoverImage(productId, coverFile);
            onClearCoverFile();
          } catch (err) {
            console.error('Cover upload failed:', err);
            coverFailed = true;
          }
        }

        // 3. Upload new gallery files if selected
        if (newGalleryFiles.length > 0) {
          setCreationStep('uploadingGallery');
          try {
            await uploadProductGalleryImages(productId, newGalleryFiles);
            onClearGalleryFiles();
          } catch (err) {
            console.error('Gallery upload failed:', err);
            galleryFailed = true;
          }
        }

        queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
        queryClient.invalidateQueries({ queryKey: ['admin', 'products', productId] });

        if (coverFailed && galleryFailed) {
          toast.add({
            title: t('toasts.partialUploadBothFailed'),
            type: 'warning',
          });
        } else if (coverFailed) {
          toast.add({
            title: t('toasts.partialUploadCoverFailed'),
            type: 'warning',
          });
        } else if (galleryFailed) {
          toast.add({
            title: t('toasts.partialUploadGalleryFailed'),
            type: 'warning',
          });
        } else {
          toast.add({
            title: t('toasts.updateSuccess'),
            type: 'success',
          });
          router.push('/admin/products');
        }
      } catch (error: unknown) {
        const serverMessage =
          axios.isAxiosError(error) && typeof error.response?.data?.message === 'string'
            ? error.response.data.message
            : undefined;

        toast.add({
          title: t('toasts.updateError'),
          description: serverMessage,
          type: 'error',
        });
      } finally {
        setCreationStep('idle');
      }
    } else {
      // ===== CREATE FLOW (Sequential with Partial Failure Recovery) =====
      let createdProductId: string | null = null;
      let coverFailed = false;
      let galleryFailed = false;

      try {
        // Step 1: Create Base Product
        setCreationStep('creating');
        const newProduct = await createAdminProduct(payload);
        createdProductId = newProduct._id;

        if (!createdProductId) {
          throw new Error('Product was created but ID is missing from response.');
        }

        // Step 2: Upload Cover Image (if queued)
        if (coverFile) {
          setCreationStep('uploadingCover');
          try {
            await uploadProductCoverImage(createdProductId, coverFile);
          } catch (err) {
            console.error('Cover upload failed:', err);
            coverFailed = true;
          }
        }

        // Step 3: Upload Gallery Images (if queued)
        if (newGalleryFiles.length > 0) {
          setCreationStep('uploadingGallery');
          try {
            await uploadProductGalleryImages(createdProductId, newGalleryFiles);
          } catch (err) {
            console.error('Gallery upload failed:', err);
            galleryFailed = true;
          }
        }

        queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });

        if (coverFailed && galleryFailed) {
          toast.add({
            title: t('toasts.partialUploadBothFailed'),
            type: 'warning',
          });
          router.push(`/admin/products/${createdProductId}/edit`);
        } else if (coverFailed) {
          toast.add({
            title: t('toasts.partialUploadCoverFailed'),
            type: 'warning',
          });
          router.push(`/admin/products/${createdProductId}/edit`);
        } else if (galleryFailed) {
          toast.add({
            title: t('toasts.partialUploadGalleryFailed'),
            type: 'warning',
          });
          router.push(`/admin/products/${createdProductId}/edit`);
        } else {
          toast.add({
            title: t('toasts.createSuccess'),
            type: 'success',
          });
          router.push('/admin/products');
        }
      } catch (error: unknown) {
        const serverMessage =
          axios.isAxiosError(error) && typeof error.response?.data?.message === 'string'
            ? error.response.data.message
            : undefined;

        toast.add({
          title: t('toasts.createError'),
          description: serverMessage,
          type: 'error',
        });
      } finally {
        setCreationStep('idle');
      }
    }
  };

  return {
    creationStep,
    handleSubmitForm,
  };
}
