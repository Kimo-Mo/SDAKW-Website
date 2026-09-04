'use client';

import { useTranslations } from 'next-intl';
import { Clock, Mail, MapPin, PhoneCall } from 'lucide-react';
import { Reveal, RevealItem } from '@/components/shared/reveal';
import type { ContactCardsGridProps } from '@/types/public';
import { cn } from '@/lib/utils';

/**
 * 4-Card Contact Touchpoints Grid
 * Renders Headquarters Address, Official Phone, Official Email, and Working Hours
 * as a monolithic specification matrix with sharp borders and mono indices.
 */
export function ContactCardsGrid({ className }: ContactCardsGridProps) {
  const t = useTranslations('public');

  const cards = [
    {
      key: 'address',
      index: '01',
      icon: MapPin,
      title: t('contactPage.cards.addressTitle'),
      tag: 'HEADQUARTERS',
      content: (
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          {t('contactPage.cards.addressValue')}
        </p>
      ),
    },
    {
      key: 'phone',
      index: '02',
      icon: PhoneCall,
      title: t('contactPage.cards.phoneTitle'),
      tag: 'DIRECT LINE',
      content: (
        <a
          href="tel:+96550979575"
          dir="ltr"
          className="font-mono text-sm sm:text-base text-foreground font-bold hover:text-primary transition-colors inline-block">
          {t('contactPage.cards.phoneValue')}
        </a>
      ),
    },
    {
      key: 'email',
      index: '03',
      icon: Mail,
      title: t('contactPage.cards.emailTitle'),
      tag: 'DIGITAL INQUIRIES',
      content: (
        <a
          href="mailto:info@sdakw.com"
          className="font-mono text-xs sm:text-sm text-foreground font-bold hover:text-primary transition-colors inline-block break-all">
          {t('contactPage.cards.emailValue')}
        </a>
      ),
    },
    {
      key: 'hours',
      index: '04',
      icon: Clock,
      title: t('contactPage.cards.hoursTitle'),
      tag: 'OPERATIONAL SCHEDULE',
      content: (
        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
          {t('contactPage.cards.hoursValue')}
        </p>
      ),
    },
  ];

  return (
    <section aria-label="Contact Information" className={cn('w-full', className)}>
      <Reveal variant="stagger-children" staggerDelay={0.08}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {cards.map((card) => {
            const Icon = card.icon;

            return (
              <RevealItem key={card.key}>
                <div className="group border border-border bg-card p-5 sm:p-6 shadow-xs transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] hover:-translate-y-1 hover:border-foreground/40 hover:bg-muted/20 hover:shadow-md space-y-4 text-start flex flex-col justify-between h-full motion-reduce:transform-none">
                  <div className="space-y-3">
                    {/* Top Metadata Header Bar */}
                    <div className="flex items-center justify-between border-b border-border pb-3">
                      <span className="font-mono text-xs font-bold text-muted-foreground">
                        TOUCHPOINT_{card.index}
                      </span>
                      <Icon
                        className="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors"
                        aria-hidden="true"
                      />
                    </div>

                    <h2 className="font-heading font-bold text-base text-foreground transition-colors group-hover:text-foreground">
                      {card.title}
                    </h2>

                    {card.content}
                  </div>

                  <div className="pt-3 border-t border-border/40 text-[10px] font-mono text-muted-foreground uppercase tracking-widest">
                    {card.tag}
                  </div>
                </div>
              </RevealItem>
            );
          })}
        </div>
      </Reveal>
    </section>
  );
}
