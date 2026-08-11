import { Router } from 'express';
import authRouter from './auth.routes';
import adminProjectsRouter from './admin/projects.routes';
import adminImagesRouter from './admin/images.routes';
import publicProjectsRouter from './public/projects.routes';

const router = Router();

// Auth
router.use('/auth', authRouter);

// Admin (all routes within are protected by their own router-level middleware)
router.use('/admin/projects', adminProjectsRouter);
router.use('/admin/projects/:id', adminImagesRouter);

// Public (no authentication required)
router.use('/projects', publicProjectsRouter);

export default router;
