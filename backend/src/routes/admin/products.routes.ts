import { Router } from 'express';
import {
  listAdminProducts,
  getAdminProduct,
  addProduct,
  editProduct,
  removeProduct,
} from '../../controllers/product.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { wrap } from '../../utils/asyncWrap';

const router = Router();

// All admin product routes require authentication
router.use(authenticate);

// GET /api/v1/admin/products (list all products for admin)
router.get('/', wrap(listAdminProducts));

// GET /api/v1/admin/products/:id (get a specific product by ID)
router.get('/:id', wrap(getAdminProduct));

// POST /api/v1/admin/products (create a new product)
router.post('/', wrap(addProduct));

// PATCH /api/v1/admin/products/:id (update a product by ID)
router.patch('/:id', wrap(editProduct));

// DELETE /api/v1/admin/products/:id (delete a product by ID)
router.delete('/:id', wrap(removeProduct));

export default router;
