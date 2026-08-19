import React from 'react';
import { useTranslations } from 'next-intl';
import { Clock, Mail, MapPin, PhoneCall } from 'lucide-react';
import type { ContactCardsGridProps } from '@/types/public';
import { cn } from '@/lib/utils';

/**
 * 4-Card Contact Touchpoints Grid
 * Renders Headquarters Address, Official Phone, Official Email, and Working Hours.
 */
export function ContactCardsGrid({ className }: ContactCardsGridProps) {
  const t = useTranslations('public');

  return (
    <section
      aria-label="Contact Information"
      className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6', className)}>
      {/* 1. Office Address */}
      <div className="group rounded-2xl border border-border/80 bg-card p-6 shadow-xs transition-all duration-300 hover:border-primary/40 hover:shadow-md space-y-3 text-start flex flex-col justify-between">
        <div className="space-y-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
            <MapPin className="h-5 w-5" aria-hidden="true" />
          </div>
          <h2 className="font-heading font-semibold text-base text-foreground">
            {t('contactPage.cards.addressTitle')}
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {t('contactPage.cards.addressValue')}
          </p>
        </div>
      </div>

      {/* 2. Telephone Line */}
      <div className="group rounded-2xl border border-border/80 bg-card p-6 shadow-xs transition-all duration-300 hover:border-primary/40 hover:shadow-md space-y-3 text-start flex flex-col justify-between">
        <div className="space-y-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
            <PhoneCall className="h-5 w-5" aria-hidden="true" />
          </div>
          <h2 className="font-heading font-semibold text-base text-foreground">
            {t('contactPage.cards.phoneTitle')}
          </h2>
          <a
            href="tel:+96522000000"
            dir="ltr"
            className="text-xs sm:text-sm text-primary font-bold hover:underline inline-block">
            {t('contactPage.cards.phoneValue')}
          </a>
        </div>
      </div>

      {/* 3. Official Email */}
      <div className="group rounded-2xl border border-border/80 bg-card p-6 shadow-xs transition-all duration-300 hover:border-primary/40 hover:shadow-md space-y-3 text-start flex flex-col justify-between">
        <div className="space-y-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
            <Mail className="h-5 w-5" aria-hidden="true" />
          </div>
          <h2 className="font-heading font-semibold text-base text-foreground">
            {t('contactPage.cards.emailTitle')}
          </h2>
          <a
            href="mailto:info@sdakw.com"
            className="text-xs sm:text-sm text-primary font-bold hover:underline inline-block break-all">
            {t('contactPage.cards.emailValue')}
          </a>
        </div>
      </div>

      {/* 4. Working Hours */}
      <div className="group rounded-2xl border border-border/80 bg-card p-6 shadow-xs transition-all duration-300 hover:border-primary/40 hover:shadow-md space-y-3 text-start flex flex-col justify-between">
        <div className="space-y-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
            <Clock className="h-5 w-5" aria-hidden="true" />
          </div>
          <h2 className="font-heading font-semibold text-base text-foreground">
            {t('contactPage.cards.hoursTitle')}
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
            {t('contactPage.cards.hoursValue')}
          </p>
        </div>
      </div>
    </section>
  );
}
