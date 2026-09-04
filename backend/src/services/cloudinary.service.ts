import { UploadApiResponse } from 'cloudinary';
import { cloudinary } from '../config/cloudinary';
import { IImageMeta } from '../models/Project';

// ── Folder helpers ────────────────────────────────────────────────────────────

const coverFolder = (resourceType: string, resourceId: string): string =>
  `${resourceType}/${resourceId}/cover`;
const galleryFolder = (resourceType: string, resourceId: string): string =>
  `${resourceType}/${resourceId}/gallery`;

// ── Upload ────────────────────────────────────────────────────────────────────

/**
 * Uploads a raw image buffer to Cloudinary.
 *
 * Uses upload_stream so images go directly to Cloudinary from memory
 * without touching the server filesystem.
 *
 * Transformations applied at upload time:
 *   - quality: auto   — Cloudinary picks the optimal quality level
 *   - fetch_format: auto — serves WebP/AVIF to supporting browsers
 */
const uploadBuffer = (buffer: Buffer, folder: string): Promise<UploadApiResponse> =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: 'image',
        quality: 'auto',
        fetch_format: 'auto',
      },
      (error, result) => {
        if (error || !result) return reject(error ?? new Error('Cloudinary upload failed'));
        resolve(result);
      },
    );
    stream.end(buffer);
  });

/**
 * Uploads an image buffer as a cover image for any resource (project, product, etc.).
 * Returns the stored { url, publicId } metadata.
 *
 * @param resourceType - Cloudinary folder prefix (e.g. 'projects', 'products')
 * @param resourceId   - The document's MongoDB _id
 * @param buffer       - Raw image binary
 */
export const uploadCoverImage = async (
  resourceType: string,
  resourceId: string,
  buffer: Buffer,
): Promise<IImageMeta> => {
  const result = await uploadBuffer(buffer, coverFolder(resourceType, resourceId));
  return { url: result.secure_url, publicId: result.public_id };
};

/**
 * Uploads multiple image buffers as gallery images for any resource.
 * All uploads run concurrently.
 * Returns metadata for each uploaded image.
 *
 * @param resourceType - Cloudinary folder prefix (e.g. 'projects', 'products')
 * @param resourceId   - The document's MongoDB _id
 * @param buffers      - Array of raw image binaries
 */
export const uploadGalleryImages = async (
  resourceType: string,
  resourceId: string,
  buffers: Buffer[],
): Promise<IImageMeta[]> => {
  const results = await Promise.all(
    buffers.map((buf) => uploadBuffer(buf, galleryFolder(resourceType, resourceId))),
  );
  return results.map((r) => ({ url: r.secure_url, publicId: r.public_id }));
};

// ── Delete ────────────────────────────────────────────────────────────────────

/**
 * Deletes a single image from Cloudinary by its publicId.
 * Logs a warning if the deletion fails but does not throw,
 * so a Cloudinary hiccup cannot block database operations.
 */
export const deleteImage = async (publicId: string): Promise<void> => {
  try {
    await cloudinary.uploader.destroy(publicId, { resource_type: 'image' });
  } catch (err) {
    console.warn(`[Cloudinary] Failed to delete image "${publicId}":`, err);
  }
};

/**
 * Deletes multiple images concurrently.
 * Individual failures are logged and swallowed to allow partial cleanup.
 */
export const deleteImages = async (publicIds: string[]): Promise<void> => {
  if (publicIds.length === 0) return;
  await Promise.allSettled(publicIds.map(deleteImage));
};
