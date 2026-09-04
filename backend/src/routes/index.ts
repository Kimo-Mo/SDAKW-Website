import { Router } from 'express';
import authRouter from './auth.routes';
import adminProjectsRouter from './admin/projects.routes';
import adminImagesRouter from './admin/images.routes';
import adminProductsRouter from './admin/products.routes';
import adminProductImagesRouter from './admin/product-images.routes';
import publicProjectsRouter from './public/projects.routes';
import publicProductsRouter from './public/products.routes';

const router = Router();

// Auth
router.use('/auth', authRouter);

// Admin (all routes within are protected by their own router-level middleware)
router.use('/admin/projects', adminProjectsRouter);
router.use('/admin/projects/:id', adminImagesRouter);
router.use('/admin/products', adminProductsRouter);
router.use('/admin/products/:id', adminProductImagesRouter);

// Public (no authentication required)
router.use('/projects', publicProjectsRouter);
router.use('/products', publicProductsRouter);

export default router;
