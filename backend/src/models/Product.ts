import mongoose, { Document, Schema } from 'mongoose';
import { ILocalizedText, IImageMeta } from './Project';

export type ProductCategory =
  'natural_granite' | 'natural_stone' | 'natural_marble' | 'quartz_industrial';

export interface ILocalizedArray {
  ar: string[];
  en: string[];
}

export interface IDimension {
  length: number;
  width: number;
  thickness: number;
}

export interface IProduct extends Document {
  name: ILocalizedText;
  category: ProductCategory;
  material: ILocalizedText;
  color: ILocalizedArray;
  origin: ILocalizedArray;
  uses: ILocalizedArray;
  surface: ILocalizedArray;
  dimensions: IDimension[];
  slug: string;
  coverImage: IImageMeta | null;
  gallery: IImageMeta[];
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const dimensionSchema = new Schema<IDimension>(
  {
    length: { type: Number, required: true },
    width: { type: Number, required: true },
    thickness: { type: Number, required: true },
  },
  { _id: false },
);

const imagemetaSchema = new Schema<IImageMeta>(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true },
  },
  { _id: false },
);

const productSchema = new Schema<IProduct>(
  {
    name: {
      ar: { type: String, required: [true, 'Arabic name is required'], trim: true },
      en: { type: String, required: [true, 'English name is required'], trim: true },
    },
    category: {
      type: String,
      enum: {
        values: ['natural_granite', 'natural_stone', 'natural_marble', 'quartz_industrial'],
        message:
          'Category must be "natural_granite", "natural_stone", "natural_marble", or "quartz_industrial"',
      },
      required: [true, 'Category is required'],
    },
    material: {
      ar: { type: String, required: [true, 'Arabic material is required'], trim: true },
      en: { type: String, required: [true, 'English material is required'], trim: true },
    },
    color: {
      ar: { type: [String], default: [] },
      en: { type: [String], default: [] },
    },
    origin: {
      ar: { type: [String], default: [] },
      en: { type: [String], default: [] },
    },
    uses: {
      ar: { type: [String], default: [] },
      en: { type: [String], default: [] },
    },
    surface: {
      ar: { type: [String], default: [] },
      en: { type: [String], default: [] },
    },
    dimensions: {
      type: [dimensionSchema],
      default: [],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    coverImage: {
      type: imagemetaSchema,
      default: null,
    },
    gallery: {
      type: [imagemetaSchema],
      default: [],
    },
    published: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

// Indexes for common query patterns (slug index is implicit from unique:true above)
productSchema.index({ category: 1 }); // filter by category
productSchema.index({ published: 1 }); // public/admin published filter
productSchema.index({ published: 1, category: 1 }); // common public compound

const Product = mongoose.model<IProduct>('Product', productSchema);

export default Product;
