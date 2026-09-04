import { apiClient } from '@/lib/api/client';
import type {
  PublicProduct,
  PublicProductsApiResponse,
  PublicProductsQueryParams,
  PublicSingleProductApiResponse,
} from '@/types/public';

/**
 * Standardized TanStack Query cache configuration for public-facing data
 */
export const PUBLIC_PRODUCT_QUERY_CONFIG = {
  staleTime: 5 * 60 * 1000, // 5 minutes
  gcTime: 15 * 60 * 1000, // 15 minutes
  refetchOnWindowFocus: false,
  refetchOnReconnect: true,
  retry: 2,
} as const;

/**
 * Queries published products from the public backend endpoint.
 * Supports filtering by category and server-side pagination.
 * Endpoint: `GET /api/v1/products`
 */
export async function getPublicProducts(
  params: PublicProductsQueryParams = {}
): Promise<PublicProductsApiResponse['data']> {
  const cleanParams: Record<string, string | number | boolean> = {};

  if (typeof params.page === 'number') {
    cleanParams.page = params.page;
  }
  if (typeof params.limit === 'number') {
    cleanParams.limit = params.limit;
  }
  if (params.category) {
    cleanParams.category = params.category;
  }

  const response = await apiClient.get<PublicProductsApiResponse>('/products', {
    params: cleanParams,
  });

  return response.data.data;
}

/**
 * Fetches a single published product by its URL slug.
 * Endpoint: `GET /api/v1/products/:slug`
 */
export async function getPublicProductBySlug(slug: string): Promise<PublicProduct> {
  if (!slug || slug.trim().length === 0) {
    throw new Error('Product slug must be provided.');
  }

  const response = await apiClient.get<PublicSingleProductApiResponse>(
    `/products/${encodeURIComponent(slug.trim())}`
  );

  return response.data.data.product;
}
