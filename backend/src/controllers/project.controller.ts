import { Request, Response, NextFunction } from 'express';
import {
  getAdminProjects,
  getAdminProjectById,
  getProjectSummary,
  createProject,
  updateProject,
  deleteProject,
  getPublicProjects,
  getPublicProjectBySlug,
} from '../services/project.service';
import {
  createProjectSchema,
  updateProjectSchema,
  adminProjectQuerySchema,
  publicProjectQuerySchema,
} from '../validators/project.validator';

/**
 * Formats a Date object as "YYYY-MM-DD" using UTC parts.
 *
 * Using UTC avoids the situation where a date stored as 2026-12-07T00:00:00Z
 * becomes 2026-12-06 when toISOString() is sliced after local timezone
 * conversion on servers behind UTC.
 */

// ── Admin handlers ─────────────────────────────────────────────────────────────

export const getAdminProjectSummary = async (
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const summary = await getProjectSummary();
    res.status(200).json({ success: true, data: summary });
  } catch (err) {
    next(err);
  }
};

export const listAdminProjects = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const query = adminProjectQuerySchema.parse(req.query);
    const { items, pagination } = await getAdminProjects(query);
    res.status(200).json({ success: true, data: { projects: items, pagination } });
  } catch (err) {
    next(err);
  }
};

export const getAdminProject = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const project = await getAdminProjectById(req.params.id);
    res.status(200).json({ success: true, data: { project } });
  } catch (err) {
    next(err);
  }
};

export const addProject = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const input = createProjectSchema.parse(req.body);
    const project = await createProject(input);
    res.status(201).json({ success: true, data: { project } });
  } catch (err) {
    next(err);
  }
};

export const editProject = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const input = updateProjectSchema.parse(req.body);
    const project = await updateProject(req.params.id, input);
    res.status(200).json({ success: true, data: { project } });
  } catch (err) {
    next(err);
  }
};

export const removeProject = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    await deleteProject(req.params.id);
    res.status(200).json({ success: true, message: 'Project deleted successfully' });
  } catch (err) {
    next(err);
  }
};

// ── Public handlers ───────────────────────────────────────────────────────────

export const listPublicProjects = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const query = publicProjectQuerySchema.parse(req.query);
    const { items, pagination } = await getPublicProjects(query);
    res.status(200).json({ success: true, data: { projects: items, pagination } });
  } catch (err) {
    next(err);
  }
};

export const getPublicProject = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const project = await getPublicProjectBySlug(req.params.slug);
    res.status(200).json({ success: true, data: { project } });
  } catch (err) {
    next(err);
  }
};
