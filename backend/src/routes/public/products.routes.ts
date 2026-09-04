import { Router } from 'express';
import { listPublicProducts, getPublicProduct } from '../../controllers/product.controller';
import { wrap } from '../../utils/asyncWrap';

const router = Router();

// No authentication required — public endpoints
// GET /api/v1/products
router.get('/', wrap(listPublicProducts));
// GET /api/v1/products/:slug
router.get('/:slug', wrap(getPublicProduct));

export default router;
