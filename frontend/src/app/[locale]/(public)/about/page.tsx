import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { AboutHero } from '@/components/public/about/about-hero';
import { CompanyOverview } from '@/components/public/about/company-overview';
import { VisionMissionGrid } from '@/components/public/about/vision-mission-grid';
import { OperationsShowcase } from '@/components/public/about/operations-showcase';
import { CoreValuesGrid } from '@/components/public/about/core-values-grid';
import { CertificationsShowcase } from '@/components/public/about/certifications-showcase';
import { AboutCta } from '@/components/public/about/about-cta';
import { Separator } from '@/components/ui/separator';

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
    <article className="w-full">
      <div className="main_section space-y-10 sm:space-y-14 lg:space-y-16">
        {/* 1. Hero Cover / Asymmetric Editorial Masthead */}
        <AboutHero locale={locale} />

        <Separator className="bg-border/60" />

        {/* 2. Editorial Narrative Company Overview with Offset Image */}
        <CompanyOverview locale={locale} />

        {/* 3. Differentiated Vision & Mission Composition */}
        <VisionMissionGrid locale={locale} />

        <Separator className="bg-border/60" />

        {/* 4. Specialized Contracting & Operational Showcase with Supporting Image */}
        <OperationsShowcase locale={locale} />

        <Separator className="bg-border/60" />

        {/* 5. 5-Pillar Core Corporate Values Editorial Matrix */}
        <CoreValuesGrid locale={locale} />

        {/* 6. Triple ISO Certifications Monolithic Continuous Matrix */}
        <CertificationsShowcase locale={locale} />

        <Separator className="bg-border/60" />

        {/* 7. Closing Monolithic Call-to-Action */}
        <AboutCta locale={locale} />
      </div>
    </article>
  );
}
