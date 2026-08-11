import { Router } from 'express';
import authRouter from './auth.routes';
import adminProjectsRouter from './admin/projects.routes';
import adminCategoriesRouter from './admin/categories.routes';
import adminImagesRouter from './admin/images.routes';
import publicProjectsRouter from './public/projects.routes';
import publicCategoriesRouter from './public/categories.routes';

const router = Router();

// Auth
router.use('/auth', authRouter);

// Admin (all routes within are protected by their own router-level middleware)
router.use('/admin/projects', adminProjectsRouter);
router.use('/admin/projects/:id', adminImagesRouter);
router.use('/admin/categories', adminCategoriesRouter);

// Public (no authentication required)
router.use('/projects', publicProjectsRouter);
router.use('/categories', publicCategoriesRouter);

export default router;
