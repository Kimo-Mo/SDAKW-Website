import { Request, Response, NextFunction } from 'express';
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../services/category.service';
import { createCategorySchema, updateCategorySchema } from '../validators/category.validator';

export const listCategories = async (
  _req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const categories = await getAllCategories();
    res.status(200).json({ success: true, data: { categories } });
  } catch (err) {
    next(err);
  }
};

export const getCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const category = await getCategoryById(req.params.id);
    res.status(200).json({ success: true, data: { category } });
  } catch (err) {
    next(err);
  }
};

export const addCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const input = createCategorySchema.parse(req.body);
    const category = await createCategory(input);
    res.status(201).json({ success: true, data: { category } });
  } catch (err) {
    next(err);
  }
};

export const editCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const input = updateCategorySchema.parse(req.body);
    const category = await updateCategory(req.params.id, input);
    res.status(200).json({ success: true, data: { category } });
  } catch (err) {
    next(err);
  }
};

export const removeCategory = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    await deleteCategory(req.params.id);
    res.status(200).json({ success: true, message: 'Category deleted successfully' });
  } catch (err) {
    next(err);
  }
};
