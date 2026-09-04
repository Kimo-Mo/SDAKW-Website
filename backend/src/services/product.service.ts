import mongoose, { FilterQuery } from 'mongoose';
import Product, { IProduct } from '../models/Product';
import { ApiError } from '../utils/ApiError';
import { generateUniqueSlug } from '../utils/slug';
import { deleteImages } from './cloudinary.service';
import {
  CreateProductInput,
  UpdateProductInput,
  AdminProductQuery,
  PublicProductQuery,
} from '../validators/product.validator';

// ── Pagination helper ─────────────────────────────────────────────────────────

export interface PaginatedResult<T> {
  items: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

const paginate = async <T>(
  model: mongoose.Model<T>,
  filter: FilterQuery<T>,
  page: number,
  limit: number,
  sort: Record<string, 1 | -1> = { createdAt: -1 },
): Promise<PaginatedResult<T>> => {
  const skip = (page - 1) * limit;
  const [items, total] = await Promise.all([
    model.find(filter).sort(sort).skip(skip).limit(limit),
    model.countDocuments(filter),
  ]);

  return {
    items: items as T[],
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

// ── Slug ──────────────────────────────────────────────────────────────────────

const slugExists = async (slug: string): Promise<boolean> => {
  const doc = await Product.exists({ slug });
  return !!doc;
};

// ── Admin product queries ─────────────────────────────────────────────────────

export const getAdminProducts = async (
  query: AdminProductQuery,
): Promise<PaginatedResult<IProduct>> => {
  const { page, limit, search, category, published } = query;

  const filter: FilterQuery<IProduct> = {};

  if (search) {
    filter.$or = [
      { 'name.en': { $regex: search, $options: 'i' } },
      { 'name.ar': { $regex: search, $options: 'i' } },
    ];
  }

  if (category) filter.category = category;
  if (published !== undefined) filter.published = published;

  return paginate<IProduct>(Product, filter, page, limit, { createdAt: -1 });
};

export const getAdminProductById = async (id: string): Promise<IProduct> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid product ID');
  }
  const product = await Product.findById(id);
  if (!product) throw new ApiError(404, 'Product not found');
  return product;
};

export const createProduct = async (input: CreateProductInput): Promise<IProduct> => {
  const slug = await generateUniqueSlug(input.name.en, slugExists);

  const product = await Product.create({
    name: input.name,
    category: input.category,
    material: input.material,
    color: input.color,
    origin: input.origin,
    uses: input.uses,
    surface: input.surface,
    slug,
    published: input.published,
    coverImage: null,
    gallery: [],
  });

  return product;
};

export const updateProduct = async (id: string, input: UpdateProductInput): Promise<IProduct> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid product ID');
  }

  const product = await Product.findById(id);
  if (!product) throw new ApiError(404, 'Product not found');

  // Apply partial name updates (bilingual)
  if (input.name?.ar !== undefined) product.name.ar = input.name.ar;
  if (input.name?.en !== undefined) product.name.en = input.name.en;

  // Apply partial material updates (bilingual)
  if (input.material?.ar !== undefined) product.material.ar = input.material.ar;
  if (input.material?.en !== undefined) product.material.en = input.material.en;

  // Scalar updates
  if (input.category !== undefined) product.category = input.category;
  if (input.published !== undefined) product.published = input.published;

  // Bilingual array fields — replace entire arrays when provided
  if (input.color !== undefined) product.color = input.color;
  if (input.origin !== undefined) product.origin = input.origin;
  if (input.uses !== undefined) product.uses = input.uses;
  if (input.surface !== undefined) product.surface = input.surface;

  // Slug is intentionally preserved to keep existing public URLs stable

  await product.save();
  return product;
};

export const deleteProduct = async (id: string): Promise<void> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid product ID');
  }

  // Fetch first (not findByIdAndDelete) so we can read image metadata before removal
  const product = await Product.findById(id);
  if (!product) throw new ApiError(404, 'Product not found');

  // Collect all Cloudinary publicIds associated with this product
  const publicIdsToDelete: string[] = [];
  if (product.coverImage?.publicId) publicIdsToDelete.push(product.coverImage.publicId);
  product.gallery.forEach((img) => publicIdsToDelete.push(img.publicId));

  // Delete the MongoDB document first, then clean up Cloudinary
  // This way the product is never left in an unrecoverable half-deleted state
  await product.deleteOne();

  // Cloudinary cleanup — failures are logged inside deleteImages, not thrown
  if (publicIdsToDelete.length > 0) {
    await deleteImages(publicIdsToDelete);
  }
};

// ── Public product queries ────────────────────────────────────────────────────

export const getPublicProducts = async (
  query: PublicProductQuery,
): Promise<PaginatedResult<IProduct>> => {
  const { page, limit, category } = query;

  // Public API always filters by published=true
  const filter: FilterQuery<IProduct> = { published: true };

  if (category) filter.category = category;

  return paginate<IProduct>(Product, filter, page, limit, { createdAt: -1 });
};

export const getPublicProductBySlug = async (slug: string): Promise<IProduct> => {
  const product = await Product.findOne({ slug, published: true });
  if (!product) throw new ApiError(404, 'Product not found');
  return product;
};
