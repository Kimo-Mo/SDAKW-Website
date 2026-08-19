import { Suspense } from 'react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getTranslations } from 'next-intl/server';
import { getPublicProjectBySlug } from '@/lib/api/public-projects';
import { ProjectDetailView } from '@/components/public/project-detail/project-detail-view';
import { Skeleton } from '@/components/ui/skeleton';

interface ProjectDetailPageProps {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: ProjectDetailPageProps): Promise<Metadata> {
  const { locale, slug } = await params;
  const t = await getTranslations({ locale, namespace: 'public' });

  try {
    const project = await getPublicProjectBySlug(slug);
    if (!project) {
      return {
        title: `${t('projectDetail.notFound.title')} | ${t('brand.shortName')}`,
      };
    }

    const localizedTitle =
      locale === 'ar'
        ? project.title?.ar || project.title?.en || ''
        : project.title?.en || project.title?.ar || '';

    const localizedDescription =
      locale === 'ar'
        ? project.description?.ar || project.description?.en || ''
        : project.description?.en || project.description?.ar || '';

    const title = `${localizedTitle} | ${t('brand.shortName')}`;
    const description = localizedDescription || t('projectsPage.subtitle');

    return {
      title,
      description,
      openGraph: {
        title,
        description,
        type: 'article',
        locale: locale === 'ar' ? 'ar_KW' : 'en_US',
        images: project.coverImage?.url
          ? [
              {
                url: project.coverImage.url,
                alt: localizedTitle,
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
        canonical: `/${locale}/projects/${slug}`,
        languages: {
          ar: `/ar/projects/${slug}`,
          en: `/en/projects/${slug}`,
        },
      },
    };
  } catch {
    return {
      title: `${t('projectDetail.notFound.title')} | ${t('brand.shortName')}`,
    };
  }
}

function ProjectDetailSkeleton() {
  return (
    <article className="w-full py-8 sm:py-12 lg:py-16 text-start animate-pulse">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 space-y-8 sm:space-y-10">
        {/* Navigation skeleton */}
        <div className="flex items-center justify-between pb-2 border-b border-border/40">
          <Skeleton className="h-4 w-28 rounded-md" />
          <Skeleton className="h-4 w-48 rounded-md hidden sm:block" />
        </div>

        {/* Hero skeleton */}
        <Skeleton className="aspect-video sm:aspect-21/9 w-full rounded-2xl sm:rounded-3xl" />

        {/* Metadata bar skeleton */}
        <div className="flex flex-wrap gap-2.5 sm:gap-3 py-2">
          <Skeleton className="h-7 w-28 rounded-full" />
          <Skeleton className="h-7 w-24 rounded-full" />
          <Skeleton className="h-7 w-36 rounded-lg" />
          <Skeleton className="h-7 w-32 rounded-lg" />
        </div>

        {/* Title & Description skeleton */}
        <div className="space-y-6 sm:space-y-8">
          <Skeleton className="h-9 w-3/4 max-w-xl rounded-lg" />
          <div className="rounded-2xl border border-border/60 p-6 sm:p-8 space-y-4">
            <Skeleton className="h-4 w-32 rounded-md" />
            <Skeleton className="h-5 w-full rounded-md" />
            <Skeleton className="h-5 w-5/6 rounded-md" />
            <Skeleton className="h-5 w-4/6 rounded-md" />
          </div>
        </div>
      </div>
    </article>
  );
}

export default async function ProjectDetailPage({ params }: ProjectDetailPageProps) {
  const { locale, slug } = await params;

  let project;
  try {
    project = await getPublicProjectBySlug(slug);
  } catch (error) {
    console.error(`[ProjectDetailPage] Failed to fetch project slug "${slug}":`, error);
    notFound();
  }

  if (!project) {
    notFound();
  }

  return (
    <Suspense fallback={<ProjectDetailSkeleton />}>
      <ProjectDetailView project={project} locale={locale} />
    </Suspense>
  );
}
