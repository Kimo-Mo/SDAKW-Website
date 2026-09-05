import { z } from 'zod';

// ── Shared primitives ─────────────────────────────────────────────────────────

const localizedTextSchema = z.object({
  ar: z.string().min(1).trim(),
  en: z.string().min(1).trim(),
});

const categoryEnum = z.enum(
  ['natural_granite', 'natural_stone', 'natural_marble', 'quartz_industrial'],
  {
    required_error: 'Category is required',
    invalid_type_error:
      'Category must be "natural_granite", "natural_stone", "natural_marble", or "quartz_industrial"',
  },
);

/**
 * Schema for a bilingual array field (e.g. color, origin, uses, surface).
 *
 * Each array must contain at least 1 non-empty trimmed string.
 *
 * DATA INTEGRITY CONTRACT:
 *   Index position matters — ar[i] and en[i] must represent the same
 *   real-world value (e.g. both index 0 of color.ar / color.en describe
 *   the same color). The frontend admin form must also respect this
 *   contract when submitting data.
 */
const bilingualArraySchema = (
  fieldName: string,
): z.ZodEffects<z.ZodObject<{ ar: z.ZodArray<z.ZodString>; en: z.ZodArray<z.ZodString> }>> =>
  z
    .object({
      ar: z
        .array(
          z.string().min(1, `${fieldName}: each Arabic item must be a non-empty string`).trim(),
        )
        .min(1, `${fieldName}: at least one Arabic item is required`),
      en: z
        .array(
          z.string().min(1, `${fieldName}: each English item must be a non-empty string`).trim(),
        )
        .min(1, `${fieldName}: at least one English item is required`),
    })
    .refine((val) => val.ar.length === val.en.length, {
      message: `${fieldName}: ar and en must have the same number of items`,
    });

// ── Dimensions primitive ──────────────────────────────────────────────────────

export const dimensionItemSchema = z.object({
  length: z
    .number({
      required_error: 'Length is required',
      invalid_type_error: 'Length must be a number',
    })
    .positive('Length must be greater than 0'),
  width: z
    .number({
      required_error: 'Width is required',
      invalid_type_error: 'Width must be a number',
    })
    .positive('Width must be greater than 0'),
  thickness: z
    .number({
      required_error: 'Thickness is required',
      invalid_type_error: 'Thickness must be a number',
    })
    .positive('Thickness must be greater than 0'),
});

// ── Create ────────────────────────────────────────────────────────────────────

export const createProductSchema = z.object({
  name: z.object({
    ar: z.string().min(1, 'Arabic name is required').trim(),
    en: z.string().min(1, 'English name is required').trim(),
  }),
  category: categoryEnum,
  material: z.object({
    ar: z.string().min(1, 'Arabic material is required').trim(),
    en: z.string().min(1, 'English material is required').trim(),
  }),
  // DATA INTEGRITY CONTRACT:
  // For each bilingual array field below, index position matters:
  //   ar[i] and en[i] must represent the same real-world value.
  // The frontend admin form must also respect this contract.
  color: bilingualArraySchema('color'),
  origin: bilingualArraySchema('origin'),
  uses: bilingualArraySchema('uses'),
  surface: bilingualArraySchema('surface'),
  dimensions: z.array(dimensionItemSchema).optional().default([]),
  published: z.boolean().optional().default(false),
});

// ── Update (PATCH) ────────────────────────────────────────────────────────────

/**
 * For PATCH — all fields optional.
 * When a bilingual array field is provided, the ar/en same-length rule still applies.
 */
export const updateProductSchema = z.object({
  name: localizedTextSchema.partial().optional(),
  category: categoryEnum.optional(),
  material: localizedTextSchema.partial().optional(),
  // Bilingual array fields: optional on the outer level, but when present
  // the same-length refine still fires inside bilingualArraySchema.
  color: bilingualArraySchema('color').optional(),
  origin: bilingualArraySchema('origin').optional(),
  uses: bilingualArraySchema('uses').optional(),
  surface: bilingualArraySchema('surface').optional(),
  dimensions: z.array(dimensionItemSchema).optional(),
  published: z.boolean().optional(),
});

// ── Admin list query params ───────────────────────────────────────────────────

export const adminProductQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(100).optional().default(10),
  search: z.string().trim().optional(),
  category: categoryEnum.optional(),
  published: z
    .string()
    .optional()
    .transform((v) => (v === 'true' ? true : v === 'false' ? false : undefined)),
});

// ── Public list query params ──────────────────────────────────────────────────

export const publicProductQuerySchema = z.object({
  page: z.coerce.number().int().min(1).optional().default(1),
  limit: z.coerce.number().int().min(1).max(50).optional().default(9),
  category: categoryEnum.optional(),
});

// ── Inferred types ────────────────────────────────────────────────────────────

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
export type AdminProductQuery = z.infer<typeof adminProductQuerySchema>;
export type PublicProductQuery = z.infer<typeof publicProductQuerySchema>;
