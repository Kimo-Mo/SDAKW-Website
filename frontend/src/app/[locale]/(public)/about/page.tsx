import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { AboutHero } from '@/components/public/about/about-hero';
import { CompanyOverview } from '@/components/public/about/company-overview';
import { VisionMissionGrid } from '@/components/public/about/vision-mission-grid';
import { CoreValuesGrid } from '@/components/public/about/core-values-grid';
import { CertificationsShowcase } from '@/components/public/about/certifications-showcase';
import { AboutCta } from '@/components/public/about/about-cta';

interface AboutPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: AboutPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'public' });

  const title = `${t('aboutPage.badge')} | ${t('brand.shortName')}`;
  const description = t('footer.aboutCompany');

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
      canonical: `/${locale}/about`,
      languages: {
        ar: '/ar/about',
        en: '/en/about',
      },
    },
  };
}

export default async function AboutPage({ params }: AboutPageProps) {
  const { locale } = await params;

  return (
    <article className="w-full py-8 sm:py-12 lg:py-16">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
        {/* 1. Hero Cover / Brand Header */}
        <AboutHero locale={locale} />

        {/* 2. Full Narrative Company Overview */}
        <CompanyOverview locale={locale} />

        {/* 3. Side-by-Side Vision & Mission Cards */}
        <VisionMissionGrid locale={locale} />

        {/* 4. 5-Pillar Core Corporate Values */}
        <CoreValuesGrid locale={locale} />

        {/* 5. Triple ISO Certifications Showcase */}
        <CertificationsShowcase locale={locale} />

        {/* 6. Closing Call-to-Action to Contact */}
        <AboutCta locale={locale} />
      </div>
    </article>
  );
}
