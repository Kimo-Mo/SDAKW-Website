import { useTranslations } from 'next-intl';
import { ArrowRight, Clock, Mail, MapPin } from 'lucide-react';
import { Link } from '@/i18n/navigation';
import { Button } from '@/components/ui/button';

/**
 * Public Home Page Contact Preview Section.
 * Displays official headquarters coordinates and working hours in Sharq, Kuwait,
 * with direct navigation to the dedicated contact page.
 */
export function ContactPreviewSection() {
  const t = useTranslations('public');

  return (
    <section className="w-full py-16 sm:py-20 lg:py-24 bg-muted/10 border-t border-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center space-y-10 sm:space-y-12">
        {/* Header */}
        <div className="space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-3.5 py-1 text-xs font-semibold text-primary shadow-xs">
            <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{t('contactPreview.badge')}</span>
          </div>

          <h2 className="font-heading text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-foreground">
            {t('contactPreview.title')}
          </h2>

          <p className="text-xs sm:text-sm md:text-base text-muted-foreground leading-relaxed">
            {t('contactPreview.subtitle')}
          </p>
        </div>

        {/* 3 Coordinates Cards Grid */}
        <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-5 sm:gap-6 text-start">
          {/* Card 1: Address */}
          <div className="group rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-xs transition-all duration-300 hover:border-primary/40 space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <MapPin className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  {t('contactPreview.addressTitle')}
                </h3>
                <p className="mt-1 text-xs sm:text-sm font-medium text-foreground leading-relaxed">
                  {t('contactPreview.addressValue')}
                </p>
              </div>
            </div>
            <span className="text-xs font-semibold text-primary/80">
              {t('contactPreview.addressTag')}
            </span>
          </div>

          {/* Card 2: Hours */}
          <div className="group rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-xs transition-all duration-300 hover:border-primary/40 space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600/10 text-blue-600">
                <Clock className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  {t('contactPreview.hoursTitle')}
                </h3>
                <p className="mt-1 text-xs sm:text-sm font-medium text-foreground leading-relaxed">
                  {t('contactPreview.hoursValue')}
                </p>
              </div>
            </div>
            <span className="text-xs font-semibold text-blue-600/80">
              {t('contactPreview.hoursTag')}
            </span>
          </div>

          {/* Card 3: Email */}
          <div className="group rounded-2xl border border-border bg-card p-5 sm:p-6 shadow-xs transition-all duration-300 hover:border-primary/40 space-y-3 flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-600/10 text-emerald-600">
                <Mail className="h-5 w-5" aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-heading text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  {t('contactPreview.emailTitle')}
                </h3>
                <p className="mt-1 text-xs sm:text-sm font-medium text-foreground leading-relaxed">
                  <a
                    href="mailto:info@sdakw.com"
                    className="hover:text-primary transition-colors focus-visible:underline"
                  >
                    {t('contactPreview.emailValue')}
                  </a>
                </p>
              </div>
            </div>
            <span className="text-xs font-semibold text-emerald-600/80">
              {t('contactPreview.emailTag')}
            </span>
          </div>
        </div>

        {/* Action Button to Contact Page */}
        <div>
          <Link href="/contact">
            <Button
              variant="outline"
              size="lg"
              className="rounded-xl px-8 h-12 gap-2 text-sm font-semibold border-border hover:bg-card hover:border-primary/40 shadow-xs"
            >
              <span>{t('contactPreview.button')}</span>
              <ArrowRight className="h-4 w-4 rtl:rotate-180" aria-hidden="true" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
