import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { HeroSection } from '@/components/public/hero-section';
import { IntroSection } from '@/components/public/intro-section';
import { FeaturedProjectsShowcase } from '@/components/public/featured-projects-showcase';
import { ServicesSection } from '@/components/public/services-section';
import { CtaSection } from '@/components/public/cta-section';
import { ContactPreviewSection } from '@/components/public/contact-preview-section';

interface HomePageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'public' });

  const title = `${t('brand.name')} | ${t('brand.tagline')}`;
  const description = t('hero.subtitle');

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
          alt: t('brand.name'),
        },
      ],
    },
    alternates: {
      canonical: `/${locale}`,
      languages: {
        ar: '/ar',
        en: '/en',
      },
    },
  };
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale } = await params;

  return (
    <div className="w-full flex flex-col flex-1">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Company Introduction Section */}
      <IntroSection />

      {/* 3. Featured Projects Showcase */}
      <FeaturedProjectsShowcase locale={locale} />

      {/* 4. Services Overview Section */}
      <ServicesSection />

      {/* 5. Consultation Call-to-Action */}
      <CtaSection />

      {/* 6. Contact Preview Section */}
      <ContactPreviewSection />
    </div>
  );
}
