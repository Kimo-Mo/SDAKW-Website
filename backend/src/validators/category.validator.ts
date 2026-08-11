import { z } from 'zod';

const localizedNameSchema = z.object({
  ar: z.string().min(1, 'Arabic name is required').trim(),
  en: z.string().min(1, 'English name is required').trim(),
});

export const createCategorySchema = z.object({
  name: localizedNameSchema,
});

export const updateCategorySchema = z.object({
  name: localizedNameSchema.partial(),
});

export type CreateCategoryInput = z.infer<typeof createCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof updateCategorySchema>;
