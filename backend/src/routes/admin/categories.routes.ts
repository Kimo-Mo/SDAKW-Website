import { Router } from 'express';
import {
  listCategories,
  getCategory,
  addCategory,
  editCategory,
  removeCategory,
} from '../../controllers/category.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { wrap } from '../../utils/asyncWrap';

const router = Router();

// All admin category routes require authentication
router.use(authenticate);

// GET /api/v1/admin/categories
router.get('/', wrap(listCategories));

// GET /api/v1/admin/categories/:id
router.get('/:id', wrap(getCategory));

// POST /api/v1/admin/categories
router.post('/', wrap(addCategory));

// PATCH /api/v1/admin/categories/:id
router.patch('/:id', wrap(editCategory));

// DELETE /api/v1/admin/categories/:id
router.delete('/:id', wrap(removeCategory));

export default router;
