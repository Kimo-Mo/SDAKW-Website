import { z } from 'zod';
import type { CreateProductPayload, ProductFormValues } from '@/types/admin';

export const bilingualPairSchema = z.object({
  ar: z.string().trim().min(1, { message: 'itemArRequired' }),
  en: z.string().trim().min(1, { message: 'itemEnRequired' }),
});

export const productDimensionSchema = z.object({
  length: z
    .number({ message: 'dimensionPositive' })
    .positive({ message: 'dimensionPositive' }),
  width: z
    .number({ message: 'dimensionPositive' })
    .positive({ message: 'dimensionPositive' }),
  thickness: z
    .number({ message: 'dimensionPositive' })
    .positive({ message: 'dimensionPositive' }),
});

export const productFormSchema = z.object({
  name: z.object({
    ar: z.string().trim().min(2, { message: 'nameArRequired' }),
    en: z.string().trim().min(2, { message: 'nameEnRequired' }),
  }),
  category: z.enum([
    'natural_granite',
    'natural_stone',
    'natural_marble',
    'quartz_industrial',
  ]),
  material: z.object({
    ar: z.string().trim().min(2, { message: 'materialArRequired' }),
    en: z.string().trim().min(2, { message: 'materialEnRequired' }),
  }),
  color: z.array(bilingualPairSchema).min(1, { message: 'colorRequired' }),
  origin: z.array(bilingualPairSchema).min(1, { message: 'originRequired' }),
  uses: z.array(bilingualPairSchema).min(1, { message: 'usesRequired' }),
  surface: z.array(bilingualPairSchema).min(1, { message: 'surfaceRequired' }),
  dimensions: z.array(productDimensionSchema),
  published: z.boolean(),
});

export type ProductFormSchemaType = z.infer<typeof productFormSchema>;

/**
 * Normalizes form state into strict backend JSON payload.
 * Converts each array of { ar, en } pairs into parallel { ar: string[], en: string[] } arrays,
 * structurally guaranteeing exact same length and 1-to-1 index matching.
 */
export function normalizeProductPayload(values: ProductFormValues): CreateProductPayload {
  const payload: CreateProductPayload = {
    name: {
      ar: values.name.ar.trim(),
      en: values.name.en.trim(),
    },
    category: values.category,
    material: {
      ar: values.material.ar.trim(),
      en: values.material.en.trim(),
    },
    color: {
      ar: values.color.map((item) => item.ar.trim()),
      en: values.color.map((item) => item.en.trim()),
    },
    origin: {
      ar: values.origin.map((item) => item.ar.trim()),
      en: values.origin.map((item) => item.en.trim()),
    },
    uses: {
      ar: values.uses.map((item) => item.ar.trim()),
      en: values.uses.map((item) => item.en.trim()),
    },
    surface: {
      ar: values.surface.map((item) => item.ar.trim()),
      en: values.surface.map((item) => item.en.trim()),
    },
    dimensions: (values.dimensions || []).map((item) => ({
      length: Number(item.length),
      width: Number(item.width),
      thickness: Number(item.thickness),
    })),
    published: Boolean(values.published),
  };

  return payload;
}
