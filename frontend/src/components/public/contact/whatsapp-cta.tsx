import React from 'react';
import { useTranslations } from 'next-intl';
import { ArrowUpRight, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { WhatsAppCtaProps } from '@/types/public';
import { cn } from '@/lib/utils';

/**
 * Direct WhatsApp Consultation Card
 * Prominently offers an instant chat trigger via official WhatsApp link.
 */
export function WhatsAppCta({ className }: WhatsAppCtaProps) {
  const t = useTranslations('public');

  return (
    <section
      aria-labelledby="whatsapp-cta-heading"
      className={cn(
        'relative overflow-hidden rounded-3xl border border-emerald-500/20 bg-linear-to-br from-emerald-500/10 via-card to-card p-6 sm:p-10 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-start',
        className
      )}>
      <div className="flex flex-col md:flex-row items-center gap-5">
        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-md ring-4 ring-emerald-500/20">
          <MessageSquare className="h-7 w-7" aria-hidden="true" />
        </div>
        <div className="space-y-1.5">
          <h2
            id="whatsapp-cta-heading"
            className="font-heading text-xl sm:text-2xl font-bold tracking-tight text-foreground">
            {t('contactPage.whatsapp.heading')}
          </h2>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-xl leading-relaxed">
            {t('contactPage.whatsapp.description')}
          </p>
        </div>
      </div>

      <a
        href="https://wa.me/96522000000"
        target="_blank"
        rel="noopener noreferrer"
        className="shrink-0">
        <Button
          size="lg"
          className="gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-7 h-12 shadow-sm font-semibold cursor-pointer">
          <span>{t('contactPage.whatsapp.button')}</span>
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </Button>
      </a>
    </section>
  );
}
