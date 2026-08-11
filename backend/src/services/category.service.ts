import mongoose from 'mongoose';
import Category, { ICategory } from '../models/Category';
import Project from '../models/Project';
import { ApiError } from '../utils/ApiError';
import { generateUniqueSlug } from '../utils/slug';
import { CreateCategoryInput, UpdateCategoryInput } from '../validators/category.validator';

const slugExists = async (slug: string): Promise<boolean> => {
  const doc = await Category.exists({ slug });
  return !!doc;
};

export const getAllCategories = async (): Promise<ICategory[]> => {
  return Category.find().sort({ 'name.en': 1 });
};

export const getCategoryById = async (id: string): Promise<ICategory> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid category ID');
  }
  const category = await Category.findById(id);
  if (!category) throw new ApiError(404, 'Category not found');
  return category;
};

export const createCategory = async (input: CreateCategoryInput): Promise<ICategory> => {
  const slug = await generateUniqueSlug(input.name.en, slugExists);

  const category = await Category.create({
    name: input.name,
    slug,
  });

  return category;
};

export const updateCategory = async (
  id: string,
  input: UpdateCategoryInput,
): Promise<ICategory> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid category ID');
  }

  const category = await Category.findById(id);
  if (!category) throw new ApiError(404, 'Category not found');

  // Merge name fields selectively
  if (input.name?.ar !== undefined) category.name.ar = input.name.ar;
  if (input.name?.en !== undefined) category.name.en = input.name.en;

  // Slug is intentionally NOT changed on update to keep URLs stable

  await category.save();
  return category;
};

export const deleteCategory = async (id: string): Promise<void> => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new ApiError(400, 'Invalid category ID');
  }

  const category = await Category.findById(id);
  if (!category) throw new ApiError(404, 'Category not found');

  // Prevent deletion if projects reference this category
  const projectCount = await Project.countDocuments({ category: id });
  if (projectCount > 0) {
    throw new ApiError(
      409,
      'Cannot delete this category because it is currently used by one or more projects.',
    );
  }

  await Category.findByIdAndDelete(id);
};
