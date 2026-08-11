import multer, { FileFilterCallback } from 'multer';
import { Request } from 'express';
import { ApiError } from '../utils/ApiError';

// ── Constants ─────────────────────────────────────────────────────────────────

/** Maximum single file size: 10 MB */
const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024;

/** Maximum number of gallery images per upload request */
const MAX_GALLERY_FILES = 10;

/** Accepted MIME types */
const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/jpg', 'image/png', 'image/webp']);

// ── File filter ───────────────────────────────────────────────────────────────

const imageFilter = (_req: Request, file: Express.Multer.File, cb: FileFilterCallback): void => {
  if (ALLOWED_MIME_TYPES.has(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new ApiError(
        400,
        `Unsupported file type "${file.mimetype}". Accepted: JPEG, PNG, WebP`,
      ) as unknown as null,
      false,
    );
  }
};

// ── Multer instances ──────────────────────────────────────────────────────────

/**
 * Stores files in memory (Buffer) — no temp files written to disk.
 * The buffer is passed directly to Cloudinary's upload_stream.
 */
const storage = multer.memoryStorage();

/**
 * Single cover image upload.
 * Field name: "coverImage"
 */
export const uploadCover = multer({
  storage,
  fileFilter: imageFilter,
  limits: { fileSize: MAX_FILE_SIZE_BYTES },
}).single('coverImage');

/**
 * Multiple gallery images upload.
 * Field name: "gallery" — up to MAX_GALLERY_FILES files per request.
 */
export const uploadGallery = multer({
  storage,
  fileFilter: imageFilter,
  limits: { fileSize: MAX_FILE_SIZE_BYTES, files: MAX_GALLERY_FILES },
}).array('gallery', MAX_GALLERY_FILES);
