import { v2 as cloudinary } from 'cloudinary';
import { env } from './env';

/**
 * Configures the Cloudinary SDK once at startup using environment variables.
 * Import this module in server.ts (or app.ts) before any upload is attempted.
 */
cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
  secure: true, // always return https:// URLs
});

export { cloudinary };
