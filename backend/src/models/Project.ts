import mongoose, { Document, Schema } from 'mongoose';

export type ProjectStatus = 'ongoing' | 'completed';
export type ProjectType = 'government' | 'private';

export interface ILocalizedText {
  ar: string;
  en: string;
}

export interface IImageMeta {
  url: string;
  publicId: string;
}

export interface IContractor {
  name: ILocalizedText;
  description: ILocalizedText;
}

export interface IProject extends Document {
  title: ILocalizedText;
  description: ILocalizedText;
  slug: string;
  projectType: ProjectType;
  governmentEntity: ILocalizedText | null;
  contractors: IContractor[];
  location: ILocalizedText;
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

const localizedTextSchema = new Schema<ILocalizedText>(
  {
    ar: { type: String, trim: true },
    en: { type: String, trim: true },
  },
  { _id: false },
);

const contractorSchema = new Schema<IContractor>(
  {
    name: {
      ar: { type: String, trim: true },
      en: { type: String, trim: true },
    },
    description: {
      ar: { type: String, trim: true },
      en: { type: String, trim: true },
    },
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
    projectType: {
      type: String,
      enum: ['government', 'private'],
      required: [true, 'Project type is required'],
    },
    governmentEntity: {
      type: localizedTextSchema,
      default: null,
    },
    contractors: {
      type: [contractorSchema],
      default: [],
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

const hasRequiredText = (fieldValue: unknown): boolean =>
  typeof fieldValue === 'string' && fieldValue.trim().length > 0;

const validateGovernmentFields = (project: IProject): void => {
  if (!hasRequiredText(project.governmentEntity?.ar)) {
    project.invalidate('governmentEntity.ar', 'Arabic government entity is required');
  }
  if (!hasRequiredText(project.governmentEntity?.en)) {
    project.invalidate('governmentEntity.en', 'English government entity is required');
  }
  if (!Array.isArray(project.contractors) || project.contractors.length === 0) {
    project.invalidate('contractors', 'At least one contractor is required');
  }

  project.contractors?.forEach((contractor, index) => {
    if (!hasRequiredText(contractor.name?.ar)) {
      project.invalidate(`contractors.${index}.name.ar`, 'Arabic contractor name is required');
    }
    if (!hasRequiredText(contractor.name?.en)) {
      project.invalidate(`contractors.${index}.name.en`, 'English contractor name is required');
    }
    if (!hasRequiredText(contractor.description?.ar)) {
      project.invalidate(
        `contractors.${index}.description.ar`,
        'Arabic contractor description is required',
      );
    }
    if (!hasRequiredText(contractor.description?.en)) {
      project.invalidate(
        `contractors.${index}.description.en`,
        'English contractor description is required',
      );
    }
  });
};

const validatePrivateFields = (project: IProject): void => {
  if (project.governmentEntity != null) {
    project.invalidate('governmentEntity', 'Private projects must not have a government entity');
  }
  if (Array.isArray(project.contractors) && project.contractors.length > 0) {
    project.invalidate('contractors', 'Private projects must not have contractors');
  }
};

projectSchema.pre('validate', function validateProjectTypeFields(next) {
  if (this.projectType === 'government') validateGovernmentFields(this);
  if (this.projectType === 'private') validatePrivateFields(this);

  next();
});

// Indexes for common query patterns (slug index is implicit from unique:true above)
projectSchema.index({ status: 1 }); // filter by status
projectSchema.index({ published: 1 }); // public/admin published filter
projectSchema.index({ featured: 1 }); // featured projects query
projectSchema.index({ published: 1, featured: 1 }); // common public compound

const Project = mongoose.model<IProject>('Project', projectSchema);

export default Project;
