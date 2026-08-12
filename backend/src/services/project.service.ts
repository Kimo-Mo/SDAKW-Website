import mongoose, { FilterQuery } from 'mongoose';
import Project, { IProject } from '../models/Project';
import { ApiError } from '../utils/ApiError';
import { generateUniqueSlug } from '../utils/slug';
import { deleteImages } from './cloudinary.service';
import {
  CreateProjectInput,
  UpdateProjectInput,
  AdminProjectQuery,
  PublicProjectQuery,
} from '../validators/project.validator';

// ── Pagination helper ─────────────────────────────────────────────────────────

export interface PaginatedResult<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const paginate = async <T>(
  model: mongoose.Model<T>,
  filter: FilterQuery<T>,
  page: number,
  limit: number,
  sort: Record<string, 1 | -1> = { createdAt: -1 },
): Promise<PaginatedResult<T>> => {
  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    model.find(filter).sort(sort).skip(skip).limit(limit),
    model.countDocuments(filter),
  ]);

  return {
    items: items as T[],
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// ── Slug ──────────────────────────────────────────────────────────────────────

const slugExists = async (slug: string): Promise<boolean> => {
  const doc = await Project.exists({ slug });
  return !!doc;
};

// ── Admin project queries ─────────────────────────────────────────────────────

export const getAdminProjects = async (
  query: AdminProjectQuery,
): Promise<PaginatedResult<IProject>> => {
  const { page, limit, search, status, published, featured, projectType } = query;

  const filter: FilterQuery<IProject> = {};

  if (search) {
    filter.$or = [
      { 'title.en': { $regex: search, $options: 'i' } },
      { 'title.ar': { $regex: search, $options: 'i' } },
      { 'location.en': { $regex: search, $options: 'i' } },
      { 'location.ar': { $regex: search, $options: 'i' } },
    ];
  }

  if (status) filter.status = status;
  if (published !== undefined) filter.published = published;
  if (featured !== undefined) filter.featured = featured;
  if (projectType) filter.projectType = projectType;

  return paginate<IProject>(Project, filter, page, limit, { createdAt: -1 });
};

export const getAdminProjectById = async (id: string): Promise<IProject> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid project ID');
  }
  const project = await Project.findById(id);
  if (!project) throw new ApiError(404, 'Project not found');
  return project;
};

export const createProject = async (input: CreateProjectInput): Promise<IProject> => {
  const slug = await generateUniqueSlug(input.title.en, slugExists);

  const project = await Project.create({
    title: input.title,
    description: input.description,
    slug,
    projectType: input.projectType,
    governmentEntity: input.projectType === 'government' ? input.governmentEntity : null,
    contractors: input.projectType === 'government' ? input.contractors : [],
    location: input.location,
    completionDate: input.completionDate ?? null,
    status: input.status,
    featured: input.featured,
    published: input.published,
    coverImage: null,
    gallery: [],
  });

  return project;
};

export const updateProject = async (id: string, input: UpdateProjectInput): Promise<IProject> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid project ID');
  }

  const project = await Project.findById(id);
  if (!project) throw new ApiError(404, 'Project not found');

  // Apply partial title / description updates
  if (input.title?.ar !== undefined) project.title.ar = input.title.ar;
  if (input.title?.en !== undefined) project.title.en = input.title.en;
  if (input.description?.ar !== undefined) project.description.ar = input.description.ar;
  if (input.description?.en !== undefined) project.description.en = input.description.en;

  const nextProjectType = input.projectType ?? project.projectType;
  if (nextProjectType === 'private') {
    if (input.governmentEntity != null) {
      throw new ApiError(400, 'Private projects must not include a government entity');
    }
    if (input.contractors !== undefined && input.contractors.length > 0) {
      throw new ApiError(400, 'Private projects must not include contractors');
    }
  }

  if (input.projectType !== undefined) {
    project.projectType = input.projectType;
  }

  if (project.projectType === 'private') {
    project.governmentEntity = null;
    project.contractors = [];
  } else {
    if (input.governmentEntity !== undefined) {
      project.governmentEntity =
        input.governmentEntity === null
          ? null
          : {
              ar: input.governmentEntity.ar ?? project.governmentEntity?.ar ?? '',
              en: input.governmentEntity.en ?? project.governmentEntity?.en ?? '',
            };
    }

    if (input.contractors !== undefined) {
      project.contractors = input.contractors;
    }
  }

  // Apply partial location updates (bilingual)
  if (input.location?.ar !== undefined) project.location.ar = input.location.ar;
  if (input.location?.en !== undefined) project.location.en = input.location.en;

  // Scalar updates — only assign if the field was provided
  if (input.completionDate !== undefined) project.completionDate = input.completionDate ?? null;
  if (input.status !== undefined) project.status = input.status;
  if (input.featured !== undefined) project.featured = input.featured;
  if (input.published !== undefined) project.published = input.published;

  // Slug is intentionally preserved to keep existing public URLs stable

  await project.save();
  return project;
};

export const deleteProject = async (id: string): Promise<void> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid project ID');
  }

  // Fetch first (not findByIdAndDelete) so we can read image metadata before removal
  const project = await Project.findById(id);
  if (!project) throw new ApiError(404, 'Project not found');

  // Collect all Cloudinary publicIds associated with this project
  const publicIdsToDelete: string[] = [];
  if (project.coverImage?.publicId) publicIdsToDelete.push(project.coverImage.publicId);
  project.gallery.forEach((img) => publicIdsToDelete.push(img.publicId));

  // Delete the MongoDB document first, then clean up Cloudinary
  // This way the project is never left in an unrecoverable half-deleted state
  await project.deleteOne();

  // Cloudinary cleanup — failures are logged inside deleteImages, not thrown
  if (publicIdsToDelete.length > 0) {
    await deleteImages(publicIdsToDelete);
  }
};

// ── Public project queries ────────────────────────────────────────────────────

export const getPublicProjects = async (
  query: PublicProjectQuery,
): Promise<PaginatedResult<IProject>> => {
  const { page, limit, status, featured, projectType } = query;

  // Public API always filters by published=true
  const filter: FilterQuery<IProject> = { published: true };

  if (status) filter.status = status;
  if (featured !== undefined) filter.featured = featured;
  if (projectType) filter.projectType = projectType;

  return paginate<IProject>(Project, filter, page, limit, { createdAt: -1 });
};

export const getPublicProjectBySlug = async (slug: string): Promise<IProject> => {
  const project = await Project.findOne({ slug, published: true });
  if (!project) throw new ApiError(404, 'Project not found');
  return project;
};
