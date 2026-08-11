import { Router } from 'express';
import {
  listAdminProjects,
  getAdminProject,
  addProject,
  editProject,
  removeProject,
} from '../../controllers/project.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { wrap } from '../../utils/asyncWrap';

const router = Router();

// All admin project routes require authentication
router.use(authenticate);

// GET /api/v1/admin/projects (list all projects for admin)
router.get('/', wrap(listAdminProjects));

// GET /api/v1/admin/projects/:id (get a specific project by ID)
router.get('/:id', wrap(getAdminProject));

// POST /api/v1/admin/projects (create a new project)
router.post('/', wrap(addProject));

// PATCH /api/v1/admin/projects/:id (update a project by ID)
router.patch('/:id', wrap(editProject));

// DELETE /api/v1/admin/projects/:id (delete a project by ID)
router.delete('/:id', wrap(removeProject));

export default router;
