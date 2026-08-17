'use client';

import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useTranslations } from 'next-intl';

import type { ProjectFormValues } from '@/types/admin';
import { normalizeProjectPayload, type ProjectFormSchemaType } from '@/lib/validations/project';
import {
  createAdminProject,
  updateAdminProject,
  uploadProjectCoverImage,
  uploadProjectGalleryImages,
} from '@/lib/api/projects';
import { useRouter } from '@/i18n/navigation';
import { toast } from '@/components/ui/toast';

export type CreationStep = 'idle' | 'creating' | 'uploadingCover' | 'uploadingGallery' | 'done';

interface UseProjectFormSubmitParams {
  projectId?: string;
  coverFile: File | null;
  newGalleryFiles: File[];
  onClearCoverFile: () => void;
  onClearGalleryFiles: () => void;
}

export function useProjectFormSubmit({
  projectId,
  coverFile,
  newGalleryFiles,
  onClearCoverFile,
  onClearGalleryFiles,
}: UseProjectFormSubmitParams) {
  const t = useTranslations('admin.projects.form');
  const router = useRouter();
  const queryClient = useQueryClient();
  const isEditMode = Boolean(projectId);

  const [creationStep, setCreationStep] = useState<CreationStep>('idle');

  const handleSubmitForm = async (values: ProjectFormSchemaType) => {
    const payload = normalizeProjectPayload(values as ProjectFormValues);

    if (isEditMode && projectId) {
      // ===== EDIT FLOW (Multi-step with Granular Feedback) =====
      let coverFailed = false;
      let galleryFailed = false;

      try {
        setCreationStep('creating');
        // 1. Update text attributes & normalized classification
        await updateAdminProject(projectId, payload);

        // 2. Upload replacement cover if selected
        if (coverFile) {
          setCreationStep('uploadingCover');
          try {
            await uploadProjectCoverImage(projectId, coverFile);
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
            await uploadProjectGalleryImages(projectId, newGalleryFiles);
            onClearGalleryFiles();
          } catch (err) {
            console.error('Gallery upload failed:', err);
            galleryFailed = true;
          }
        }

        queryClient.invalidateQueries({ queryKey: ['admin', 'projects'] });
        queryClient.invalidateQueries({ queryKey: ['admin', 'projects', projectId] });
        queryClient.invalidateQueries({ queryKey: ['admin', 'projects', 'summary'] });

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
          router.push('/admin/projects');
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
      let createdProjectId: string | null = null;
      let coverFailed = false;
      let galleryFailed = false;

      try {
        // Step 1: Create Base Project
        setCreationStep('creating');
        const newProject = await createAdminProject(payload);
        createdProjectId = newProject._id;

        if (!createdProjectId) {
          throw new Error('Project was created but ID is missing from response.');
        }

        // Step 2: Upload Cover Image (if queued)
        if (coverFile) {
          setCreationStep('uploadingCover');
          try {
            await uploadProjectCoverImage(createdProjectId, coverFile);
          } catch (err) {
            console.error('Cover upload failed:', err);
            coverFailed = true;
          }
        }

        // Step 3: Upload Gallery Images (if queued)
        if (newGalleryFiles.length > 0) {
          setCreationStep('uploadingGallery');
          try {
            await uploadProjectGalleryImages(createdProjectId, newGalleryFiles);
          } catch (err) {
            console.error('Gallery upload failed:', err);
            galleryFailed = true;
          }
        }

        queryClient.invalidateQueries({ queryKey: ['admin', 'projects'] });
        queryClient.invalidateQueries({ queryKey: ['admin', 'projects', 'summary'] });

        if (coverFailed && galleryFailed) {
          toast.add({
            title: t('toasts.partialUploadBothFailed'),
            type: 'warning',
          });
          router.push(`/admin/projects/${createdProjectId}/edit`);
        } else if (coverFailed) {
          toast.add({
            title: t('toasts.partialUploadCoverFailed'),
            type: 'warning',
          });
          router.push(`/admin/projects/${createdProjectId}/edit`);
        } else if (galleryFailed) {
          toast.add({
            title: t('toasts.partialUploadGalleryFailed'),
            type: 'warning',
          });
          router.push(`/admin/projects/${createdProjectId}/edit`);
        } else {
          toast.add({
            title: t('toasts.createSuccess'),
            type: 'success',
          });
          router.push('/admin/projects');
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
