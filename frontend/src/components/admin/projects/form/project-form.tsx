'use client';

import { useState, useMemo } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useTranslations } from 'next-intl';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';

import type { BackendProject } from '@/types/admin';
import { projectFormSchema, type ProjectFormSchemaType } from '@/lib/validations/project';
import {
  getAdminProjectById,
  deleteProjectCoverImage,
  deleteProjectGalleryImage,
} from '@/lib/api/projects';
import { Link } from '@/i18n/navigation';
import { toast } from '@/components/ui/toast';
import { Button, buttonVariants } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

import { BasicInfoFields } from './basic-info-fields';
import { ClassificationFields } from './classification-fields';
import { StatusFields } from './status-fields';
import { ImageUploadSection } from './image-upload-section';
import { useProjectFormSubmit } from './use-project-form-submit';
import { ProjectFormSkeleton, ProjectFormErrorState } from './project-form-status-cards';

interface ProjectFormProps {
  projectId?: string;
}

const DEFAULT_FORM_VALUES: ProjectFormSchemaType = {
  title: { ar: '', en: '' },
  description: { ar: '', en: '' },
  location: { ar: '', en: '' },
  projectType: 'private',
  governmentEntity: { ar: '', en: '' },
  contractors: [],
  status: 'ongoing',
  completionDate: '',
  featured: false,
  published: true,
};

interface ProjectFormInnerProps {
  projectId?: string;
  initialProject?: BackendProject;
}

function ProjectFormInner({ projectId, initialProject }: ProjectFormInnerProps) {
  const t = useTranslations('admin.projects.form');
  const queryClient = useQueryClient();
  const isEditMode = Boolean(projectId);

  // Compute defaultValues synchronously for initial form mount
  const defaultValues: ProjectFormSchemaType = useMemo(() => {
    if (!initialProject) {
      return DEFAULT_FORM_VALUES;
    }
    return {
      title: {
        ar: initialProject.title?.ar || '',
        en: initialProject.title?.en || '',
      },
      description: {
        ar: initialProject.description?.ar || '',
        en: initialProject.description?.en || '',
      },
      location: {
        ar: initialProject.location?.ar || '',
        en: initialProject.location?.en || '',
      },
      projectType: initialProject.projectType || 'private',
      governmentEntity: {
        ar: initialProject.governmentEntity?.ar || '',
        en: initialProject.governmentEntity?.en || '',
      },
      contractors: Array.isArray(initialProject.contractors)
        ? initialProject.contractors.map((c) => ({
            name: { ar: c.name?.ar || '', en: c.name?.en || '' },
            description: { ar: c.description?.ar || '', en: c.description?.en || '' },
          }))
        : [],
      status: initialProject.status || 'ongoing',
      completionDate: initialProject.completionDate
        ? typeof initialProject.completionDate === 'string'
          ? initialProject.completionDate.split('T')[0]
          : new Date(initialProject.completionDate).toISOString().split('T')[0]
        : '',
      featured: Boolean(initialProject.featured),
      published: initialProject.published !== undefined ? initialProject.published : true,
    };
  }, [initialProject]);

  // Form Orchestrator
  const methods = useForm<ProjectFormSchemaType>({
    resolver: zodResolver(projectFormSchema),
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
  const { creationStep, handleSubmitForm } = useProjectFormSubmit({
    projectId,
    coverFile,
    newGalleryFiles,
    onClearCoverFile: () => setCoverFile(null),
    onClearGalleryFiles: () => setNewGalleryFiles([]),
  });

  const existingCover = removedCover ? null : initialProject?.coverImage || null;
  const existingGallery = (initialProject?.gallery || []).filter(
    (img) => !deletedGalleryIds.includes(img.publicId)
  );

  // Existing Cover Image Deletion
  const handleDeleteExistingCover = async () => {
    if (!projectId) return;
    try {
      setIsDeletingCover(true);
      await deleteProjectCoverImage(projectId);
      setRemovedCover(true);
      queryClient.invalidateQueries({ queryKey: ['admin', 'projects', projectId] });
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
    if (!projectId) return;
    try {
      setDeletingGalleryPublicId(publicId);
      await deleteProjectGalleryImage(projectId, publicId);
      setDeletedGalleryIds((prev) => [...prev, publicId]);
      queryClient.invalidateQueries({ queryKey: ['admin', 'projects', projectId] });
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
              href="/admin/projects"
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-2 transition-colors">
              <ArrowLeft className="h-3.5 w-3.5 rtl:rotate-180" />
              <span>{t('backToProjects')}</span>
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
              href="/admin/projects"
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
        <BasicInfoFields />
        <ClassificationFields />
        <StatusFields />
        <ImageUploadSection
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
            href="/admin/projects"
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

export function ProjectForm({ projectId }: ProjectFormProps) {
  const isEditMode = Boolean(projectId);

  // Fetch Project in Edit Mode
  const {
    data: projectData,
    isLoading: isProjectLoading,
    isError: isProjectError,
    refetch: refetchProject,
  } = useQuery({
    queryKey: ['admin', 'projects', projectId],
    queryFn: () => getAdminProjectById(projectId!),
    enabled: isEditMode,
    staleTime: 30_000,
  });

  // Loading skeleton while fetching project in edit mode
  if (isEditMode && isProjectLoading) {
    return <ProjectFormSkeleton />;
  }

  // Error card if project query fails in edit mode
  if (isEditMode && (isProjectError || !projectData)) {
    return <ProjectFormErrorState onRetry={() => refetchProject()} />;
  }

  return <ProjectFormInner projectId={projectId} initialProject={projectData} />;
}
