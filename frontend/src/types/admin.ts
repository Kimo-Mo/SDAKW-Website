export interface NavigationItem {
  id: string;
  labelKey: string;
  href: string;
  iconName: 'LayoutDashboard' | 'FolderKanban' | 'FolderPlus' | 'Globe';
  isExternal?: boolean;
  exactMatch?: boolean;
}

export type MetricKey = 'total' | 'published' | 'ongoing' | 'completed';

export interface DashboardMetric {
  key: MetricKey;
  labelKey: string;
  count: number;
  variant: 'default' | 'success' | 'info' | 'warning';
  iconName: 'Folder' | 'CheckCircle2' | 'Clock' | 'Archive';
  targetHref: string;
}

export interface ProjectOverviewSummary {
  total: number;
  published: number;
  ongoing: number;
  completed: number;
  lastUpdated?: string;
}

export interface AdminShellState {
  isMobileNavOpen: boolean;
  activePathname: string;
  locale: 'ar' | 'en';
}

export interface BilingualText {
  ar: string;
  en: string;
}

export interface OptionalBilingualText {
  ar?: string;
  en?: string;
}

export interface BackendContractor {
  name: BilingualText;
  description: BilingualText;
}

export interface BackendImage {
  url: string;
  publicId: string;
}

export type ProjectType = 'government' | 'private';
export type ProjectStatus = 'ongoing' | 'completed';

export interface BackendProject {
  _id: string;
  title: BilingualText;
  description: BilingualText;
  slug?: string;
  projectType: ProjectType;
  governmentEntity?: BilingualText | null;
  contractors?: BackendContractor[];
  location?: BilingualText;
  status: ProjectStatus;
  completionDate?: string | null;
  coverImage?: BackendImage | null;
  gallery?: BackendImage[];
  featured: boolean;
  published: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface PaginationMetadata {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface AdminProjectsQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: ProjectStatus;
  projectType?: ProjectType;
  published?: boolean;
  featured?: boolean;
}

export interface ProjectsFilterState {
  search: string;
  projectType: 'all' | ProjectType;
  status: 'all' | ProjectStatus;
  published: 'all' | 'published' | 'unpublished';
  featured: 'all' | 'featured' | 'standard';
  limit: number;
  page: number;
}

export interface DeleteDialogState {
  isOpen: boolean;
  project: BackendProject | null;
  isDeleting: boolean;
  errorMessage: string | null;
}

export interface ProjectSummaryApiResponse {
  success: boolean;
  data: ProjectOverviewSummary;
}

export interface AdminProjectsApiResponse {
  success: boolean;
  data: {
    projects: BackendProject[];
    pagination?: PaginationMetadata;
  };
}

export interface AdminSingleProjectApiResponse {
  success: boolean;
  data: BackendProject;
}

export interface AdminProjectDeleteApiResponse {
  success: boolean;
  message: string;
}

export interface AdminImageUploadApiResponse {
  success: boolean;
  data: BackendImage | BackendImage[];
}

export interface AdminImageDeleteApiResponse {
  success: boolean;
  message: string;
}

/**
 * Form values for React Hook Form + Zod
 */
export interface ContractorFormValue {
  name: { ar: string; en: string };
  description: { ar: string; en: string };
}

export interface ProjectFormValues {
  title: {
    ar: string;
    en: string;
  };
  description: {
    ar: string;
    en: string;
  };
  location?: {
    ar?: string;
    en?: string;
  };
  projectType: ProjectType;
  governmentEntity?: {
    ar?: string;
    en?: string;
  } | null;
  contractors?: ContractorFormValue[];
  status: ProjectStatus;
  completionDate?: string | null;
  featured: boolean;
  published: boolean;
}

/**
 * API submission payloads
 */
export interface CreateProjectPayload {
  title: BilingualText;
  description: BilingualText;
  location?: BilingualText;
  projectType: ProjectType;
  governmentEntity: BilingualText | null;
  contractors: BackendContractor[];
  status: ProjectStatus;
  completionDate: string | null;
  featured: boolean;
  published: boolean;
}

export type UpdateProjectPayload = Partial<CreateProjectPayload>;

export interface FormMediaState {
  coverFile: File | null;
  coverPreviewUrl: string | null;
  existingCover: BackendImage | null;
  isCoverDeleting: boolean;

  newGalleryFiles: File[];
  newGalleryPreviewUrls: string[];
  existingGallery: BackendImage[];
  deletingGalleryPublicId: string | null;
}
