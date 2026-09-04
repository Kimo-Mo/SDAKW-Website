import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { ContactHeader } from '@/components/public/contact/contact-header';
import { ContactCardsGrid } from '@/components/public/contact/contact-cards-grid';
import { LocationMapCard } from '@/components/public/contact/location-map-card';
import { WhatsAppCta } from '@/components/public/contact/whatsapp-cta';
import { SocialChannels } from '@/components/public/contact/social-channels';
import { createAlternates, getOgLocale } from '@/lib/seo';

interface ContactPageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: ContactPageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'public' });

  const title = `${t('contactPage.badge')} | ${t('brand.shortName')}`;
  const description = t('contactPage.subtitle');

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      locale: getOgLocale(locale),
      images: [
        {
          url: '/images/og-share-card.svg',
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    alternates: createAlternates('/contact', locale),
  };
}

export default async function ContactPage({ params }: ContactPageProps) {
  const { locale } = await params;

  return (
    <article className="w-full">
      <div className="main_section space-y-12 sm:space-y-16">
        {/* 1. Header with Badge & Title */}
        <ContactHeader locale={locale} />

        {/* 2. 4-Card Contact Grid */}
        <ContactCardsGrid locale={locale} />

        {/* 3. Location Navigation Card */}
        <LocationMapCard locale={locale} />

        {/* 4. WhatsApp Direct Consultation CTA */}
        <WhatsAppCta locale={locale} />

        {/* 5. Social Media Channels */}
        <SocialChannels locale={locale} />
      </div>
    </article>
  );
}
