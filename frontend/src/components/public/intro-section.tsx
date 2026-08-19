import { useTranslations } from 'next-intl';
import { ArrowRight, Building2, ShieldCheck } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';

/**
 * Public Home Page Company Introduction Section.
 * Highlights SDAKW's founding in 1999, executive overview, and ISO certifications.
 */
export function IntroSection() {
  const t = useTranslations('public');

  return (
    <section className="w-full py-16 sm:py-20 lg:py-24 bg-muted/20 border-y border-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-center">
        {/* Left / Start Column: Narrative & Values */}
        <div className="lg:col-span-7 space-y-5 text-start">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1 text-xs font-semibold text-primary shadow-xs">
            <Building2 className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{t('intro.badge')}</span>
          </div>

          <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground leading-tight">
            {t('intro.title')}
          </h2>

          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            {t('intro.paragraph1')}
          </p>

          <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
            {t('intro.paragraph2')}
          </p>

          <div className="pt-2">
            <Link href="/about">
              <Button
                size="lg"
                className="rounded-xl px-6 h-11 gap-2 text-sm font-semibold shadow-xs">
                <span>{t('intro.learnMore')}</span>
                <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
              </Button>
            </Link>
          </div>
        </div>

        {/* Right / End Column: ISO Certification Cards */}
        <div className="lg:col-span-5 space-y-3.5">
          {/* ISO 9001 Card */}
          <div className="group rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-xs transition-all duration-300 hover:border-primary/40 flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
              <ShieldCheck className="h-6 w-6" aria-hidden="true" />
            </div>
            <div className="space-y-1 text-start">
              <div className="font-heading text-sm sm:text-base font-bold text-foreground">
                ISO 9001:2015
              </div>
              <p className="text-xs text-muted-foreground leading-normal">
                {t('intro.iso9001Subtitle')}
              </p>
            </div>
          </div>

          {/* ISO 14001 Card */}
          <div className="group rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-xs transition-all duration-300 hover:border-primary/40 flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-emerald-600/10 text-emerald-600 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
              <ShieldCheck className="h-6 w-6" aria-hidden="true" />
            </div>
            <div className="space-y-1 text-start">
              <div className="font-heading text-sm sm:text-base font-bold text-foreground">
                ISO 14001:2015
              </div>
              <p className="text-xs text-muted-foreground leading-normal">
                {t('intro.iso14001Subtitle')}
              </p>
            </div>
          </div>

          {/* ISO 45001 Card */}
          <div className="group rounded-2xl border border-border bg-card p-4 sm:p-5 shadow-xs transition-all duration-300 hover:border-primary/40 flex items-start gap-4">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-amber-600/10 text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors">
              <ShieldCheck className="h-6 w-6" aria-hidden="true" />
            </div>
            <div className="space-y-1 text-start">
              <div className="font-heading text-sm sm:text-base font-bold text-foreground">
                ISO 45001:2018
              </div>
              <p className="text-xs text-muted-foreground leading-normal">
                {t('intro.iso45001Subtitle')}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
