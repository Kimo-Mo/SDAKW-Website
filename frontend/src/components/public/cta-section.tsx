import { useTranslations } from 'next-intl';
import { ArrowRight, PhoneCall } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';


/**
 * High-impact consultation call-to-action banner for the Public Home Page.
 * Drives tender inquiries and client consultations with SDAKW.
 */
export function CtaSection() {
  const t = useTranslations('public');

  return (
    <section className="w-full py-12 sm:py-16 lg:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-linear-to-b from-primary/10 via-primary/5 to-background p-8 sm:p-12 lg:p-16 text-center shadow-xs">
        {/* Subtle ambient light behind content */}
        <div
          className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-100 h-50 bg-primary/10 blur-2xl rounded-full -z-10"
          aria-hidden="true"
        />

        <div className="max-w-3xl mx-auto space-y-4">
          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-foreground leading-tight">
            {t('cta.title')}
          </h2>

          <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto leading-relaxed">
            {t('cta.subtitle')}
          </p>

          <div className="pt-4 flex items-center justify-center">
            <Link href="/contact">
              <Button
                size="lg"
                className="rounded-xl px-8 h-12 shadow-sm font-semibold text-sm sm:text-base gap-2.5"
              >
                <PhoneCall className="h-4 w-4" aria-hidden="true" />
                <span>{t('cta.button')}</span>
                <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
