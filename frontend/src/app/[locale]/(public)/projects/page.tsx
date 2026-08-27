import { Suspense } from 'react';
import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { getPublicProjects } from '@/lib/api/public-projects';
import { ProjectsListingView } from '@/components/public/projects/projects-listing-view';
import { Skeleton } from '@/components/ui/skeleton';

interface ProjectsPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: ProjectsPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'public' });

  const title = `${t('projectsPage.title')} | ${t('brand.shortName')}`;
  const description = t('projectsPage.subtitle');

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      locale: locale === 'ar' ? 'ar_KW' : 'en_US',
      images: [
        {
          url: '/images/og-share-card.svg',
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    alternates: {
      canonical: `/${locale}/projects`,
      languages: {
        ar: '/ar/projects',
        en: '/en/projects',
      },
    },
  };
}

function ProjectsLoadingFallback() {
  return (
    <div className="w-full flex flex-col flex-1">
      <div className="w-full py-16 bg-muted/30 border-b border-border/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4">
          <Skeleton className="h-6 w-32 rounded-full" />
          <Skeleton className="h-10 w-3/4 max-w-xl rounded-lg" />
          <Skeleton className="h-5 w-full max-w-2xl rounded-md" />
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full space-y-8">
        <Skeleton className="h-12 w-80 " />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={`fallback-skeleton-${i}`}
              className="border border-border/60 overflow-hidden bg-card">
              <Skeleton className="aspect-video w-full rounded-none" />
              <div className="p-6 space-y-3">
                <Skeleton className="h-4 w-24 rounded" />
                <Skeleton className="h-6 w-4/5 rounded" />
                <Skeleton className="h-4 w-full rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default async function ProjectsPage({ params }: ProjectsPageProps) {
  const { locale } = await params;

  let initialData = undefined;
  try {
    initialData = await getPublicProjects({ page: 1, limit: 9 });
  } catch (error) {
    // If backend is not available during SSR or cold start,
    // graceful fallback allows client-side TanStack Query to fetch/retry
    console.error('[ProjectsPage SSR] Failed to prefetch public projects:', error);
  }

  return (
    <div className="w-full flex flex-col flex-1">
      <Suspense fallback={<ProjectsLoadingFallback />}>
        <ProjectsListingView initialData={initialData} locale={locale} />
      </Suspense>
    </div>
  );
}
