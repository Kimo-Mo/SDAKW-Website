import { z } from 'zod';
const localizedTextSchema = z.object({
  ar: z.string().min(1).trim(),
  en: z.string().min(1).trim(),
});

const optionalLocalizedTextSchema = z
  .object({
    ar: z.string().trim().optional(),
    en: z.string().trim().optional(),
  })
  .nullable()
  .optional();

const localizedLocationSchema = z.object({
  ar: z.string().min(1, 'Arabic location is required').trim(),
  en: z.string().min(1, 'English location is required').trim(),
});

const governmentEntitySchema = z
  .object({
    ar: z.string().min(1, 'Arabic government entity is required').trim(),
    en: z.string().min(1, 'English government entity is required').trim(),
  })
  .nullable()
  .optional();

const contractorSchema = z.object({
  name: z.object({
    ar: z.string().min(1, 'Arabic contractor name is required').trim(),
    en: z.string().min(1, 'English contractor name is required').trim(),
  }),
  description: z.object({
    ar: z.string().min(1, 'Arabic contractor description is required').trim(),
    en: z.string().min(1, 'English contractor description is required').trim(),
  }),
});

/**
 * completionDate rules:
 *  - status = "ongoing"   → completionDate must be null (or absent)
 *  - status = "completed" → completionDate must be a valid date
 *
 * The coerce step accepts ISO date strings from JSON bodies.
 * null is explicitly allowed and passes through as-is.
 */
const completionDateField = z.union([z.coerce.date(), z.null()]).optional();

export const createProjectSchema = z
  .object({
    title: z.object({
      ar: z.string().min(1, 'Arabic title is required').trim(),
      en: z.string().min(1, 'English title is required').trim(),
    }),
    description: z.object({
      ar: z.string().min(1, 'Arabic description is required').trim(),
      en: z.string().min(1, 'English description is required').trim(),
    }),
    projectType: z.enum(['government', 'private'], {
      required_error: 'Project type is required',
      invalid_type_error: 'Project type must be "government" or "private"',
    }),
    governmentEntity: governmentEntitySchema,
    contractors: z.array(contractorSchema).optional().default([]),
    location: localizedLocationSchema,
    completionDate: completionDateField,
    status: z.enum(['ongoing', 'completed'], {
      required_error: 'Status is required',
      invalid_type_error: 'Status must be "ongoing" or "completed"',
    }),
    featured: z.boolean().optional().default(false),
    published: z.boolean().optional().default(false),
  })
  .superRefine((data, ctx) => {
    if (data.status === 'ongoing' && data.completionDate != null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['completionDate'],
        message: 'Ongoing projects must not have a completion date',
      });
    }
    if (data.status === 'completed' && data.completionDate == null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['completionDate'],
        message: 'Completed projects require a completion date',
      });
    }
    if (data.projectType === 'government') {
      if (!data.governmentEntity) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['governmentEntity'],
          message: 'Government entity is required for government projects',
        });
      }
      if (data.contractors.length === 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['contractors'],
          message: 'At least one contractor is required for government projects',
        });
      }
    }
    if (data.projectType === 'private') {
      if (data.governmentEntity != null) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['governmentEntity'],
          message: 'Private projects must not include a government entity',
        });
      }
      if (data.contractors.length > 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['contractors'],
          message: 'Private projects must not include contractors',
        });
      }
    }
  });

// For PATCH — all fields optional, but cross-field rule still enforced when both are present
export const updateProjectSchema = z
  .object({
    title: localizedTextSchema.partial().optional(),
    description: localizedTextSchema.partial().optional(),
    projectType: z.enum(['government', 'private']).optional(),
    governmentEntity: optionalLocalizedTextSchema,
    contractors: z.array(contractorSchema).optional(),
    location: localizedLocationSchema.partial().optional(),
    completionDate: completionDateField,
    status: z.enum(['ongoing', 'completed']).optional(),
    featured: z.boolean().optional(),
    published: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    // Only validate the cross-field rule when both fields are present in the update
    if (data.status === 'ongoing' && data.completionDate != null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['completionDate'],
        message: 'Ongoing projects must not have a completion date',
      });
    }
    if (data.status === 'completed' && data.completionDate == null) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['completionDate'],
        message: 'Completed projects require a completion date',
      });
    }
    if (data.projectType === 'private') {
      if (data.governmentEntity != null) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['governmentEntity'],
          message: 'Private projects must not include a government entity',
        });
      }
      if (data.contractors !== undefined && data.contractors.length > 0) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ['contractors'],
          message: 'Private projects must not include contractors',
        });
      }
    }
  });

// Admin list query params
export const adminProjectQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(10),
  search: z.string().trim().optional(),
  status: z.enum(['ongoing', 'completed']).optional(),
  published: z
    .string()
    .optional()
    .transform((v) => (v === 'true' ? true : v === 'false' ? false : undefined)),
  featured: z
    .string()
    .optional()
    .transform((v) => (v === 'true' ? true : v === 'false' ? false : undefined)),
  projectType: z.enum(['government', 'private']).optional(),
});

// Public list query params
export const publicProjectQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(50).optional().default(9),
  status: z.enum(['ongoing', 'completed']).optional(),
  featured: z
    .string()
    .optional()
    .transform((v) => (v === 'true' ? true : v === 'false' ? false : undefined)),
  projectType: z.enum(['government', 'private']).optional(),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type AdminProjectQuery = z.infer<typeof adminProjectQuerySchema>;
export type PublicProjectQuery = z.infer<typeof publicProjectQuerySchema>;
