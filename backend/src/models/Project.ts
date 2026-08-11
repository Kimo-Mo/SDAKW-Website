import mongoose, { Document, Schema, Types } from 'mongoose';

export type ProjectStatus = 'ongoing' | 'completed';

export interface IImageMeta {
  url: string;
  publicId: string;
}

export interface IProject extends Document {
  title: {
    ar: string;
    en: string;
  };
  description: {
    ar: string;
    en: string;
  };
  slug: string;
  category: Types.ObjectId;
  location: {
    ar: string;
    en: string;
  };
  completionDate: Date | null;
  status: ProjectStatus;
  coverImage: IImageMeta | null;
  gallery: IImageMeta[];
  featured: boolean;
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const imagemetaSchema = new Schema<IImageMeta>(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true },
  },
  { _id: false },
);

const projectSchema = new Schema<IProject>(
  {
    title: {
      ar: { type: String, required: [true, 'Arabic title is required'], trim: true },
      en: { type: String, required: [true, 'English title is required'], trim: true },
    },
    description: {
      ar: { type: String, required: [true, 'Arabic description is required'], trim: true },
      en: { type: String, required: [true, 'English description is required'], trim: true },
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category is required'],
    },
    location: {
      ar: { type: String, required: [true, 'Arabic location is required'], trim: true },
      en: { type: String, required: [true, 'English location is required'], trim: true },
    },
    completionDate: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: {
        values: ['ongoing', 'completed'],
        message: 'Status must be "ongoing" or "completed"',
      },
      required: [true, 'Status is required'],
    },
    coverImage: {
      type: imagemetaSchema,
      default: null,
    },
    gallery: {
      type: [imagemetaSchema],
      default: [],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    published: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

// Indexes for common query patterns (slug index is implicit from unique:true above)
projectSchema.index({ category: 1 }); // filter by category
projectSchema.index({ status: 1 }); // filter by status
projectSchema.index({ published: 1 }); // public/admin published filter
projectSchema.index({ featured: 1 }); // featured projects query
projectSchema.index({ published: 1, featured: 1 }); // common public compound

const Project = mongoose.model<IProject>('Project', projectSchema);

export default Project;
