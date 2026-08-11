import { Router } from 'express';
import { listPublicProjects, getPublicProject } from '../../controllers/project.controller';
import { wrap } from '../../utils/asyncWrap';

const router = Router();

// No authentication required — public endpoints
// GET /api/v1/projects
router.get('/', wrap(listPublicProjects));
// GET /api/v1/projects/:slug
router.get('/:slug', wrap(getPublicProject));

export default router;
