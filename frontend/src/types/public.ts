import React from 'react';

/**
 * Navigation item link specification for public header and mobile nav.
 */
export interface PublicNavigationItem {
  id: 'home' | 'about' | 'projects' | 'products' | 'contact';
  labelKey: string;
  href: string;
  exactMatch?: boolean;
}

/**
 * Static corporate contact information and credentials for SDAKW.
 */
export interface CompanyContactProfile {
  companyName: {
    ar: string;
    en: string;
  };
  tagline: {
    ar: string;
    en: string;
  };
  address: {
    ar: string;
    en: string;
  };
  phone: string;
  phoneClean: string;
  email: string;
  whatsapp: string;
  socialLinks: {
    linkedin?: string;
    instagram?: string;
  };
  workingHours: {
    ar: string;
    en: string;
  };
}

/**
 * Footer link structure for multi-column footer navigation.
 */
export interface FooterLink {
  id: string;
  labelKey: string;
  href: string;
  isExternal?: boolean;
}

/**
 * Column definition for public website footer.
 */
export interface FooterColumn {
  id: 'company' | 'quickLinks' | 'contact' | 'social';
  titleKey: string;
  links?: FooterLink[];
}

/**
 * Client-side public shell UI state.
 */
export interface PublicShellState {
  isMobileNavOpen: boolean;
  isScrolled: boolean;
  activeLocale: 'ar' | 'en';
  activePathname: string;
}

/**
 * Public Project Domain Model returned by public API endpoints
 */
export interface PublicProject {
  _id: string;
  slug: string;
  title: {
    ar: string;
    en: string;
  };
  description: {
    ar: string;
    en: string;
  };
  projectType: 'government' | 'private';
  status: 'ongoing' | 'completed';
  location: {
    ar: string;
    en: string;
  };
  coverImage: {
    url: string;
    publicId: string;
  } | null;
  gallery?: Array<{
    url: string;
    publicId: string;
  }>;
  governmentEntity?: {
    ar: string;
    en: string;
  } | null;
  contractors?: Array<{
    name: {
      ar: string;
      en: string;
    };
    description: {
      ar: string;
      en: string;
    };
  }>;
  completionDate?: string | null;
  featured: boolean;
  published: boolean;
  createdAt: string;
  updatedAt?: string;
}

/**
 * Response structure for `GET /api/v1/projects/:slug`
 */
export interface PublicSingleProjectApiResponse {
  success: boolean;
  data: {
    project: PublicProject;
  };
  error?: string;
}

/**
 * Pagination metadata for public project list queries
 */
export interface PublicProjectsPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

/**
 * Response structure for `GET /api/v1/projects`
 */
export interface PublicProjectsApiResponse {
  success: boolean;
  data: {
    projects: PublicProject[];
    pagination: PublicProjectsPagination;
  };
  error?: string;
}

/**
 * Query parameters supported by public projects API
 */
export interface PublicProjectsQueryParams {
  page?: number;
  limit?: number;
  status?: 'ongoing' | 'completed';
  projectType?: 'government' | 'private';
  featured?: boolean;
}

/**
 * Static corporate metric displayed in Hero & Intro sections
 */
export interface CompanyMetric {
  id: 'experience' | 'government' | 'private' | 'iso';
  value: string;
  labelKey: string;
  iconName: 'Clock' | 'Landmark' | 'Building2' | 'ShieldCheck';
}

/**
 * Static contracting service pillar
 */
export interface ServiceOffering {
  id: 'service1' | 'service2' | 'service3';
  titleKey: string;
  descriptionKey: string;
  iconName: 'Building2' | 'Layers' | 'Sparkles';
}

/**
 * Component Props Contracts
 */
export interface PublicShellProps {
  children: React.ReactNode;
  locale: string;
}

export interface PublicHeaderProps {
  currentPath: string;
  locale: string;
  onOpenMobileNav: () => void;
}

export interface PublicMobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  currentPath: string;
  locale: string;
}

export interface LanguageSwitcherProps {
  locale: string;
  className?: string;
  variant?: 'pill' | 'mobile' | 'ghost';
  onSwitch?: () => void;
}

export interface NavLinkProps {
  item: PublicNavigationItem;
  onClick?: () => void;
  className?: string;
}

export interface ProjectCardProps {
  project: PublicProject;
  locale: string;
  className?: string;
}

export interface FeaturedProjectsShowcaseProps {
  locale: string;
  initialData?: PublicProject[];
}

/**
 * Filter state models for Public Projects Listing
 */
export type ProjectTypeFilter = 'all' | 'government' | 'private';
export type ProjectStatusFilter = 'all' | 'ongoing' | 'completed';

export interface ProjectsFilterState {
  projectType: ProjectTypeFilter;
  status: ProjectStatusFilter;
  featured?: boolean;
  page: number;
}

/**
 * Component Props for Public Projects Listing components
 */
export interface ProjectsHeaderProps {
  totalProjects?: number;
}

