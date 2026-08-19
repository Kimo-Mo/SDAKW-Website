import React from 'react';
import { useTranslations } from 'next-intl';
import { ArrowLeft, ArrowRight, PhoneCall } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import type { AboutCtaProps } from '@/types/public';
import { cn } from '@/lib/utils';

/**
 * About Us Page Closing CTA Banner
 * Drives visitors toward project inquiries and tender submissions on /contact.
 */
export function AboutCta({ locale, className }: AboutCtaProps) {
  const t = useTranslations('public');
  const isRtl = locale === 'ar';
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <section
      aria-labelledby="about-cta-heading"
      className={cn(
        'relative overflow-hidden rounded-3xl border border-primary/20 bg-linear-to-br from-primary/10 via-card to-card p-8 sm:p-12 lg:p-14 shadow-xs text-center space-y-6',
        className
      )}>
      <div className="relative z-10 max-w-2xl mx-auto space-y-4">
        <h2
          id="about-cta-heading"
          className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
          {t('aboutPage.cta.heading')}
        </h2>
        <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
          {t('aboutPage.cta.subtitle')}
        </p>

        <div className="pt-4 flex justify-center">
          <Link href="/contact">
            <Button
              size="lg"
              className="gap-2.5 rounded-xl px-8 h-12 shadow-sm font-semibold cursor-pointer">
              <PhoneCall className="h-4 w-4" aria-hidden="true" />
              <span>{t('aboutPage.cta.button')}</span>
              <ArrowIcon className="h-4 w-4" aria-hidden="true" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
