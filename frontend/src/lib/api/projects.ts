import { apiClient } from '@/lib/api/client';
import type {
  AdminImageDeleteApiResponse,
  AdminImageUploadApiResponse,
  AdminProjectDeleteApiResponse,
  AdminProjectsApiResponse,
  AdminProjectsQueryParams,
  AdminSingleProjectApiResponse,
  BackendImage,
  BackendProject,
  CreateProjectPayload,
  ProjectOverviewSummary,
  ProjectSummaryApiResponse,
  UpdateProjectPayload,
} from '@/types/admin';

/**
 * Extracts a normalized BackendProject from various possible API response shapes
 * ({ success: true, data: { project: ... } } or { success: true, data: { ... } }).
 * Guarantees _id is strictly populated and non-empty.
 */
function extractProjectData(data: unknown): BackendProject {
  if (!data || typeof data !== 'object') {
    throw new Error('Invalid project response format from server.');
  }

  const raw = data as Record<string, unknown>;
  const projectObj = (raw.project && typeof raw.project === 'object' ? raw.project : raw) as Record<
    string,
    unknown
  >;

  const id = (projectObj._id || projectObj.id) as string | undefined;
  if (!id || typeof id !== 'string' || id.trim().length === 0) {
    throw new Error('Project ID was not returned by the server.');
  }

  return {
    ...projectObj,
    _id: id,
  } as BackendProject;
}

/**
 * Retrieves aggregate project counts directly from the backend summary endpoint.
 * Endpoint: `GET /api/v1/admin/projects/summary`
 */
export async function getAdminProjectSummary(): Promise<ProjectOverviewSummary> {
  const response = await apiClient.get<ProjectSummaryApiResponse>('/admin/projects/summary');
  return response.data.data;
}

/**
 * Queries the admin projects list with filtering, search, and server-side pagination.
 * Endpoint: `GET /api/v1/admin/projects`
 */
export async function getAdminProjects(
  params: AdminProjectsQueryParams = {}
): Promise<AdminProjectsApiResponse['data']> {
  const cleanParams: Record<string, string | number | boolean> = {};

  if (typeof params.page === 'number') cleanParams.page = params.page;
  if (typeof params.limit === 'number') cleanParams.limit = params.limit;
  if (params.search && params.search.trim().length > 0) {
    cleanParams.search = params.search.trim();
  }
  if (params.status) cleanParams.status = params.status;
  if (params.projectType) cleanParams.projectType = params.projectType;
  if (typeof params.published === 'boolean') cleanParams.published = params.published;
  if (typeof params.featured === 'boolean') cleanParams.featured = params.featured;

  const response = await apiClient.get<AdminProjectsApiResponse>('/admin/projects', {
    params: cleanParams,
  });

  return {
    projects: response.data?.data?.projects ?? [],
    pagination: response.data?.data?.pagination ?? {
      page: params.page ?? 1,
      limit: params.limit ?? 10,
      total: 0,
      totalPages: 1,
    },
  };
}

/**
 * Retrieves a single project's complete details by ID for editing.
 * Endpoint: `GET /api/v1/admin/projects/:id`
 */
export async function getAdminProjectById(id: string): Promise<BackendProject> {
  if (!id || id === 'undefined') {
    throw new Error('Cannot fetch project: project ID is invalid.');
  }

  const response = await apiClient.get<AdminSingleProjectApiResponse>(`/admin/projects/${id}`);
  const payloadData = response.data?.data ?? response.data;
  return extractProjectData(payloadData);
}

/**
 * Creates a new base project document.
 * Endpoint: `POST /api/v1/admin/projects`
 */
export async function createAdminProject(payload: CreateProjectPayload): Promise<BackendProject> {
  const response = await apiClient.post<AdminSingleProjectApiResponse>('/admin/projects', payload);
  const payloadData = response.data?.data ?? response.data;
  return extractProjectData(payloadData);
}

/**
 * Updates an existing project record.
 * Endpoint: `PATCH /api/v1/admin/projects/:id`
 */
export async function updateAdminProject(
  id: string,
  payload: UpdateProjectPayload
): Promise<BackendProject> {
  if (!id || id === 'undefined') {
    throw new Error('Cannot update project: project ID is invalid.');
  }

  const response = await apiClient.patch<AdminSingleProjectApiResponse>(
    `/admin/projects/${id}`,
    payload
  );
  const payloadData = response.data?.data ?? response.data;
  return extractProjectData(payloadData);
}

/**
 * Uploads or replaces a project's cover image.
 * Endpoint: `POST /api/v1/admin/projects/:id/cover-image`
 */
export async function uploadProjectCoverImage(id: string, file: File): Promise<BackendImage> {
  if (!id || id === 'undefined') {
    throw new Error('Cannot upload cover image: project ID is invalid.');
  }

  const formData = new FormData();
  formData.append('coverImage', file);

  const response = await apiClient.post<AdminImageUploadApiResponse>(
    `/admin/projects/${id}/cover-image`,
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
    }
  );

  const data = response.data?.data ?? response.data;
  const imageObj = (data && typeof data === 'object' && 'coverImage' in data ? (data as Record<string, unknown>).coverImage : data) as BackendImage;
  return imageObj;
}

/**
 * Removes a project's cover image.
 * Endpoint: `DELETE /api/v1/admin/projects/:id/cover-image`
 */
export async function deleteProjectCoverImage(id: string): Promise<AdminImageDeleteApiResponse> {
  if (!id || id === 'undefined') {
    throw new Error('Cannot delete cover image: project ID is invalid.');
  }

  const response = await apiClient.delete<AdminImageDeleteApiResponse>(
    `/admin/projects/${id}/cover-image`
  );
  return response.data;
}

/**
 * Appends new gallery images to an existing project.
 * Endpoint: `POST /api/v1/admin/projects/:id/gallery`
 */
export async function uploadProjectGalleryImages(
  id: string,
  files: File[]
): Promise<BackendImage[]> {
  if (!id || id === 'undefined') {
    throw new Error('Cannot upload gallery images: project ID is invalid.');
  }

  const formData = new FormData();
  files.forEach((file) => {
    formData.append('gallery', file);
  });

  const response = await apiClient.post<AdminImageUploadApiResponse>(
    `/admin/projects/${id}/gallery`,
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
    }
  );

  const data = response.data?.data ?? response.data;
  const galleryList = (data && typeof data === 'object' && 'gallery' in data ? (data as Record<string, unknown>).gallery : data);
  return (Array.isArray(galleryList) ? galleryList : [galleryList]) as BackendImage[];
}

/**
 * Removes an individual gallery image from a project by Cloudinary publicId.
 * Endpoint: `DELETE /api/v1/admin/projects/:id/gallery/:publicId`
 */
export async function deleteProjectGalleryImage(
  id: string,
  publicId: string
): Promise<AdminImageDeleteApiResponse> {
  if (!id || id === 'undefined') {
    throw new Error('Cannot delete gallery image: project ID is invalid.');
  }

  const response = await apiClient.delete<AdminImageDeleteApiResponse>(
    `/admin/projects/${id}/gallery/${encodeURIComponent(publicId)}`
  );
  return response.data;
}

/**
 * Deletes a project record and cleans up associated Cloudinary media.
 * Endpoint: `DELETE /api/v1/admin/projects/:id`
 */
export async function deleteAdminProject(id: string): Promise<AdminProjectDeleteApiResponse> {
  if (!id || id === 'undefined') {
    throw new Error('Cannot delete project: project ID is invalid.');
  }

  const response = await apiClient.delete<AdminProjectDeleteApiResponse>(`/admin/projects/${id}`);
  return response.data;
}
