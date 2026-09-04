import { Suspense } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { getPublicProductBySlug } from '@/lib/api/public-products';
import { ProductDetailView } from '@/components/public/product-detail/product-detail-view';
import { Skeleton } from '@/components/ui/skeleton';

interface ProductDetailPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: ProductDetailPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: 'public' });

  try {
    const product = await getPublicProductBySlug(slug);
    if (!product) {
      return {
        title: `${t('productDetail.notFound.title')} | ${t('brand.shortName')}`,
      };
    }

    const localizedName =
      locale === 'ar'
        ? product.name?.ar || product.name?.en || ''
        : product.name?.en || product.name?.ar || '';

    const localizedMaterial =
      locale === 'ar'
        ? product.material?.ar || product.material?.en || ''
        : product.material?.en || product.material?.ar || '';

    const title = `${localizedName} | ${t('brand.shortName')}`;
    const description = localizedMaterial || t('productsPage.subtitle');

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: 'article',
        locale: locale === 'ar' ? 'ar_KW' : 'en_US',
        images: product.coverImage?.url
          ? [
              {
                url: product.coverImage.url,
                alt: localizedName,
              },
            ]
          : [
              {
                url: '/images/og-share-card.svg',
                width: 1200,
                height: 630,
                alt: title,
              },
            ],
      },
      alternates: {
        canonical: `/${locale}/products/${slug}`,
        languages: {
          ar: `/ar/products/${slug}`,
          en: `/en/products/${slug}`,
        },
      },
    };
  } catch {
    return {
      title: `${t('productDetail.notFound.title')} | ${t('brand.shortName')}`,
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

  let product;
  try {
    product = await getPublicProductBySlug(slug);
  } catch (error) {
    console.error(`[ProductDetailPage] Failed to fetch product slug "${slug}":`, error);
    notFound();
  }

  if (!product) {
    notFound();
  }

  return (
    <Suspense fallback={<ProductDetailSkeleton />}>
      <ProductDetailView product={product} locale={locale} />
    </Suspense>
  );
}
