import mongoose, { Document, Schema } from 'mongoose';

export interface ICategory extends Document {
  name: {
    ar: string;
    en: string;
  };
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

const categorySchema = new Schema<ICategory>(
  {
    name: {
      ar: {
        type: String,
        required: [true, 'Arabic name is required'],
        trim: true,
      },
      en: {
        type: String,
        required: [true, 'English name is required'],
        trim: true,
      },
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
  },
  { timestamps: true },
);

// Compound index for consistent sort by English name
categorySchema.index({ 'name.en': 1 });

const Category = mongoose.model<ICategory>('Category', categorySchema);

export default Category;
