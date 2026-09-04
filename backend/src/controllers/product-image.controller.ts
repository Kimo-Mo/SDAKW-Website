import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import Product, { IProduct } from '../models/Product';
import { ApiError } from '../utils/ApiError';
import { uploadCoverImage, uploadGalleryImages, deleteImage } from '../services/cloudinary.service';

// Maximum number of gallery images allowed per product
const MAX_GALLERY_IMAGES = 10;

// ── Shared guard ──────────────────────────────────────────────────────────────

const resolveProduct = async (id: string): Promise<IProduct> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid product ID');
  }
  const product = await Product.findById(id);
  if (!product) throw new ApiError(404, 'Product not found');
  return product;
};

// ── POST /api/v1/admin/products/:id/cover-image ───────────────────────────────

export const setCoverImage = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    if (!req.file) {
      throw new ApiError(400, 'An image file is required');
    }

    const product = await resolveProduct(req.params.id);
    const oldPublicId = product.coverImage?.publicId ?? null;

    // Upload new image first — do not touch DB or delete old until this succeeds
    const newImage = await uploadCoverImage('products', String(product._id), req.file.buffer);

    product.coverImage = newImage;
    await product.save();

    // Only delete the old image after the DB update succeeds
    if (oldPublicId) {
      await deleteImage(oldPublicId);
    }

    res.status(200).json({ success: true, data: { coverImage: product.coverImage } });
  } catch (err) {
    next(err);
  }
};

// ── DELETE /api/v1/admin/products/:id/cover-image ─────────────────────────────

export const removeCoverImage = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const product = await resolveProduct(req.params.id);

    if (!product.coverImage) {
      throw new ApiError(404, 'This product does not have a cover image');
    }

    const { publicId } = product.coverImage;

    product.coverImage = null;
    await product.save();

    // Delete from Cloudinary after DB is updated
    await deleteImage(publicId);

    res.status(200).json({ success: true, message: 'Cover image removed successfully' });
  } catch (err) {
    next(err);
  }
};

// ── POST /api/v1/admin/products/:id/gallery ───────────────────────────────────

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

    const product = await resolveProduct(req.params.id);

    // Enforce max gallery images cap
    const currentCount = product.gallery.length;
    const incomingCount = files.length;
    if (currentCount + incomingCount > MAX_GALLERY_IMAGES) {
      throw new ApiError(
        400,
        `Gallery limit exceeded. This product already has ${currentCount} image(s). ` +
          `You are trying to add ${incomingCount}, but the maximum is ${MAX_GALLERY_IMAGES}.`,
      );
    }

    // Upload all images concurrently
    let newImages;
    try {
      newImages = await uploadGalleryImages(
        'products',
        String(product._id),
        files.map((f) => f.buffer),
      );
    } catch (uploadErr) {
      // If uploads partially succeeded, cleanup is handled inside uploadGalleryImages
      // via Promise.allSettled — reject means none were persisted to DB
      throw new ApiError(500, 'Image upload failed. No images were saved.');
    }

    product.gallery.push(...newImages);
    await product.save();

    res.status(200).json({ success: true, data: { gallery: product.gallery } });
  } catch (err) {
    next(err);
  }
};

// ── DELETE /api/v1/admin/products/:id/gallery/:publicId ──────────────────────

export const removeGalleryImage = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const product = await resolveProduct(req.params.id);

    // publicId may contain slashes (e.g. products/id/gallery/xyz) — decode it
    const publicId = decodeURIComponent(req.params.publicId);

    const imageIndex = product.gallery.findIndex((img) => img.publicId === publicId);
    if (imageIndex === -1) {
      throw new ApiError(404, 'Image not found in this product gallery');
    }

    // Remove from DB first, then delete from Cloudinary
    product.gallery.splice(imageIndex, 1);
    await product.save();

    await deleteImage(publicId);

    res.status(200).json({ success: true, message: 'Gallery image removed successfully' });
  } catch (err) {
    next(err);
  }
};
