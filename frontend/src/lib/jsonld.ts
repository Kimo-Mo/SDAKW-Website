import React from 'react';
import {
  BRAND_NAMES,
  cleanDescription,
  formatLocalizedList,
  getSiteUrl,
} from '@/lib/seo';
import type { PublicProject, PublicProduct } from '@/types/public';

/**
 * Safely serializes data to a JSON-LD compliant string,
 * escaping angle brackets to eliminate XSS script termination risks.
 */
export function serializeSchema(data: unknown): string {
  return JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e');
}

export interface JsonLdScriptProps {
  data: Record<string, unknown> | Array<Record<string, unknown>>;
}

/**
 * Server Component that renders a standard JSON-LD script tag.
 */
export function JsonLdScript({ data }: JsonLdScriptProps) {
  return React.createElement('script', {
    type: 'application/ld+json',
    dangerouslySetInnerHTML: { __html: serializeSchema(data) },
  });
}

/**
 * Generates an Organization & GeneralContractor schema for the corporate entity.
 */
export function buildOrganizationSchema(locale: string) {
  const siteUrl = getSiteUrl();
  const isArabic = locale === 'ar';

  return {
    '@context': 'https://schema.org',
    '@type': ['Organization', 'GeneralContractor'],
    name: isArabic ? BRAND_NAMES.ar : BRAND_NAMES.en,
    alternateName: isArabic ? 'شركة سالم دويح العجمي' : 'SDAKW',
    url: `${siteUrl}/${locale}`,
    logo: `${siteUrl}/images/sdakw-logo.webp`,
    image: `${siteUrl}/images/og-share-card.svg`,
    description: isArabic
      ? 'أكثر من 26 عاماً من التميز في المقاولات العامة، وتوريد وتركيب الرخام والأحجار الطبيعية، وتطوير البنية التحتية في دولة الكويت.'
      : 'Over 26 years of excellence in general contracting, natural stone, marble installation, and infrastructure development across Kuwait.',
    address: {
      '@type': 'PostalAddress',
      addressCountry: 'KW',
      addressLocality: isArabic ? 'الشرق، مدينة الكويت' : 'Sharq, Kuwait City',
      streetAddress: isArabic
        ? 'شارع أحمد الجابر - قطعة 5 - قسيمة 24 - برج حمد - الدور 19'
        : 'Ahmed Al Jaber St - Block 5 - Parcel 24 - Hamad Tower - Floor 19',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      telephone: '+96550979575',
      email: 'info@sdakw.com',
      availableLanguage: ['Arabic', 'English'],
      areaServed: 'KW',
    },
    sameAs: [
      'https://linkedin.com/company/sdakw',
      'https://instagram.com/sdakw',
      'https://facebook.com/sdakw',
    ],
  };
}

export interface BreadcrumbItem {
  name: string;
  url: string;
}

/**
 * Generates a standard Schema.org BreadcrumbList.
 */
export function buildBreadcrumbListSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

/**
 * Generates a Schema.org Product schema from a PublicProduct domain model.
 */
export function buildProductSchema(product: PublicProduct, locale: string) {
  const siteUrl = getSiteUrl();
  const isArabic = locale === 'ar';

  const localizedName = isArabic
    ? product.name?.ar || product.name?.en || ''
    : product.name?.en || product.name?.ar || '';

  const material = isArabic
    ? product.material?.ar || product.material?.en || ''
    : product.material?.en || product.material?.ar || '';

  const origin = formatLocalizedList(
    isArabic
      ? product.origin?.ar || product.origin?.en
      : product.origin?.en || product.origin?.ar
  );

  const uses = formatLocalizedList(
    isArabic
      ? product.uses?.ar || product.uses?.en
      : product.uses?.en || product.uses?.ar
  );

  let description = '';
  if (isArabic) {
    const parts: string[] = [];
    if (material) parts.push(`خامة ${material}`);
    if (origin) parts.push(`بلد المنشأ: ${origin}`);
    if (uses) parts.push(`الاستخدامات: ${uses}`);
    description = parts.join(' - ');
  } else {
    const parts: string[] = [];
    if (material) parts.push(`${material} natural stone`);
    if (origin) parts.push(`Origin: ${origin}`);
    if (uses) parts.push(`Ideal for ${uses}`);
    description = parts.join(' - ');
  }

  const images: string[] = [];
  if (product.coverImage?.url) {
    images.push(product.coverImage.url);
  }
  if (product.gallery && product.gallery.length > 0) {
    product.gallery.forEach((g) => {
      if (g.url && !images.includes(g.url)) {
        images.push(g.url);
      }
    });
  }

  const productUrl = `${siteUrl}/${locale}/products/${product.slug}`;

  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: localizedName,
    image: images.length > 0 ? images : undefined,
    description: cleanDescription(description, 250),
    material: material || undefined,
    category: product.category,
    url: productUrl,
    brand: {
      '@type': 'Brand',
      name: isArabic ? BRAND_NAMES.ar : BRAND_NAMES.en,
    },
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'KWD',
      availability: 'https://schema.org/InStock',
      url: productUrl,
      seller: {
        '@type': 'Organization',
        name: isArabic ? BRAND_NAMES.ar : BRAND_NAMES.en,
      },
    },
  };
}

/**
 * Generates a Schema.org CreativeWork / RealEstateListing schema from a PublicProject domain model.
 */
export function buildProjectSchema(project: PublicProject, locale: string) {
  const siteUrl = getSiteUrl();
  const isArabic = locale === 'ar';

  const localizedTitle = isArabic
    ? project.title?.ar || project.title?.en || ''
    : project.title?.en || project.title?.ar || '';

  const rawDescription = isArabic
    ? project.description?.ar || project.description?.en || ''
    : project.description?.en || project.description?.ar || '';

  const description = cleanDescription(rawDescription, 300);

  const images: string[] = [];
  if (project.coverImage?.url) {
    images.push(project.coverImage.url);
  }
  if (project.gallery && project.gallery.length > 0) {
    project.gallery.forEach((g) => {
      if (g.url && !images.includes(g.url)) {
        images.push(g.url);
      }
    });
  }

  const projectUrl = `${siteUrl}/${locale}/projects/${project.slug}`;
  const localizedLocation = isArabic
    ? project.location?.ar || project.location?.en || ''
    : project.location?.en || project.location?.ar || '';

  const governmentEntity = isArabic
    ? project.governmentEntity?.ar || project.governmentEntity?.en || ''
    : project.governmentEntity?.en || project.governmentEntity?.ar || '';

  const schema: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': ['CreativeWork', 'RealEstateListing'],
    name: localizedTitle,
    headline: localizedTitle,
    description,
    url: projectUrl,
    mainEntityOfPage: projectUrl,
    image: images.length > 0 ? images : undefined,
    datePublished: project.createdAt,
    dateModified: project.updatedAt || project.createdAt,
    author: {
      '@type': 'Organization',
      name: isArabic ? BRAND_NAMES.ar : BRAND_NAMES.en,
      url: `${siteUrl}/${locale}`,
    },
  };

  if (localizedLocation) {
    schema.contentLocation = {
      '@type': 'Place',
      name: localizedLocation,
      address: {
        '@type': 'PostalAddress',
        addressCountry: 'KW',
        addressLocality: localizedLocation,
      },
    };
  }

  // Government entity mapping
  if (project.projectType === 'government' && governmentEntity) {
    schema.sponsor = {
      '@type': 'GovernmentOrganization',
      name: governmentEntity,
    };
  }

  // Completion date mapping
  if (project.status === 'completed' && project.completionDate) {
    schema.dateCompleted = project.completionDate;
  }

  return schema;
}
