import { Suspense } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { getPublicProjectBySlug } from '@/lib/api/public-projects';
import { ProjectDetailView } from '@/components/public/project-detail/project-detail-view';
import { Skeleton } from '@/components/ui/skeleton';
import {
  BRAND_NAMES,
  cleanDescription,
  createAlternates,
  getAlternateOgLocale,
  getOgLocale,
  getSiteUrl,
} from '@/lib/seo';
import {
  JsonLdScript,
  buildBreadcrumbListSchema,
  buildProjectSchema,
} from '@/lib/jsonld';

export const dynamic = 'force-dynamic';

interface ProjectDetailPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: ProjectDetailPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: 'public' });
  const siteUrl = getSiteUrl();

  try {
    const project = await getPublicProjectBySlug(slug);
    if (!project || project.published === false) {
      return {
        title: `${t('projectDetail.notFound.title')} | ${t('brand.shortName')}`,
        robots: { index: false, follow: false },
      };
    }

    const isArabic = locale === 'ar';
    const siteName = isArabic ? BRAND_NAMES.ar : BRAND_NAMES.en;

    const localizedTitle = isArabic
      ? project.title?.ar || project.title?.en || ''
      : project.title?.en || project.title?.ar || '';

    const rawDescription = isArabic
      ? project.description?.ar || project.description?.en || ''
      : project.description?.en || project.description?.ar || '';

    const description =
      cleanDescription(rawDescription) || t('projectsPage.subtitle');

    const alternates = createAlternates(`/projects/${slug}`, locale);

    const ogImages = project.coverImage?.url
      ? [
          {
            url: project.coverImage.url,
            alt: localizedTitle,
          },
        ]
      : [
          {
            url: `${siteUrl}/images/og-share-card.svg`,
            width: 1200,
            height: 630,
            alt: localizedTitle,
          },
        ];

    const twitterImages = project.coverImage?.url
      ? [project.coverImage.url]
      : [`${siteUrl}/images/og-share-card.svg`];

    return {
      title: localizedTitle,
      description,
      alternates,
      openGraph: {
        title: localizedTitle,
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
        title: localizedTitle,
        description,
        images: twitterImages,
      },
    };
  } catch {
    return {
      title: `${t('projectDetail.notFound.title')} | ${t('brand.shortName')}`,
      robots: { index: false, follow: false },
    };
  }
}

function ProjectDetailSkeleton() {
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

        {/* Metadata bar skeleton */}
        <div className="flex flex-wrap gap-2.5 sm:gap-3 py-2">
          <Skeleton className="h-7 w-28 rounded-none" />
          <Skeleton className="h-7 w-24 rounded-none" />
          <Skeleton className="h-7 w-36 rounded-none" />
          <Skeleton className="h-7 w-32 rounded-none" />
        </div>

        {/* Title & Description skeleton */}
        <div className="space-y-6 sm:space-y-8">
          <Skeleton className="h-9 w-3/4 max-w-xl rounded-none" />
          <div className="border border-border p-6 sm:p-8 space-y-4">
            <Skeleton className="h-4 w-32 rounded-none" />
            <Skeleton className="h-5 w-full rounded-none" />
            <Skeleton className="h-5 w-5/6 rounded-none" />
            <Skeleton className="h-5 w-4/6 rounded-none" />
          </div>
        </div>
      </div>
    </article>
  );
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: 'public' });
  const siteUrl = getSiteUrl();

  let project;
  try {
    project = await getPublicProjectBySlug(slug);
  } catch (error) {
    console.error(`[ProjectDetailPage] Failed to fetch project slug "${slug}":`, error);
    notFound();
  }

  if (!project || project.published === false) {
    notFound();
  }

  const isArabic = locale === 'ar';
  const localizedTitle = isArabic
    ? project.title?.ar || project.title?.en || ''
    : project.title?.en || project.title?.ar || '';

  const projectSchema = buildProjectSchema(project, locale);
  const breadcrumbSchema = buildBreadcrumbListSchema([
    { name: t('nav.home'), url: `${siteUrl}/${locale}` },
    { name: t('nav.projects'), url: `${siteUrl}/${locale}/projects` },
    { name: localizedTitle, url: `${siteUrl}/${locale}/projects/${slug}` },
  ]);

  return (
    <>
      {/* JSON-LD Project & BreadcrumbList Rich Snippets */}
      <JsonLdScript data={[projectSchema, breadcrumbSchema]} />
      <Suspense fallback={<ProjectDetailSkeleton />}>
        <ProjectDetailView project={project} locale={locale} />
      </Suspense>
    </>
  );
}
