import { apiClient } from '@/lib/api/client';
import type {
  PublicProject,
  PublicProjectsApiResponse,
  PublicProjectsQueryParams,
  PublicSingleProjectApiResponse,
} from '@/types/public';

/**
 * Standardized TanStack Query cache configuration for public-facing data
 */
export const PUBLIC_QUERY_CONFIG = {
  staleTime: 5 * 60 * 1000, // 5 minutes
  gcTime: 15 * 60 * 1000, // 15 minutes
  refetchOnWindowFocus: false,
  refetchOnReconnect: true,
  retry: 2,
} as const;

/**
 * Queries published projects from the public backend endpoint.
 * Supports filtering by status, projectType, and featured flag.
 * Endpoint: `GET /api/v1/projects`
 */
export async function getPublicProjects(
  params: PublicProjectsQueryParams = {}
): Promise<PublicProjectsApiResponse['data']> {
  const cleanParams: Record<string, string | number | boolean> = {};

  if (typeof params.page === 'number') {
    cleanParams.page = params.page;
  }
  if (typeof params.limit === 'number') {
    cleanParams.limit = params.limit;
  }
  if (params.status) {
    cleanParams.status = params.status;
  }
  if (params.projectType) {
    cleanParams.projectType = params.projectType;
  }
  if (typeof params.featured === 'boolean') {
    cleanParams.featured = params.featured;
  }

  const response = await apiClient.get<PublicProjectsApiResponse>('/projects', {
    params: cleanParams,
  });

  return response.data.data;
}

/**
 * Fetches a single published project by its URL slug.
 * Endpoint: `GET /api/v1/projects/:slug`
 */
export async function getPublicProjectBySlug(slug: string): Promise<PublicProject> {
  if (!slug || slug.trim().length === 0) {
    throw new Error('Project slug must be provided.');
  }

  const response = await apiClient.get<PublicSingleProjectApiResponse>(
    `/projects/${encodeURIComponent(slug.trim())}`
  );

  return response.data.data.project;
}

