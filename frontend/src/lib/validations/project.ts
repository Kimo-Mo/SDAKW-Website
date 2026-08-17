import { z } from 'zod';
import type { CreateProjectPayload, ProjectFormValues } from '@/types/admin';

export const contractorSchema = z.object({
  name: z.object({
    ar: z.string().trim().min(1, { message: 'contractorNameArRequired' }),
    en: z.string().trim().min(1, { message: 'contractorNameEnRequired' }),
  }),
  description: z.object({
    ar: z.string().trim().min(1, { message: 'contractorDescArRequired' }),
    en: z.string().trim().min(1, { message: 'contractorDescEnRequired' }),
  }),
});

export const projectFormSchema = z
  .object({
    title: z.object({
      ar: z.string().trim().min(2, { message: 'titleArRequired' }),
      en: z.string().trim().min(2, { message: 'titleEnRequired' }),
    }),
    description: z.object({
      ar: z.string().trim().min(5, { message: 'descArRequired' }),
      en: z.string().trim().min(5, { message: 'descEnRequired' }),
    }),
    location: z
      .object({
        ar: z.string().trim().optional(),
        en: z.string().trim().optional(),
      })
      .optional(),
    projectType: z.enum(['government', 'private']),
    governmentEntity: z
      .object({
        ar: z.string().trim().optional(),
        en: z.string().trim().optional(),
      })
      .optional()
      .nullable(),
    contractors: z.array(contractorSchema).optional(),
    status: z.enum(['ongoing', 'completed']),
    completionDate: z.string().trim().optional().nullable(),
    featured: z.boolean(),
    published: z.boolean(),
  })
  .superRefine((data, ctx) => {
    // Government project conditional rules: requires governmentEntity & at least one contractor
    if (data.projectType === 'government') {
      if (!data.governmentEntity?.ar || data.governmentEntity.ar.trim().length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['governmentEntity', 'ar'],
          message: 'govEntityArRequired',
        });
      }
      if (!data.governmentEntity?.en || data.governmentEntity.en.trim().length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['governmentEntity', 'en'],
          message: 'govEntityEnRequired',
        });
      }
      if (!Array.isArray(data.contractors) || data.contractors.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['contractors'],
          message: 'contractorsRequired',
        });
      }
    }

    // Completed project status conditional rules: requires valid completionDate
    if (data.status === 'completed') {
      if (!data.completionDate || data.completionDate.trim().length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['completionDate'],
          message: 'completionDateRequired',
        });
      } else {
        const parsed = Date.parse(data.completionDate);
        if (Number.isNaN(parsed)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: ['completionDate'],
            message: 'invalidDate',
          });
        }
      }
    }
  });

export type ProjectFormSchemaType = z.infer<typeof projectFormSchema>;

/**
 * Normalizes form state into strict backend JSON payload, matching Constitution Principle III.
 * When private: governmentEntity is strictly null, contractors is strictly [].
 * When ongoing: completionDate is strictly null.
 */
export function normalizeProjectPayload(values: ProjectFormValues): CreateProjectPayload {
  const isGovernment = values.projectType === 'government';
  const isCompleted = values.status === 'completed';

  const payload: CreateProjectPayload = {
    title: {
      ar: values.title.ar.trim(),
      en: values.title.en.trim(),
    },
    description: {
      ar: values.description.ar.trim(),
      en: values.description.en.trim(),
    },
    projectType: values.projectType,
    status: values.status,
    featured: Boolean(values.featured),
    published: Boolean(values.published),
    governmentEntity:
      isGovernment && values.governmentEntity?.ar?.trim() && values.governmentEntity?.en?.trim()
        ? {
            ar: values.governmentEntity.ar.trim(),
            en: values.governmentEntity.en.trim(),
          }
        : null,
    contractors:
      isGovernment && Array.isArray(values.contractors) && values.contractors.length > 0
        ? values.contractors.map((c) => ({
            name: { ar: c.name.ar.trim(), en: c.name.en.trim() },
            description: { ar: c.description.ar.trim(), en: c.description.en.trim() },
          }))
        : [],
    completionDate: isCompleted && values.completionDate?.trim() ? values.completionDate.trim() : null,
  };

  // Location handling (optional)
  if (values.location?.ar?.trim() || values.location?.en?.trim()) {
    payload.location = {
      ar: values.location.ar?.trim() || '',
      en: values.location.en?.trim() || '',
    };
  }

  return payload;
}
