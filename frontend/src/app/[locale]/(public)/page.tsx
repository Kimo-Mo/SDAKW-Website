import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { HeroSection } from '@/components/public/home/hero-section';
import { HeroSecondaryImage } from '@/components/public/home/hero-secondary-image';
import { IntroSection } from '@/components/public/home/intro-section';
import { FeaturedProjectsShowcase } from '@/components/public/home/featured-projects-showcase';
import { ServicesSection } from '@/components/public/home/services-section';
import { CtaSection } from '@/components/public/home/cta-section';
import { PartnersSection } from '@/components/public/home/partners-section';

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
      {/* 1. Flagship Hero Section */}
      <HeroSection />

      {/* 2. Secondary Hero Image with Scroll Parallax/Scale */}
      <HeroSecondaryImage />

      {/* 3. Company Introduction & Craftsmanship Section */}
      <IntroSection />

      {/* 4. Featured Projects Showcase with Staggered Entrance */}
      <FeaturedProjectsShowcase locale={locale} />

      {/* 5. Services Overview Section with Staggered Entrance */}
      <ServicesSection />

      {/* 6. Consultation Call-to-Action */}
      <CtaSection />

      {/* 7. Auto-scrolling Strategic Partners & Clients Carousel */}
      <PartnersSection />
    </div>
  );
}
