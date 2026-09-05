import { apiClient } from '@/lib/api/client';
import type {
  AdminImageDeleteApiResponse,
  AdminImageUploadApiResponse,
  AdminProductDeleteApiResponse,
  AdminProductsApiResponse,
  AdminProductsQueryParams,
  AdminSingleProductApiResponse,
  BackendImage,
  BackendProduct,
  CreateProductPayload,
  UpdateProductPayload,
} from '@/types/admin';

/**
 * Extracts a normalized BackendProduct from various possible API response shapes
 * ({ success: true, data: { product: ... } } or { success: true, data: { ... } }).
 * Guarantees _id is strictly populated and non-empty.
 */
function extractProductData(data: unknown): BackendProduct {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid product response format from server.');
  }

  const raw = data as Record<string, unknown>;
  const productObj = (raw.product && typeof raw.product === 'object' ? raw.product : raw) as Record<
    string,
    unknown
  >;

  const id = (productObj._id || productObj.id) as string | undefined;
  if (!id || typeof id !== 'string' || id.trim().length === 0) {
    throw new Error('Product ID was not returned by the server.');
  }

  return {
    ...productObj,
    _id: id,
    color: productObj.color || { ar: [], en: [] },
    origin: productObj.origin || { ar: [], en: [] },
    uses: productObj.uses || { ar: [], en: [] },
    surface: productObj.surface || { ar: [], en: [] },
    dimensions: Array.isArray(productObj.dimensions) ? productObj.dimensions : [],
  } as BackendProduct;
}

/**
 * Queries the admin products list with filtering, search, and server-side pagination.
 * Endpoint: `GET /api/v1/admin/products`
 */
export async function getAdminProducts(
  params: AdminProductsQueryParams = {}
): Promise<AdminProductsApiResponse['data']> {
  const cleanParams: Record<string, string | number | boolean> = {};

  if (typeof params.page === 'number') cleanParams.page = params.page;
  if (typeof params.limit === 'number') cleanParams.limit = params.limit;
  if (params.search && params.search.trim().length > 0) {
    cleanParams.search = params.search.trim();
  }
  if (params.category) cleanParams.category = params.category;
  if (typeof params.published === 'boolean') cleanParams.published = params.published;

  const response = await apiClient.get<AdminProductsApiResponse>('/admin/products', {
    params: cleanParams,
  });

  return {
    products: response.data?.data?.products ?? [],
    pagination: response.data?.data?.pagination ?? {
      page: params.page ?? 1,
      limit: params.limit ?? 10,
      total: 0,
      totalPages: 1,
    },
  };
}

/**
 * Retrieves a single product's complete details by ID for editing.
 * Endpoint: `GET /api/v1/admin/products/:id`
 */
export async function getAdminProductById(id: string): Promise<BackendProduct> {
  if (!id || id === 'undefined') {
    throw new Error('Cannot fetch product: product ID is invalid.');
  }

  const response = await apiClient.get<AdminSingleProductApiResponse>(`/admin/products/${id}`);
  const payloadData = response.data?.data ?? response.data;
  return extractProductData(payloadData);
}

/**
 * Creates a new base product document.
 * Endpoint: `POST /api/v1/admin/products`
 */
export async function createAdminProduct(payload: CreateProductPayload): Promise<BackendProduct> {
  const response = await apiClient.post<AdminSingleProductApiResponse>('/admin/products', payload);
  const payloadData = response.data?.data ?? response.data;
  return extractProductData(payloadData);
}

/**
 * Updates an existing product record.
 * Endpoint: `PATCH /api/v1/admin/products/:id`
 */
export async function updateAdminProduct(
  id: string,
  payload: UpdateProductPayload
): Promise<BackendProduct> {
  if (!id || id === 'undefined') {
    throw new Error('Cannot update product: product ID is invalid.');
  }

  const response = await apiClient.patch<AdminSingleProductApiResponse>(
    `/admin/products/${id}`,
    payload
  );
  const payloadData = response.data?.data ?? response.data;
  return extractProductData(payloadData);
}

/**
 * Uploads or replaces a product's cover image.
 * Endpoint: `POST /api/v1/admin/products/:id/cover-image`
 */
export async function uploadProductCoverImage(id: string, file: File): Promise<BackendImage> {
  if (!id || id === 'undefined') {
    throw new Error('Cannot upload cover image: product ID is invalid.');
  }

  const formData = new FormData();
  formData.append('coverImage', file);

  const response = await apiClient.post<AdminImageUploadApiResponse>(
    `/admin/products/${id}/cover-image`,
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
    }
  );

  const data = response.data?.data ?? response.data;
  const imageObj = (data && typeof data === 'object' && 'coverImage' in data
    ? (data as Record<string, unknown>).coverImage
    : data) as BackendImage;
  return imageObj;
}

/**
 * Removes a product's cover image.
 * Endpoint: `DELETE /api/v1/admin/products/:id/cover-image`
 */
export async function deleteProductCoverImage(id: string): Promise<AdminImageDeleteApiResponse> {
  if (!id || id === 'undefined') {
    throw new Error('Cannot delete cover image: product ID is invalid.');
  }

  const response = await apiClient.delete<AdminImageDeleteApiResponse>(
    `/admin/products/${id}/cover-image`
  );
  return response.data;
}

/**
 * Appends new gallery images to an existing product.
 * Endpoint: `POST /api/v1/admin/products/:id/gallery`
 */
export async function uploadProductGalleryImages(
  id: string,
  files: File[]
): Promise<BackendImage[]> {
  if (!id || id === 'undefined') {
    throw new Error('Cannot upload gallery images: product ID is invalid.');
  }

  const formData = new FormData();
  files.forEach((file) => {
    formData.append('gallery', file);
  });

  const response = await apiClient.post<AdminImageUploadApiResponse>(
    `/admin/products/${id}/gallery`,
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
    }
  );

  const data = response.data?.data ?? response.data;
  const galleryList =
    data && typeof data === 'object' && 'gallery' in data
      ? (data as Record<string, unknown>).gallery
      : data;
  return (Array.isArray(galleryList) ? galleryList : [galleryList]) as BackendImage[];
}

/**
 * Removes an individual gallery image from a product by Cloudinary publicId.
 * Endpoint: `DELETE /api/v1/admin/products/:id/gallery/:publicId`
 */
export async function deleteProductGalleryImage(
  id: string,
  publicId: string
): Promise<AdminImageDeleteApiResponse> {
  if (!id || id === 'undefined') {
    throw new Error('Cannot delete gallery image: product ID is invalid.');
  }

  const response = await apiClient.delete<AdminImageDeleteApiResponse>(
    `/admin/products/${id}/gallery/${encodeURIComponent(publicId)}`
  );
  return response.data;
}

/**
 * Deletes a product record and cleans up associated Cloudinary media.
 * Endpoint: `DELETE /api/v1/admin/products/:id`
 */
export async function deleteAdminProduct(id: string): Promise<AdminProductDeleteApiResponse> {
  if (!id || id === 'undefined') {
    throw new Error('Cannot delete product: product ID is invalid.');
  }

  const response = await apiClient.delete<AdminProductDeleteApiResponse>(`/admin/products/${id}`);
  return response.data;
}
