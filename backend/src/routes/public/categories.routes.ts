import { Router } from 'express';
import { listCategories } from '../../controllers/category.controller';
import { wrap } from '../../utils/asyncWrap';

const router = Router();

// No authentication required — public endpoint
// GET /api/v1/categories
router.get('/', wrap(listCategories));

export default router;
