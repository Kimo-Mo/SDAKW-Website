import { Request, Response, NextFunction } from 'express';
import {
  getAdminProducts,
  getAdminProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getPublicProducts,
  getPublicProductBySlug,
} from '../services/product.service';
import {
  createProductSchema,
  updateProductSchema,
  adminProductQuerySchema,
  publicProductQuerySchema,
} from '../validators/product.validator';

// ── Admin handlers ─────────────────────────────────────────────────────────────

export const listAdminProducts = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const query = adminProductQuerySchema.parse(req.query);
    const { items, pagination } = await getAdminProducts(query);
    res.status(200).json({ success: true, data: { products: items, pagination } });
  } catch (err) {
    next(err);
  }
};

export const getAdminProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const product = await getAdminProductById(req.params.id);
    res.status(200).json({ success: true, data: { product } });
  } catch (err) {
    next(err);
  }
};

export const addProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const input = createProductSchema.parse(req.body);
    const product = await createProduct(input);
    res.status(201).json({ success: true, data: { product } });
  } catch (err) {
    next(err);
  }
};

export const editProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const input = updateProductSchema.parse(req.body);
    const product = await updateProduct(req.params.id, input);
    res.status(200).json({ success: true, data: { product } });
  } catch (err) {
    next(err);
  }
};

export const removeProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    await deleteProduct(req.params.id);
    res.status(200).json({ success: true, message: 'Product deleted successfully' });
  } catch (err) {
    next(err);
  }
};

// ── Public handlers ───────────────────────────────────────────────────────────

export const listPublicProducts = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const query = publicProductQuerySchema.parse(req.query);
    const { items, pagination } = await getPublicProducts(query);
    res.status(200).json({ success: true, data: { products: items, pagination } });
  } catch (err) {
    next(err);
  }
};

export const getPublicProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> => {
  try {
    const product = await getPublicProductBySlug(req.params.slug);
    res.status(200).json({ success: true, data: { product } });
  } catch (err) {
    next(err);
  }
};