export interface ProjectsFiltersProps {
  selectedType: ProjectTypeFilter;
  selectedStatus: ProjectStatusFilter;
  isFeaturedOnly: boolean;
  onTypeChange: (type: ProjectTypeFilter) => void;
  onStatusChange: (status: ProjectStatusFilter) => void;
  onFeaturedChange: (featured: boolean) => void;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
  totalResults?: number;
}

export interface ProjectsGridProps {
  projects: PublicProject[];
  isLoading: boolean;
  isError: boolean;
  onRetry: () => void;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
  locale: string;
}

export interface ProjectsPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  locale: string;
}

export interface ProjectsListingViewProps {
  initialData?: {
    projects: PublicProject[];
    pagination: PublicProjectsPagination;
  };
  locale: string;
}

/**
 * Component Props for Public Project Details components
 */
export interface ProjectDetailViewProps {
  project: PublicProject;
  locale: string;
}

export interface ProjectHeroProps {
  coverImage: {
    url: string;
    publicId: string;
  } | null;
  title: string;
  locale: string;
  className?: string;
}

export interface ProjectMetadataBarProps {
  project: PublicProject;
  locale: string;
  className?: string;
}

export interface GalleryLightboxProps {
  images: Array<{
    url: string;
    publicId: string;
  }>;
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
  locale: string;
}

export interface ProjectGalleryProps {
  images?: Array<{
    url: string;
    publicId: string;
  }>;
  projectTitle: string;
  locale: string;
  className?: string;
}

export interface ProjectContractorsProps {
  contractors?: Array<{
    name: {
      ar: string;
      en: string;
    };
    description: {
      ar: string;
      en: string;
    };
  }>;
  locale: string;
  className?: string;
}

/**
 * About Us Page Component Props
 */
export interface AboutHeroProps {
  locale: string;
  className?: string;
}

export interface CompanyOverviewProps {
  locale: string;
  className?: string;
}

export interface VisionMissionGridProps {
  locale: string;
  className?: string;
}

export interface CoreValuesGridProps {
  locale: string;
  className?: string;
}

export interface CertificationsShowcaseProps {
  locale: string;
  className?: string;
}

export interface OperationsShowcaseProps {
  locale?: string;
  className?: string;
}

export interface AboutCtaProps {
  locale: string;
  className?: string;
}

/**
 * Contact Page Component Props
 */
export interface ContactHeaderProps {
  locale: string;
  className?: string;
}

export interface ContactCardsGridProps {
  locale: string;
  className?: string;
}

export interface LocationMapCardProps {
  locale: string;
  className?: string;
}

export interface WhatsAppCtaProps {
  locale: string;
  className?: string;
}

export interface SocialChannelsProps {
  locale: string;
  className?: string;
}

/**
 * Quality Pass Presentation Interfaces
 */
export interface BrandedImageFallbackProps {
  className?: string;
  aspectRatio?: 'video' | 'square' | '4/3';
  showLabel?: boolean;
}

export interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ComponentType<{ className?: string }>;
  className?: string;
}

/**
 * ── Public Product Types & Domain Models ──────────────────────────────────────
 */

export type PublicProductCategory =
  | 'natural_granite'
  | 'natural_stone'
  | 'natural_marble'
  | 'quartz_industrial';

export type ProductCategoryFilter = 'all' | PublicProductCategory;

export interface PublicProduct {
  _id: string;
  slug: string;
  name: {
    ar: string;
    en: string;
  };
  category: PublicProductCategory;
  material: {
    ar: string;
    en: string;
  };
  color: {
    ar: string[];
    en: string[];
  };
  origin: {
    ar: string[];
    en: string[];
  };
  uses: {
    ar: string[];
    en: string[];
  };
  surface: {
    ar: string[];
    en: string[];
  };
  coverImage: {
    url: string;
    publicId: string;
  } | null;
  gallery?: Array<{
    url: string;
    publicId: string;
  }>;
  published: boolean;
  createdAt: string;
  updatedAt?: string;
}

export interface PublicSingleProductApiResponse {
  success: boolean;
  data: {
    product: PublicProduct;
  };
  error?: string;
}

export interface PublicProductsPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface PublicProductsApiResponse {
  success: boolean;
  data: {
    products: PublicProduct[];
    pagination: PublicProductsPagination;
  };
  error?: string;
}

export interface PublicProductsQueryParams {
  page?: number;
  limit?: number;
  category?: PublicProductCategory;
}

export interface ProductsListingViewProps {
  initialData?: {
    products: PublicProduct[];
    pagination: PublicProductsPagination;
  };
  locale: string;
}

export interface ProductCardProps {
  product: PublicProduct;
  locale: string;
  className?: string;
}

export interface ProductDetailViewProps {
  product: PublicProduct;
  locale: string;
}

export interface ProductHeroProps {
  coverImage: { url: string; publicId: string } | null;
  title: string;
  locale: string;
  className?: string;
}

export interface ProductSpecificationsProps {
  product: PublicProduct;
  locale: string;
  className?: string;
}

export interface ProductGalleryProps {
  images?: Array<{ url: string; publicId: string }>;
  productTitle: string;
  locale: string;
  className?: string;
}

