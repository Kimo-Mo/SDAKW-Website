import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Project, { IProject } from '../models/Project';
import { ApiError } from '../utils/ApiError';
import { uploadCoverImage, uploadGalleryImages, deleteImage } from '../services/cloudinary.service';

// ── Shared guard ──────────────────────────────────────────────────────────────

const resolveProject = async (id: string): Promise<IProject> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid project ID');
  }
  const project = await Project.findById(id);
  if (!project) throw new ApiError(404, 'Project not found');
  return project;
};

// ── POST /api/v1/admin/projects/:id/cover-image ───────────────────────────────

export const setCoverImage = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.file) {
      throw new ApiError(400, 'An image file is required');
    }

    const project = await resolveProject(req.params.id);
    const oldPublicId = project.coverImage?.publicId ?? null;

    // Upload new image first — do not touch DB or delete old until this succeeds
    const newImage = await uploadCoverImage(String(project._id), req.file.buffer);

    project.coverImage = newImage;
    await project.save();

    // Only delete the old image after the DB update succeeds
    if (oldPublicId) {
      await deleteImage(oldPublicId);
    }

    res.status(200).json({ success: true, data: { coverImage: project.coverImage } });
  } catch (err) {
    next(err);
  }
};

// ── DELETE /api/v1/admin/projects/:id/cover-image ─────────────────────────────

export const removeCoverImage = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const project = await resolveProject(req.params.id);

    if (!project.coverImage) {
      throw new ApiError(404, 'This project does not have a cover image');
    }

    const { publicId } = project.coverImage;

    project.coverImage = null;
    await project.save();

    // Delete from Cloudinary after DB is updated
    await deleteImage(publicId);

    res.status(200).json({ success: true, message: 'Cover image removed successfully' });
  } catch (err) {
    next(err);
  }
};

// ── POST /api/v1/admin/projects/:id/gallery ───────────────────────────────────

export const addGalleryImages = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const files = req.files as Express.Multer.File[] | undefined;
    if (!files || files.length === 0) {
      throw new ApiError(400, 'At least one image file is required');
    }

    const project = await resolveProject(req.params.id);

    // Upload all images concurrently
    let newImages;
    try {
      newImages = await uploadGalleryImages(
        String(project._id),
        files.map((f) => f.buffer),
      );
    } catch (uploadErr) {
      // If uploads partially succeeded, cleanup is handled inside uploadGalleryImages
      // via Promise.allSettled — reject means none were persisted to DB
      throw new ApiError(500, 'Image upload failed. No images were saved.');
    }

    project.gallery.push(...newImages);
    await project.save();

    res.status(200).json({ success: true, data: { gallery: project.gallery } });
  } catch (err) {
    next(err);
  }
};

// ── DELETE /api/v1/admin/projects/:id/gallery/:publicId ──────────────────────

export const removeGalleryImage = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const project = await resolveProject(req.params.id);

    // publicId may contain slashes (e.g. projects/id/gallery/xyz) — decode it
    const publicId = decodeURIComponent(req.params.publicId);

    const imageIndex = project.gallery.findIndex((img) => img.publicId === publicId);
    if (imageIndex === -1) {
      throw new ApiError(404, 'Image not found in this project gallery');
    }

    // Remove from DB first, then delete from Cloudinary
    project.gallery.splice(imageIndex, 1);
    await project.save();

    await deleteImage(publicId);

    res.status(200).json({ success: true, message: 'Gallery image removed successfully' });
  } catch (err) {
    next(err);
  }
};
