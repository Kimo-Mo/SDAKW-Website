import { Router } from 'express';
import { authenticate } from '../../middleware/auth.middleware';
import { uploadCover, uploadGallery } from '../../middleware/upload.middleware';
import { wrap } from '../../utils/asyncWrap';
import {
  setCoverImage,
  removeCoverImage,
  addGalleryImages,
  removeGalleryImage,
} from '../../controllers/image.controller';

const router = Router({ mergeParams: true });

// All image routes require authentication
router.use(authenticate);

// POST   /api/v1/admin/projects/:id/cover-image
// DELETE /api/v1/admin/projects/:id/cover-image
router.route('/cover-image').post(uploadCover, wrap(setCoverImage)).delete(wrap(removeCoverImage));

// POST   /api/v1/admin/projects/:id/gallery
router.post('/gallery', uploadGallery, wrap(addGalleryImages));

// DELETE /api/v1/admin/projects/:id/gallery/:publicId
// :publicId is URL-encoded because it may contain slashes
router.delete('/gallery/:publicId(*)', wrap(removeGalleryImage));

export default router;
