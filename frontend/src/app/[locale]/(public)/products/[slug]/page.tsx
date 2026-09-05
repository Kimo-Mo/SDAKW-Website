import { Suspense } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { getPublicProductBySlug } from '@/lib/api/public-products';
import { ProductDetailView } from '@/components/public/product-detail/product-detail-view';
import { Skeleton } from '@/components/ui/skeleton';
import {
  BRAND_NAMES,
  cleanDescription,
  createAlternates,
  formatLocalizedList,
  getAlternateOgLocale,
  getOgLocale,
  getSiteUrl,
} from '@/lib/seo';
import {
  JsonLdScript,
  buildBreadcrumbListSchema,
  buildProductSchema,
} from '@/lib/jsonld';

export const dynamic = 'force-dynamic';

interface ProductDetailPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: 'public' });
  const siteUrl = getSiteUrl();

  try {
    const product = await getPublicProductBySlug(slug);
    if (!product || product.published === false) {
      return {
        title: `${t('productDetail.notFound.title')} | ${t('brand.shortName')}`,
        robots: { index: false, follow: false },
      };
    }

    const isArabic = locale === 'ar';
    const siteName = isArabic ? BRAND_NAMES.ar : BRAND_NAMES.en;

    const localizedName = isArabic
      ? product.name?.ar || product.name?.en || ''
      : product.name?.en || product.name?.ar || '';

    let description = '';
    if (isArabic) {
      const material = product.material?.ar || product.material?.en || '';
      const origin = formatLocalizedList(product.origin?.ar || product.origin?.en);
      const uses = formatLocalizedList(product.uses?.ar || product.uses?.en);

      const parts: string[] = [];
      if (material) parts.push(`خامة ${material}`);
      if (origin) parts.push(`بلد المنشأ: ${origin}`);
      if (uses) parts.push(`الاستخدامات: ${uses}`);

      description = parts.length > 0 ? parts.join(' - ') : t('productsPage.subtitle');
    } else {
      const material = product.material?.en || product.material?.ar || '';
      const origin = formatLocalizedList(product.origin?.en || product.origin?.ar);
      const uses = formatLocalizedList(product.uses?.en || product.uses?.ar);

      const parts: string[] = [];
      if (material) parts.push(`${material} natural stone`);
      if (origin) parts.push(`Origin: ${origin}`);
      if (uses) parts.push(`Ideal for ${uses}`);

      description = parts.length > 0 ? parts.join(' - ') : t('productsPage.subtitle');
    }

    description = cleanDescription(description, 160);

    const alternates = createAlternates(`/products/${slug}`, locale);

    const ogImages = product.coverImage?.url
      ? [
          {
            url: product.coverImage.url,
            alt: localizedName,
          },
        ]
      : [
          {
            url: `${siteUrl}/images/og-share-card.svg`,
            width: 1200,
            height: 630,
            alt: localizedName,
          },
        ];

    const twitterImages = product.coverImage?.url
      ? [product.coverImage.url]
      : [`${siteUrl}/images/og-share-card.svg`];

    return {
      title: localizedName,
      description,
      alternates,
      openGraph: {
        title: localizedName,
        description,
        url: alternates.canonical,
        type: 'article',
        siteName,
        locale: getOgLocale(locale),
        alternateLocale: [getAlternateOgLocale(locale)],
        images: ogImages,
      },
      twitter: {
        card: 'summary_large_image',
        title: localizedName,
        description,
        images: twitterImages,
      },
    };
  } catch {
    return {
      title: `${t('productDetail.notFound.title')} | ${t('brand.shortName')}`,
      robots: { index: false, follow: false },
    };
  }
}

function ProductDetailSkeleton() {
  return (
    <article className="w-full py-8 sm:py-12 lg:py-16 text-start animate-pulse">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
        {/* Navigation skeleton */}
        <div className="flex items-center justify-between pb-3 border-b border-border">
          <Skeleton className="h-4 w-28 rounded-none" />
          <Skeleton className="h-4 w-48 rounded-none hidden sm:block" />
        </div>

        {/* Hero skeleton */}
        <Skeleton className="aspect-video sm:aspect-21/9 w-full rounded-none" />

        {/* Title & Material skeleton */}
        <div className="space-y-3">
          <Skeleton className="h-4 w-28 rounded-none" />
          <Skeleton className="h-9 w-3/4 max-w-xl rounded-none" />
          <Skeleton className="h-5 w-48 rounded-none" />
        </div>

        {/* Specifications skeleton */}
        <div className="border border-border p-6 sm:p-8 space-y-4">
          <Skeleton className="h-4 w-32 rounded-none" />
          <Skeleton className="h-6 w-full rounded-none" />
          <Skeleton className="h-6 w-5/6 rounded-none" />
          <Skeleton className="h-6 w-4/6 rounded-none" />
        </div>
      </div>
    </article>
  );
}

export default async function ProductDetailPage({ params }: ProductDetailPageProps) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: 'public' });
  const siteUrl = getSiteUrl();

  let product;
  try {
    product = await getPublicProductBySlug(slug);
  } catch (error) {
    console.error(`[ProductDetailPage] Failed to fetch product slug "${slug}":`, error);
    notFound();
  }

  if (!product || product.published === false) {
    notFound();
  }

  const isArabic = locale === 'ar';
  const localizedName = isArabic
    ? product.name?.ar || product.name?.en || ''
    : product.name?.en || product.name?.ar || '';

  const productSchema = buildProductSchema(product, locale);
  const breadcrumbSchema = buildBreadcrumbListSchema([
    { name: t('nav.home'), url: `${siteUrl}/${locale}` },
    { name: t('nav.products'), url: `${siteUrl}/${locale}/products` },
    { name: localizedName, url: `${siteUrl}/${locale}/products/${slug}` },
  ]);

  return (
    <>
      {/* JSON-LD Product & BreadcrumbList Rich Snippets */}
      <JsonLdScript data={[productSchema, breadcrumbSchema]} />
      <Suspense fallback={<ProductDetailSkeleton />}>
        <ProductDetailView product={product} locale={locale} />
      </Suspense>
    </>
  );
}
