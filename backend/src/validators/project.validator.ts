import { z } from 'zod';
import mongoose from 'mongoose';

// Reusable ObjectId validator
const objectId = z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
  message: 'Invalid category ID',
});

const localizedTextSchema = z.object({
  ar: z.string().min(1).trim(),
  en: z.string().min(1).trim(),
});

const localizedLocationSchema = z.object({
  ar: z.string().min(1, 'Arabic location is required').trim(),
  en: z.string().min(1, 'English location is required').trim(),
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
    category: objectId,
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
  });

// For PATCH — all fields optional, but cross-field rule still enforced when both are present
export const updateProjectSchema = z
  .object({
    title: localizedTextSchema.partial().optional(),
    description: localizedTextSchema.partial().optional(),
    category: objectId.optional(),
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
  });

// Admin list query params
export const adminProjectQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(10),
  search: z.string().trim().optional(),
  category: z.string().optional(),
  status: z.enum(['ongoing', 'completed']).optional(),
  published: z
    .string()
    .optional()
    .transform((v) => (v === 'true' ? true : v === 'false' ? false : undefined)),
  featured: z
    .string()
    .optional()
    .transform((v) => (v === 'true' ? true : v === 'false' ? false : undefined)),
});

// Public list query params
export const publicProjectQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(50).optional().default(9),
  category: z.string().optional(),
  status: z.enum(['ongoing', 'completed']).optional(),
  featured: z
    .string()
    .optional()
    .transform((v) => (v === 'true' ? true : v === 'false' ? false : undefined)),
});

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
export type AdminProjectQuery = z.infer<typeof adminProjectQuerySchema>;
export type PublicProjectQuery = z.infer<typeof publicProjectQuerySchema>;
