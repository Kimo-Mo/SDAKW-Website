import { useTranslations } from 'next-intl';
import { ArrowLeft, ArrowRight, PhoneCall } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';
import { Reveal } from '@/components/shared/reveal';
import type { AboutCtaProps } from '@/types/public';
import { cn } from '@/lib/utils';

/**
 * About Us Page Closing CTA Banner
 * Implements an asymmetric editorial closing masthead connecting prospective clients
 * and governmental tenders with SDAKW's project directors.
 */
export function AboutCta({ locale, className }: AboutCtaProps) {
  const t = useTranslations('public');
  const isRtl = locale === 'ar';
  const ArrowIcon = isRtl ? ArrowLeft : ArrowRight;

  return (
    <Reveal variant="fade-scale">
      <section
        aria-labelledby="about-cta-heading"
        className={cn(
          'border border-border bg-card p-8 sm:p-12 lg:p-14 shadow-xs text-start',
          className
        )}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Heading & Subtitle (col-span-8) */}
          <div className="lg:col-span-8 space-y-3">
            <div className="text-xs font-mono rtl:font-sans font-semibold tracking-widest rtl:tracking-normal text-muted-foreground uppercase">
              07 // {t('aboutPage.cta.heading')}
            </div>
            <h2
              id="about-cta-heading"
              className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground leading-tight">
              {t('aboutPage.cta.heading')}
            </h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed max-w-2xl">
              {t('aboutPage.cta.subtitle')}
            </p>
          </div>

          {/* Right Column: Sharp Monolithic Action (col-span-4) */}
          <div className="lg:col-span-4 flex lg:justify-end">
            <Link href="/contact" className="w-full sm:w-auto">
              <Button
                size="lg"
                className="w-full sm:w-auto rounded-none px-8 h-12 gap-3 font-mono rtl:font-sans text-xs sm:text-sm uppercase tracking-wider rtl:tracking-normal font-semibold shadow-xs cursor-pointer active:scale-[0.98] transition-all duration-200 ease-[cubic-bezier(0.16,1,0.3,1)] motion-reduce:transform-none">
                <PhoneCall className="h-4 w-4 shrink-0" aria-hidden="true" />
                <span>{t('aboutPage.cta.button')}</span>
                <ArrowIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </Reveal>
  );
}
