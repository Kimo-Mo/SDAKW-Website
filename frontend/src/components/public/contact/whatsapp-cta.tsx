'use client';

import { useTranslations } from 'next-intl';
import { ArrowUpRight, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Reveal } from '@/components/shared/reveal';
import type { WhatsAppCtaProps } from '@/types/public';
import { cn } from '@/lib/utils';

/**
 * Direct WhatsApp Consultation Card
 * Prominently offers an instant chat trigger via official WhatsApp link
 * with asymmetric editorial staging and sharp monolithic framing.
 */
export function WhatsAppCta({ className }: WhatsAppCtaProps) {
  const t = useTranslations('public');

  return (
    <Reveal variant="fade-scale">
      <section
        aria-labelledby="whatsapp-cta-heading"
        className={cn(
          'border border-border bg-card p-8 sm:p-10 shadow-xs text-start transition-all duration-300 hover:border-foreground/40',
          className
        )}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: WhatsApp Consultation Details */}
          <div className="lg:col-span-8 space-y-3">
            <div className="text-xs font-mono rtl:font-sans font-semibold tracking-widest rtl:tracking-normal text-muted-foreground uppercase">
              DIRECT // CLIENT RELATIONS
            </div>

            <div className="flex items-center gap-2.5">
              <MessageSquare className="h-5 w-5 text-foreground shrink-0" aria-hidden="true" />
              <h2
                id="whatsapp-cta-heading"
                className="font-heading text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight text-foreground">
                {t('contactPage.whatsapp.heading')}
              </h2>
            </div>

            <p className="text-xs sm:text-sm md:text-base text-muted-foreground max-w-2xl leading-relaxed">
              {t('contactPage.whatsapp.description')}
            </p>
          </div>

          {/* Right Column: Sharp Action Button */}
          <div className="lg:col-span-4 flex lg:justify-end">
            <a
              href="https://wa.me/96522000000"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto rounded-none px-7 h-12 gap-2.5 font-mono rtl:font-sans text-xs sm:text-sm uppercase tracking-wider rtl:tracking-normal font-semibold shadow-xs cursor-pointer active:scale-[0.98] transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transform-none">
                <span>{t('contactPage.whatsapp.button')}</span>
                <ArrowUpRight className="h-4 w-4 rtl:rotate-180 shrink-0" aria-hidden="true" />
              </Button>
            </a>
          </div>
        </div>
      </section>
    </Reveal>
  );
}
